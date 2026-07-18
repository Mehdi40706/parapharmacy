import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ConfigService } from '../config/config.service';
import Groq from 'groq-sdk';
import { z } from 'zod';

const SYSTEM_PROMPT = `Tu es l'assistant virtuel d'une parapharmacie en ligne en Tunisie.
Ton rôle est d'aider les clients à trouver les produits adaptés à leurs besoins (peau, cheveux, douleurs, compléments, hygiène, etc.).

Règles impératives pour l'utilisation des outils :
- Avant de chercher, évalue si la demande du client est assez précise pour lancer une recherche utile.
  Une demande est TROP VAGUE si elle ne précise ni la zone du corps/type de peau ou cheveux concernée,
  ni le symptôme ou l'objectif recherché (ex: "j'ai mal", "je veux une crème", "un truc pour mes cheveux").
- Si la demande est trop vague, NE PAS appeler d'outil : pose 1 ou 2 questions ciblées pour préciser le besoin
  (ex: zone concernée, type de peau, symptôme, allergie éventuelle) avant de chercher.
- Si la demande est déjà précise (ex: "crème hydratante pour peau sèche visage", "shampoing anti-pelliculaire"),
  utilise directement l'outil "search_products" avec un objet JSON valide contenant "query".
- Ne génère JAMAIS de balises XML ou HTML comme <function> ou <tool> dans tes réponses textuelles. Laisse l'infrastructure gérer l'appel.
- Quand tu recommandes un produit trouvé, inclus toujours son lien sous la forme markdown [Nom du produit](/produits/ID).
- Si la recherche ne retourne aucun résultat pertinent, dis-le simplement au client plutôt que d'inventer un produit.
- Reste dans un rôle de conseil général : oriente vers un médecin pour tout symptôme sérieux, ne donne jamais de diagnostic.
- Sois concis, chaleureux, et parle en français.

Exemple de comportement attendu :
Client : "je veux une crème"
Toi : "Bien sûr ! Pour bien te conseiller, c'est pour quelle zone (visage, corps, mains) et quel est ton type de peau (sèche, grasse, sensible) ?"
(→ pas d'appel d'outil ici, la demande est trop vague)

Client : "crème hydratante pour le visage, peau sèche"
Toi : (→ appel de l'outil search_products avec query="crème hydratante visage peau sèche")`;
// Définition de l'outil au format standard OpenAI/Groq
const SEARCH_PRODUCTS_TOOL = {
  type: 'function' as const,
  function: {
    name: 'search_products',
    description: "Recherche des produits pertinents dans le catalogue de la parapharmacie via recherche sémantique.",
    parameters: {
      type: 'object',
      properties: {
        query: {
          type: 'string',
          description: "Description du besoin du client, reformulée pour la recherche (ex: 'crème hydratante peau sèche visage')",
        },
      },
      required: ['query'],
    },
  },
};

// Validation runtime des arguments renvoyés par le modèle pour cet outil
const SearchProductsArgsSchema = z.object({
  query: z.string().trim().min(2, 'La requête est trop courte').max(300, 'La requête est trop longue'),
});

const MAX_TOOL_ITERATIONS = 4;
const GROQ_TIMEOUT_MS = 15_000;
const MAX_HISTORY_MESSAGES = 10; // ~5 échanges user/assistant
const MAX_DESCRIPTION_LENGTH = 200;


