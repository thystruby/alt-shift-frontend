import { GoogleGenAI } from '@google/genai';
import type { IAiTextGenerationService } from '@/shared/types';

interface IGoogleGenAiTextGenerationServiceOptions {
  apiKey?: string;
  model?: string;
}

const DEFAULT_MODEL = 'gemini-2.5-flash-lite';

export class GoogleGenAiTextGenerationService implements IAiTextGenerationService {
  private readonly apiKey?: string;

  private client?: GoogleGenAI;

  private readonly model: string;

  constructor ({
    apiKey = import.meta.env.VITE_GOOGLE_GEN_AI_API_KEY,
    model = DEFAULT_MODEL,
  }: IGoogleGenAiTextGenerationServiceOptions = {}) {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateText (prompt: string): Promise<string> {
    const response = await this.getClient().models.generateContent({
      config: {
        responseMimeType: 'text/plain',
        temperature: 0.4,
      },
      contents: prompt,
      model: this.model,
    });

    const generatedText = response.text?.trim();

    if (!generatedText) {
      throw new Error('Google Gen AI returned an empty response.');
    }

    return generatedText;
  }

  private getClient (): GoogleGenAI {
    if (!this.apiKey) {
      throw new Error('Google Gen AI API key is not configured.');
    }

    if (!this.client) {
      this.client = new GoogleGenAI({ apiKey: this.apiKey });
    }

    return this.client;
  }
}

export const googleGenAiTextGenerationService = new GoogleGenAiTextGenerationService();
