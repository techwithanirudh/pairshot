import { google } from '@ai-sdk/google'
import { customProvider } from 'ai'

export const myProvider = customProvider({
  languageModels: {
    'image-model': google('gemini-2.5-flash-image'),
  },
})