@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private groq: Groq;

  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
  ) {
    this.groq = new Groq({
      apiKey: this.configService.getGroqApiKey(),
    });
  }
  private truncateHistory(
    messages: { role: 'user' | 'assistant'; content: string }[],
  ): { role: 'user' | 'assistant'; content: string }[] {
    if (messages.length <= MAX_HISTORY_MESSAGES) {
      return messages;
    }
    // Garde les N derniers messages — le contexte récent est ce qui compte
    // le plus pour une conversation de type support produit.
    return messages.slice(-MAX_HISTORY_MESSAGES);
  }

  private isRetryableError(error: any): boolean {
    const status = error?.status ?? error?.response?.status;
    // 429 = rate limit, 5xx = erreur serveur Groq, undefined = erreur réseau/timeout
    return status === 429 || (status >= 500 && status < 600) || status === undefined;
  }

  private async callGroqWithRetry(
    conversation: any[],
    options: { toolChoice: 'auto' | 'none' },
    maxRetries = 2,
  ): Promise<Groq.Chat.Completions.ChatCompletion> {
    let lastError: any;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await this.groq.chat.completions.create(
          {
            model: 'llama-3.3-70b-versatile',
            messages: conversation,
            tools: options.toolChoice === 'auto' ? [SEARCH_PRODUCTS_TOOL] : undefined,
            tool_choice: options.toolChoice,
            temperature: 0.3,
            max_tokens: 600,
          },
          { timeout: GROQ_TIMEOUT_MS },
        );
      } catch (error) {
        lastError = error;

        if (!this.isRetryableError(error) || attempt === maxRetries) {
          throw error;
        }

        const backoffMs = 500 * Math.pow(2, attempt); // 500ms, puis 1000ms
        this.logger.warn(
          `Appel Groq échoué (tentative ${attempt + 1}/${maxRetries + 1}), nouvelle tentative dans ${backoffMs}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    throw lastError;
  }

  async sendMessage(messages: { role: 'user' | 'assistant'; content: string }[]) {
    const truncatedMessages = this.truncateHistory(messages);

    let conversation: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...truncatedMessages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
    ];

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      let response: Groq.Chat.Completions.ChatCompletion;
      try {
        response = await this.callGroqWithRetry(conversation, { toolChoice: 'auto' });
      } catch (error) {
        this.logger.error('Appel Groq échoué après tentatives de retry', error);
        return {
          reply: "Désolé, une erreur technique m'empêche de répondre pour le moment. Réessaie dans un instant.",
        };
      }

      const message = response.choices?.[0]?.message;
      if (!message) {
        this.logger.error('Réponse Groq sans message exploitable', response);
        return {
          reply: "Désolé, je n'ai pas pu formuler de réponse claire. Peux-tu reformuler ta question ?",
        };
      }
      conversation.push(message);

      // Si le modèle ne veut pas appeler d'outil, on renvoie simplement son texte
      if (!message.tool_calls || message.tool_calls.length === 0) {
        return { reply: message.content || '' };
      }

      // Traitement des appels d'outils en parallèle, chacun protégé individuellement
      const toolResults = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          let formattedResults: any[] = [];

          if (toolCall.function.name === 'search_products') {
            try {
              const rawArgs = JSON.parse(toolCall.function.arguments);
              const parsed = SearchProductsArgsSchema.safeParse(rawArgs);

              if (!parsed.success) {
                this.logger.warn(
                  `Arguments invalides pour search_products: ${JSON.stringify(rawArgs)} — ${parsed.error.message}`,
                );
                formattedResults = [];
              } else {
                const results = await this.productsService.semanticSearch(parsed.data.query, 5);
                formattedResults = results.map((p) => ({
                  id: p.id,
                  name: p.name,
                  price: Number(p.price),
                  description: p.description
                    ? p.description.slice(0, MAX_DESCRIPTION_LENGTH)
                    : null,
                  url: `/produits/${p.slug}`,
                }));
              }
            } catch (error) {
              this.logger.error(
                `search_products a échoué (JSON invalide): ${toolCall.function.arguments}`,
                error,
              );
              formattedResults = [];
            }
          }

          return {
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: JSON.stringify(formattedResults),
          };
        }),
      );

      conversation.push(...toolResults);
    }

    // La boucle s'est terminée par épuisement des itérations, pas par une réponse
    // textuelle. Les résultats d'outils sont déjà dans `conversation` : on force
    // une synthèse textuelle plutôt que de jeter ce travail avec un message d'échec.
    try {
      const finalResponse = await this.callGroqWithRetry(conversation, { toolChoice: 'none' });
      const finalMessage = finalResponse.choices?.[0]?.message?.content;
      return {
        reply: finalMessage || "Désolé, je n'ai pas trouvé de produit correspondant à ta demande.",
      };
    } catch (error) {
      this.logger.error('Appel de synthèse finale échoué', error);
      return {
        reply: "Désolé, je n'ai pas pu formuler de réponse claire. Peux-tu reformuler ta question ?",
      };
    }
  }
}