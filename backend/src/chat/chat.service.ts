import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ConfigService } from '../config/config.service';
import Groq from 'groq-sdk';
import { z } from 'zod';

const SYSTEM_PROMPT = `Tu es l'assistant virtuel d'une parapharmacie en ligne basée en Tunisie, qui vend et livre exclusivement en Tunisie.
Ton rôle est d'aider les clients tunisiens à trouver les produits adaptés à leurs besoins (peau, cheveux, douleurs, compléments, hygiène, etc.).

Règles impératives sur le contexte tunisien :
- Tous les prix sont exprimés en dinar tunisien (TND). N'utilise JAMAIS d'autre devise (€, $, MAD, etc.), même si le client mentionne un montant dans une autre monnaie — reste toujours en TND.
- Le client est en Tunisie : adapte tes conseils en conséquence (climat, disponibilité locale), sans faire d'hypothèse sur une livraison hors de Tunisie.
- Parle en français, dans un registre naturel et chaleureux, sans formalisme excessif.

Règles impératives pour l'utilisation des outils :
- La demande du client a déjà été classée comme suffisamment précise et dans le domaine de la parapharmacie
  avant d'arriver jusqu'à toi. Utilise directement l'outil "search_products" avec un objet JSON valide contenant
  "query", reformulée de façon claire pour la recherche (ex: "crème hydratante peau sèche visage").
- Si l'outil ne renvoie AUCUN résultat, ne dis JAMAIS simplement "je n'ai rien trouvé" de façon sèche : précise
  que ce produit n'est pas disponible dans le catalogue actuel, mais que l'offre évolue régulièrement et que ça
  pourrait être disponible prochainement. Ne propose JAMAIS un produit qui n'a pas été retourné par l'outil,
  même approximatif.
- Ne génère JAMAIS de balises XML ou HTML comme <function> ou <tool> dans tes réponses textuelles. Laisse l'infrastructure gérer l'appel.
- Ne répète JAMAIS le nom, le prix ou le lien des produits trouvés dans ton texte : les produits sont déjà affichés visuellement au client sous forme de fiches, juste après ton message. Contente-toi de les évoquer brièvement en une phrase de transition (ex: "Voici ce qui pourrait te convenir :"), sans détailler chaque produit un par un.
- Reste dans un rôle de conseil général : oriente vers un médecin pour tout symptôme sérieux, ne donne jamais de diagnostic.
- Sois concis.

Exemple de comportement attendu :

Client : "crème hydratante pour le visage, peau sèche"
Toi : (→ appel de l'outil search_products, puis réponse du type "Voici deux crèmes bien adaptées à une peau sèche :", sans redétailler les produits dans le texte)

Client : "avez-vous du minoxidil en mousse ?"
(→ appel de l'outil search_products, mais aucun résultat retourné)
Toi : "Je n'ai pas ce produit précis dans le catalogue actuel, mais notre offre évolue régulièrement — n'hésite pas à revenir vérifier prochainement. Je peux aussi te proposer une alternative si tu veux."
(→ dans le domaine, mais pas en stock : jamais d'invention, message ouvert sur l'avenir)`;

const CLASSIFICATION_PROMPT = `Tu es un classifieur pour l'assistant d'une parapharmacie tunisienne en ligne.
Analyse le dernier message du client (en tenant compte du contexte de la conversation) et classe-le dans une seule catégorie :

- "off_topic" : la demande n'a aucun rapport avec la parapharmacie (soin de la peau, cheveux, hygiène, douleurs,
  compléments alimentaires, bien-être, produits de santé courants). Ex: électronique, vêtements, nourriture,
  questions générales sans lien avec la santé/beauté.
- "vague" : la demande est dans le domaine de la parapharmacie MAIS ne précise ni la zone du corps/type de peau
  ou cheveux concernée, ni le symptôme ou l'objectif recherché. Ex: "j'ai mal", "je veux une crème", "un truc
  pour mes cheveux".
- "precise" : la demande est dans le domaine ET assez précise pour lancer une recherche produit. Ex: "crème
  hydratante pour peau sèche visage", "shampoing anti-pelliculaire".

Réponds UNIQUEMENT avec un objet JSON valide, sans aucun texte avant ou après, au format exact suivant :
{"type": "off_topic" | "vague" | "precise", "reply": string | null}

Règles pour le champ "reply" :
- Si "type" est "off_topic" : "reply" doit contenir une réponse polie en français expliquant que ce n'est pas
  un produit proposé par la parapharmacie, sans rattacher artificiellement la demande à un produit du catalogue.
- Si "type" est "vague" : "reply" doit contenir 1 ou 2 questions ciblées en français pour préciser le besoin
  (zone concernée, type de peau, symptôme, allergie éventuelle).
- Si "type" est "precise" : "reply" doit être null (la recherche produit sera faite séparément).

Parle en français, registre naturel et chaleureux, sans formalisme excessif. Sois concis.`;

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

