export interface IAiTextGenerationService {
  generateText(prompt: string): Promise<string>;
}
