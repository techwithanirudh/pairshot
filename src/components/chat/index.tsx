'use client'

import { useChat } from '@ai-sdk/react'
import { RefreshCcwIcon } from 'lucide-react'
import type React from 'react'
import { useCallback, useState } from 'react'
import { toast } from 'sonner'
import { Action, Actions } from '@/components/ai-elements/actions'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import type { Attachment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Loader } from '../ai-elements/loader'
import { Message, MessageContent } from '../ai-elements/message'
import { Response } from '../ai-elements/response'
import Camera from '../camera'
import { PreviewAttachment } from './preview-attachment'

function Chat() {
  const [input, setInput] = useState('')
  const { sendMessage, status, messages, regenerate } = useChat()
  const [attachments, setAttachments] = useState<Array<Attachment>>([])
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

  const [isCameraOpen, setIsCameraOpen] = useState(true)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      sendMessage({
        role: 'user',
        parts: [
          ...attachments.map((attachment) => ({
            type: 'file' as const,
            url: attachment.url,
            name: attachment.name,
            mediaType: attachment.contentType,
          })),
          { type: 'text', text: input },
        ],
      })

      setAttachments([])
      setInput('')
    }
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/files/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        const { url, pathname, contentType } = data

        return {
          url,
          name: pathname,
          contentType: contentType,
        }
      }
      const { error } = await response.json()
      toast.error(error)
    } catch (_error) {
      toast.error('Failed to upload file, please try again!')
    }
  }

  const handleFiles = useCallback(
    async (files: File[]) => {
      setIsCameraOpen(false)
      setUploadQueue(files.map((file) => file.name))

      try {
        const uploadPromises = files.map((file) => uploadFile(file))
        const uploadedAttachments = await Promise.all(uploadPromises)
        const successfullyUploadedAttachments = uploadedAttachments.filter(
          (attachment) => attachment !== undefined
        )

        setAttachments((currentAttachments) => [
          ...currentAttachments,
          ...successfullyUploadedAttachments,
        ])
      } catch (error) {
        console.error('Error uploading files!', error)
      } finally {
        setUploadQueue([])
      }
    },
    [uploadFile]
  )

  return (
    <div className='relative flex h-screen flex-col'>
      {isCameraOpen ? (
        <Camera.Root onFinish={handleFiles}>
          <Camera.Preview>
            <Camera.Header />
            <Camera.Dock />
            <Camera.Controls />
          </Camera.Preview>
        </Camera.Root>
      ) : (
        <div className='relative flex flex-1 flex-col items-center justify-center p-safe-or-2'>
          {messages.length > 0 && (
            <Conversation className='h-full overflow-y-auto'>
              <ConversationContent>
                {messages.map((message) => (
                  <div key={message.id}>
                    <div
                      className={cn('flex flex-col', {
                        'gap-2 md:gap-4': message.parts?.some(
                          (p) => p.type === 'text' && p.text?.trim()
                        ),
                        'min-h-96': message.role === 'assistant' && true,
                        'w-full':
                          (message.role === 'assistant' &&
                            message.parts?.some(
                              (p) => p.type === 'text' && p.text?.trim()
                            )) ||
                          true,
                        'max-w-[90%] sm:max-w-[min(fit-content,80%)]':
                          message.role === 'user' && true,
                      })}
                    >
                      {message.parts.filter((part) => part.type === 'file')
                        .length > 0 && (
                        <Message from={message.role}>
                          <MessageContent>
                            <div
                              data-testid={`message-attachments`}
                              className='flex flex-row justify-end gap-2'
                            >
                              {message.parts
                                .filter((part) => part.type === 'file')
                                .map((attachment) => (
                                  <PreviewAttachment
                                    key={attachment.url}
                                    attachment={{
                                      name: attachment.filename ?? 'file',
                                      contentType: attachment.mediaType,
                                      url: attachment.url,
                                    }}
                                    className={cn({
                                      'size-full': message.role === 'assistant',
                                    })}
                                  />
                                ))}
                            </div>
                            <Response>
                              {message.parts
                                .filter((part) => part.type === 'text')
                                .map((part) => part.text)
                                .join('')}
                            </Response>
                          </MessageContent>
                          {message.role === 'assistant' &&
                            message.id === messages.at(-1)?.id && (
                              <Actions className='mt-2'>
                                <Action
                                  onClick={() => regenerate()}
                                  label='Retry'
                                >
                                  <RefreshCcwIcon className='size-3' />
                                </Action>
                              </Actions>
                            )}
                        </Message>
                      )}
                    </div>
                  </div>
                ))}
                {status === 'submitted' && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          )}

          <div className='relative flex w-full flex-col gap-4'>
            <PromptInput
              onSubmit={handleSubmit}
              className='rounded-2xl border-none bg-card'
            >
              {(attachments.length > 0 || uploadQueue.length > 0) && (
                <div
                  data-testid='attachments-preview'
                  className='flex flex-row items-end gap-2 overflow-x-scroll px-3 py-2'
                >
                  {attachments.map((attachment) => (
                    <PreviewAttachment
                      key={attachment.url}
                      attachment={attachment}
                      onRemove={() => {
                        setAttachments((currentAttachments) =>
                          currentAttachments.filter(
                            (a) => a.url !== attachment.url
                          )
                        )
                      }}
                    />
                  ))}

                  {uploadQueue.map((filename) => (
                    <PreviewAttachment
                      key={filename}
                      attachment={{
                        url: '',
                        name: filename,
                        contentType: '',
                      }}
                      isUploading={true}
                    />
                  ))}
                </div>
              )}

              <PromptInputTextarea
                onChange={(e) => setInput(e.target.value)}
                value={input}
                placeholder='Modify the image in any way you want...'
              />
              <PromptInputToolbar>
                <PromptInputTools />
                <PromptInputSubmit disabled={!input} status={status} />
              </PromptInputToolbar>
            </PromptInput>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
