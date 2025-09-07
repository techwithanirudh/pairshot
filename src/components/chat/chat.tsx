'use client'

import { type UseChatHelpers, useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { CopyIcon, PaperclipIcon, RefreshCcwIcon } from 'lucide-react'
import type React from 'react'
import {
  type ChangeEvent,
  Fragment,
  memo,
  useCallback,
  useRef,
  useState,
} from 'react'
import { toast } from 'sonner'
import { Action, Actions } from '@/components/ai-elements/actions'
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '@/components/ai-elements/conversation'
import { Loader } from '@/components/ai-elements/loader'
import { Message, MessageContent } from '@/components/ai-elements/message'
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from '@/components/ai-elements/reasoning'
import { Response } from '@/components/ai-elements/response'
import type { Attachment } from '@/lib/types'
import { cn } from '@/lib/utils'
import { Button } from '../ui/button'
import { PreviewAttachment } from './preview-attachment'

function PureAttachmentsButton({
  fileInputRef,
  status,
}: {
  fileInputRef: React.MutableRefObject<HTMLInputElement | null>
  status: UseChatHelpers<UIMessage>['status']
}) {
  return (
    <Button
      data-testid='attachments-button'
      className='h-fit rounded-md p-1.5 transition-colors duration-200 hover:bg-muted'
      onClick={(event) => {
        event.preventDefault()
        fileInputRef.current?.click()
      }}
      disabled={status !== 'ready'}
      variant='ghost'
      size='sm'
    >
      <PaperclipIcon size={14} />
    </Button>
  )
}

const AttachmentsButton = memo(PureAttachmentsButton)

function Chat() {
  const [input, setInput] = useState('')
  const { messages, sendMessage, status, regenerate } = useChat()
  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [uploadQueue, setUploadQueue] = useState<Array<string>>([])

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

  const handleFileChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(event.target.files || [])

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
    <div className='flex h-full flex-col'>
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
                {message.parts.filter((part) => part.type === 'file').length >
                  0 && (
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
                        />
                      ))}
                  </div>
                )}
              </div>

              {message.parts.map((part, i) => {
                switch (part.type) {
                  case 'text':
                    return (
                      <Fragment key={`${message.id}-${i}`}>
                        <Message from={message.role}>
                          <MessageContent>
                            <Response>{part.text}</Response>
                          </MessageContent>
                        </Message>
                        {message.role === 'assistant' &&
                          i === messages.length - 1 && (
                            <Actions className='mt-2'>
                              <Action
                                onClick={() => regenerate()}
                                label='Retry'
                              >
                                <RefreshCcwIcon className='size-3' />
                              </Action>
                              <Action
                                onClick={() =>
                                  navigator.clipboard.writeText(part.text)
                                }
                                label='Copy'
                              >
                                <CopyIcon className='size-3' />
                              </Action>
                            </Actions>
                          )}
                      </Fragment>
                    )
                  case 'reasoning':
                    return (
                      <Reasoning
                        key={`${message.id}-${i}`}
                        className='w-full'
                        isStreaming={
                          status === 'streaming' &&
                          i === message.parts.length - 1 &&
                          message.id === messages.at(-1)?.id
                        }
                      >
                        <ReasoningTrigger />
                        <ReasoningContent>{part.text}</ReasoningContent>
                      </Reasoning>
                    )
                  default:
                    return null
                }
              })}
            </div>
          ))}
          {messages.length === 0 && (
            <div className='flex h-[calc(100svh_-_theme(spacing.64))] items-center justify-center'>
              <h1 className='font-bold text-3xl'>
                What would you like to discuss?
              </h1>
            </div>
          )}
          {status === 'submitted' && <Loader />}
        </ConversationContent>
        <ConversationScrollButton />
      </Conversation>

      <div className='relative flex w-full flex-col gap-4'>
        <input
          type='file'
          className='-top-4 -left-4 pointer-events-none fixed size-0.5 opacity-0'
          ref={fileInputRef}
          multiple
          onChange={handleFileChange}
          tabIndex={-1}
        />

        <PromptInput onSubmit={handleSubmit} className='mt-4'>
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
                      currentAttachments.filter((a) => a.url !== attachment.url)
                    )
                    if (fileInputRef.current) {
                      fileInputRef.current.value = ''
                    }
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
          />
          <PromptInputToolbar>
            <PromptInputTools className='gap-2'>
              <AttachmentsButton fileInputRef={fileInputRef} status={status} />
            </PromptInputTools>
            <PromptInputSubmit disabled={!input} status={status} />
          </PromptInputToolbar>
        </PromptInput>
      </div>
    </div>
  )
}

export default Chat
