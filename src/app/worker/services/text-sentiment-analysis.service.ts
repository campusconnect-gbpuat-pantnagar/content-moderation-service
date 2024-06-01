import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';

import { ConfigService } from '@nestjs/config';
import {
  SafetyCheckResponse,
  SentimentScore,
} from 'src/libraries/interfaces/sentiment-analysis.interface';

@Injectable()
export class TextSentimentAnalysisService {
  private readonly logger = new Logger(TextSentimentAnalysisService.name);
  private readonly NEGATIVE_THRESHOLD: number;
  constructor(
    private readonly httpService: HttpService,
    private readonly _configService: ConfigService,
  ) {
    this.NEGATIVE_THRESHOLD =
      this._configService.get<number>('NEGATIVE_THRESHOLD');
  }

  async analyzeTextSentiment(text: string): Promise<SafetyCheckResponse> {
    const apiUrl =
      'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest';

    const apiKey = `Bearer ${this._configService.get<string>('HUGGING_FACE_TOKEN')}`;

    try {
      const response: AxiosResponse<SentimentScore[][]> = await firstValueFrom(
        this.httpService.post(
          apiUrl,
          { inputs: text },
          {
            headers: {
              Authorization: apiKey,
            },
          },
        ),
      );
      const sentiments = response.data[0];
      const negativeSentiment = sentiments.find(
        (sentiment) => sentiment.label === 'negative',
      );

      console.log(sentiments);

      const isSafe = negativeSentiment
        ? negativeSentiment.score < this.NEGATIVE_THRESHOLD
        : true;
      return {
        isSafe,
        sentiments,
      };
    } catch (error) {
      this.logger.error('Error analyzing text sentiment:', error);
      throw error;
    }
  }
}
