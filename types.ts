export enum AIProvider {
  GROQ = 'Groq Console',
  OLLAMA = 'Ollama (Local)',
  GEMINI = 'Google Gemini',
  CLAUDE = 'Anthropic Claude',
  QWEN = 'Qwen (via API)',
  Z_AI = 'Z AI'
}

export interface BotConfiguration {
  provider: AIProvider;
  apiKey: string;
  model: string;
  triggerWord: string;
  language: string;
}

export const PROVIDER_MODELS: Record<AIProvider, string[]> = {
  [AIProvider.GROQ]: ['llama3-70b-8192', 'llama3-8b-8192', 'mixtral-8x7b-32768', 'gemma-7b-it'],
  [AIProvider.OLLAMA]: ['llama3', 'mistral', 'qwen', 'gemma', 'neural-chat'],
  [AIProvider.GEMINI]: ['gemini-1.5-flash', 'gemini-1.5-pro'],
  [AIProvider.CLAUDE]: ['claude-3-opus-20240229', 'claude-3-sonnet-20240229', 'claude-3-haiku-20240307'],
  [AIProvider.QWEN]: ['qwen-max', 'qwen-turbo'],
  [AIProvider.Z_AI]: ['standard', 'premium']
};