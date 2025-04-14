import { OllamaAdapter } from './OllamaAdapter';

export class AIService {
  private ollamaAdapter: OllamaAdapter;
  
  constructor(modelName: string = 'qwen2.5:3b') {
    this.ollamaAdapter = new OllamaAdapter(modelName);
  }
  
  async processUserMessage(messages: Array<{role: string, content: string}>, context: any = {}) {
    try {
      const response = await this.ollamaAdapter.chat(messages, context);
      console.log(response)
      return response;
    } catch (error) {
      console.error('AI处理错误:', error);
      throw error;
    }
  }
} 