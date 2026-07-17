import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from '../products/products.service';
import { ConfigService } from '../config/config.service';
import Groq from 'groq-sdk';

const SYSTEM_PROMPT = `Tu es l'assistant virtuel d'une parapharmacie en ligne en Tunisie.
Ton rôle est d'aider les clients à trouver les produits adaptés à leurs besoins (peau, cheveux, douleurs, compléments, hygiène, etc.).

Règles impératives pour l'utilisation des outils :
- Pour chercher des produits, tu dois TOUJOURS utiliser l'outil "search_products" en passant un objet JSON valide avec le paramètre "query".
- Ne génère JAMAIS de balises XML ou HTML comme <function> ou <tool> dans tes réponses textuelles. Laisse l'infrastructure gérer l'appel.
- Quand tu recommandes un produit trouvé, inclus toujours son lien sous la forme markdown [Nom du produit](/produits/ID).
- Si la recherche ne retourne aucun résultat pertinent, dis-le simplement au client plutôt que d'inventer un produit.
- Reste dans un rôle de conseil général : oriente vers un médecin pour tout symptôme sérieux, ne donne jamais de diagnostic.
- Sois concis, chaleureux, et parle en français.`;

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

const MAX_TOOL_ITERATIONS = 4;

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);
  private groq: Groq;

  constructor(
    private productsService: ProductsService,
    private configService: ConfigService,
  ) {
    // Initialisation du client Groq
    this.groq = new Groq({
      apiKey: this.configService.getGroqApiKey(),
    });
  }

  async sendMessage(messages: { role: 'user' | 'assistant'; content: string }[]) {
    // Convertir l'historique au format attendu par Groq / OpenAI
    let conversation: any[] = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    for (let i = 0; i < MAX_TOOL_ITERATIONS; i++) {
      let response;
      try {
        response = await this.groq.chat.completions.create({
          model: 'llama-3.3-70b-versatile',
          messages: conversation,
          tools: [SEARCH_PRODUCTS_TOOL],
          tool_choice: 'auto',
          temperature: 0.3,
          max_tokens: 600,
        });
      } catch (error) {
        this.logger.error('Appel Groq échoué', error);
        return {
          reply: "Désolé, une erreur technique m'empêche de répondre pour le moment. Réessaie dans un instant.",
        };
      }

      const message = response.choices[0].message;
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
              const args = JSON.parse(toolCall.function.arguments) as { query: string };
              const results = await this.productsService.semanticSearch(args.query, 5);
              formattedResults = results.map((p) => ({
                id: p.id,
                name: p.name,
                price: Number(p.price),
                description: p.description,
                url: `/produits/${p.slug}`,
              }));
            } catch (error) {
              this.logger.error(
                `search_products a échoué pour les arguments: ${toolCall.function.arguments}`,
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

    return { reply: "Désolé, je n'ai pas pu formuler de réponse claire. Peux-tu reformuler ta question ?" };
  }
}