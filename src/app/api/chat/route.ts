import { convertToModelMessages, streamText, type UIMessage } from 'ai'
import { myProvider } from '@/lib/ai/providers'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json()

  const result = streamText({
    model: myProvider.languageModel(model),
    messages: convertToModelMessages(messages),
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
  })

  // send sources and reasoning back to the client
  return result.toUIMessageStreamResponse({
    sendSources: true,
    sendReasoning: true,
  })
}