const SearchProductsArgsSchema = z.object({
  query: z.string().trim().min(2, 'La requête est trop courte').max(300, 'La requête est trop longue'),
});

const ClassificationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('off_topic'), reply: z.string().min(1) }),
  z.object({ type: z.literal('vague'), reply: z.string().min(1) }),
  z.object({ type: z.literal('precise'), reply: z.string().nullable() }),
]);

type Classification = z.infer<typeof ClassificationSchema>;

const MAX_TOOL_ITERATIONS = 4;
const GROQ_TIMEOUT_MS = 15_000;
const MAX_HISTORY_MESSAGES = 10;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_PRODUCTS_RETURNED = 6; // évite de noyer le client si plusieurs recherches ont lieu dans un même tour

export interface ChatProduct {
  id: string;
  name: string;
  price: number;
  description: string | null;
  imageUrl: string | null;
  url: string;
}

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
    return messages.slice(-MAX_HISTORY_MESSAGES);
  }

  // Filet de sécurité indépendant du prompt : même si le modèle continue de
  // générer des liens markdown [Nom](/produits/id) malgré la consigne, on les
  // retire systématiquement du texte final. Les vraies cartes produits (avec
  // photo) restent le seul affichage visuel des recommandations.
  private stripProductLinks(text: string): string {
    return text
      .replace(/\[([^\]]+)\]\(\/produits\/[a-zA-Z0-9-]+\)/g, '')
      .replace(/[ \t]{2,}/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .trim();
  }

  private isRetryableError(error: any): boolean {
    const status = error?.status ?? error?.response?.status;
    return status === 429 || (status >= 500 && status < 600) || status === undefined;
  }

  private async callGroqWithRetry(
    conversation: any[],
    options: { toolChoice: 'auto' | 'none'; jsonMode?: boolean },
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
            tool_choice: options.toolChoice === 'auto' ? 'auto' : undefined,
            temperature: 0.1,
            max_tokens: 600,
            response_format: options.jsonMode ? { type: 'json_object' } : undefined,
          },
          { timeout: GROQ_TIMEOUT_MS },
        );
      } catch (error) {
        lastError = error;
        if (!this.isRetryableError(error) || attempt === maxRetries) {
          throw error;
        }
        const backoffMs = 500 * Math.pow(2, attempt);
        this.logger.warn(
          `Appel Groq échoué (tentative ${attempt + 1}/${maxRetries + 1}), nouvelle tentative dans ${backoffMs}ms`,
        );
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
      }
    }

    throw lastError;
  }

  // Classe la demande du client AVANT de lui donner accès à l'outil search_products.
  // Objectif : ne jamais exposer le tool au modèle pour les cas hors-sujet / vagues,
  // pour ne pas dépendre uniquement des instructions du system prompt (les modèles
  // rapides ont tendance à appeler un outil disponible même quand on leur dit de ne pas le faire).
  private async classifyIntent(
    truncatedMessages: { role: 'user' | 'assistant'; content: string }[],
  ): Promise<Classification> {
    const classificationConversation: any[] = [
      { role: 'system', content: CLASSIFICATION_PROMPT },
      ...truncatedMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    const response = await this.callGroqWithRetry(classificationConversation, {
      toolChoice: 'none',
      jsonMode: true,
    });

    const raw = response.choices?.[0]?.message?.content ?? '';
    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(raw);
    } catch (error) {
      this.logger.error(`Classification a renvoyé un JSON invalide: ${raw}`, error);
      // Fail open vers "precise" : au pire le modèle principal garde la main avec
      // les outils disponibles, comme avant cette optimisation.
      return { type: 'precise', reply: null };
    }

    const parsed = ClassificationSchema.safeParse(parsedJson);
    if (!parsed.success) {
      this.logger.warn(`Classification hors schéma: ${JSON.stringify(parsedJson)} — ${parsed.error.message}`);
      return { type: 'precise', reply: null };
    }

    return parsed.data;
  }

  async sendMessage(messages: { role: 'user' | 'assistant'; content: string }[]) {
    const truncatedMessages = this.truncateHistory(messages);

    let classification: Classification;
    try {
      classification = await this.classifyIntent(truncatedMessages);
    } catch (error) {
      this.logger.error('Classification échouée après tentatives de retry', error);
      return {
        reply: "Désolé, une erreur technique m'empêche de répondre pour le moment. Réessaie dans un instant.",
        products: [],
      };
    }

    // Hors-sujet ou trop vague : on répond directement, sans jamais donner accès à l'outil.
    if (classification.type === 'off_topic' || classification.type === 'vague') {
      return {
        reply: this.stripProductLinks(classification.reply),
        products: [],
      };
    }

    // "precise" : on repart sur le flux normal, avec l'outil disponible.
    let conversation: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...truncatedMessages.map((m) => ({ role: m.role, content: m.content })),
    ];

    // Accumule les produits trouvés sur tout le tour de conversation, dédupliqués par id
    const productsById = new Map<string, ChatProduct>();

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      let response: Groq.Chat.Completions.ChatCompletion;
      try {
        response = await this.callGroqWithRetry(conversation, { toolChoice: 'auto' });
      } catch (error) {
        this.logger.error('Appel Groq échoué après tentatives de retry', error);
        return {
          reply: "Désolé, une erreur technique m'empêche de répondre pour le moment. Réessaie dans un instant.",
          products: [],
        };
      }

      const message = response.choices?.[0]?.message;
      if (!message) {
        this.logger.error('Réponse Groq sans message exploitable', response);
        return {
          reply: "Désolé, je n'ai pas pu formuler de réponse claire. Peux-tu reformuler ta question ?",
          products: [],
        };
      }
      conversation.push(message);

      if (!message.tool_calls || message.tool_calls.length === 0) {
        return {
          reply: this.stripProductLinks(message.content || ''),
          products: Array.from(productsById.values()).slice(0, MAX_PRODUCTS_RETURNED),
        };
      }

      const toolResults = await Promise.all(
        message.tool_calls.map(async (toolCall) => {
          let formattedResults: ChatProduct[] = [];

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
                  description: p.description ? p.description.slice(0, MAX_DESCRIPTION_LENGTH) : null,
                  imageUrl: p.imageUrl ?? null,
                  url: `/produits/${p.slug}`,
                }));

                for (const product of formattedResults) {
                  productsById.set(product.id, product);
                }
              }
            } catch (error) {
              this.logger.error(
                `search_products a échoué (JSON invalide): ${toolCall.function.arguments}`,
                error,
              );
              formattedResults = [];
            }
          }

          // Le modèle ne voit pas les images, juste de quoi raisonner sur la pertinence.
          // Un tableau vide ici est le signal explicite pour le modèle : "aucun résultat",
          // à distinguer d'une erreur — le prompt lui dit quoi en faire dans ce cas.
          return {
            role: 'tool' as const,
            tool_call_id: toolCall.id,
            name: toolCall.function.name,
            content: JSON.stringify(
              formattedResults.map(({ id, name, price, description }) => ({ id, name, price, description })),
            ),
          };
        }),
      );

      conversation.push(...toolResults);
    }

    try {
      const finalResponse = await this.callGroqWithRetry(conversation, { toolChoice: 'none' });
      const finalMessage = finalResponse.choices?.[0]?.message?.content;
      return {
        reply: this.stripProductLinks(
          finalMessage || "Désolé, je n'ai pas trouvé de produit correspondant à ta demande.",
        ),
        products: Array.from(productsById.values()).slice(0, MAX_PRODUCTS_RETURNED),
      };
    } catch (error) {
      this.logger.error('Appel de synthèse finale échoué', error);
      return {
        reply: "Désolé, je n'ai pas pu formuler de réponse claire. Peux-tu reformuler ta question ?",
        products: [],
      };
    }
  }
}