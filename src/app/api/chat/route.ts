import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai'
import { myProvider } from '@/lib/ai/providers'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json()

  const result = streamText({
    model: myProvider.languageModel('chat-model'),
    messages: convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
    stopWhen: stepCountIs(10),
  })

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  })
}
