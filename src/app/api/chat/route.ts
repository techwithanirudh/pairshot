import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from 'ai'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { myProvider } from '@/lib/ai/providers'
import { auth } from '@/server/auth'

export const maxDuration = 30

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

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
