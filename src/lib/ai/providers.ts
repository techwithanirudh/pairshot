import { openai } from '@ai-sdk/openai'
import { customProvider } from 'ai'

export const myProvider = customProvider({
  languageModels: {
    'chat-model': openai('gpt-4o'),
    'chat-model-reasoning': openai('gpt-5'),
  },
  imageModels: {
    'small-model': openai.imageModel('dall-e-3'),
  },
})
