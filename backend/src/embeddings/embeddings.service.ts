import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { ConfigService } from 'src/config/config.service'; 

@Injectable()
export class EmbeddingsService {
  private readonly baseURL = 'https://api.voyageai.com/v1/embeddings';
  constructor(private configService: ConfigService) {}

  private async request(input: string[], inputType: 'query' | 'document') {
    const apiKey = this.configService.getVoyageApiKey();

    const { data } = await axios.post(
      this.baseURL,
      {
        input,
        model: 'voyage-4-lite',
        input_type: inputType,
        output_dimension: 512 
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return data.data.map((d: any) => d.embedding as number[]);
  }

  async embedProduct(text: string): Promise<number[]> {
    const [embedding] = await this.request([text], 'document');
    return embedding;
  }

  async embedQuery(text: string): Promise<number[]> {
    const [embedding] = await this.request([text], 'query');
    return embedding;
  }
}