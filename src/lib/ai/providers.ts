import { google } from '@ai-sdk/google'
import { customProvider } from 'ai'

export const myProvider = customProvider({
  languageModels: {
    'chat-model': google.languageModel('gemini-2.5-flash-image-preview'),
  },
})
