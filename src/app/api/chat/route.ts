import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai'
import { type NextRequest, NextResponse } from 'next/server'
import { myProvider } from '@/lib/ai/providers'
import { getSession } from '@/server/auth'

export const maxDuration = 30

export async function GET(req: NextRequest) {
  const session = await getSession(req)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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
