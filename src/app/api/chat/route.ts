import {
  convertToModelMessages,
  experimental_createMCPClient as createMCPClient,
  streamText,
  type UIMessage,
} from 'ai'
import { env } from '@/env'
import { myProvider } from '@/lib/ai/providers'

export const maxDuration = 30

export async function POST(req: Request) {
  const { messages, model }: { messages: UIMessage[]; model: string } =
    await req.json()

  const mcpClient = await createMCPClient({
    transport: {
      type: 'sse',
      url: `${env.HOME_ASSISTANT_URL}/mcp_server/sse`,
      headers: {
        Authorization: `Bearer ${env.HOME_ASSISTANT_TOKEN}`,
      },
    },
  })

  const tools = await mcpClient.tools()

  const result = streamText({
    model: myProvider.languageModel(model),
    messages: convertToModelMessages(messages),
    tools,
    system:
      'You are a helpful assistant that can answer questions and help with tasks',
    onFinish: async () => {
      await mcpClient.close()
    },
  })

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  })
}
