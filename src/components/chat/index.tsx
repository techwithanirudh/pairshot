'use client'

import { useChat } from '@ai-sdk/react'
import Image from 'next/image'
import type React from 'react'
import { useCallback, useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
} from '@/components/ai-elements/prompt-input'
import type { Attachment } from '@/lib/types'
import Camera from '../camera'
import type { FilePart } from 'ai'
import { PreviewAttachment } from './preview-attachment'
import { Loader2 } from 'lucide-react'

function Chat() {
  const [input, setInput] = useState('')
  const { sendMessage, status, messages } = useChat()
  const [attachments, setAttachments] = useState<Array<Attachment>>([])

  const [isCameraOpen, setIsCameraOpen] = useState(true)
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
    // biome-ignore lint/correctness/useExhaustiveDependencies: uploadFile changes on every re-render and should not be used as a hook dependency
    [uploadFile]
  )

  const isImageFilePart = (part: unknown): part is FilePart => {
    const candidate = part as {
      type?: unknown
      url?: unknown
      mediaType?: unknown
    }
    return (
      candidate !== null &&
      typeof candidate === 'object' &&
      candidate.type === 'file' &&
      typeof candidate.url === 'string' &&
      (candidate.mediaType === undefined ||
        typeof candidate.mediaType === 'string')
    )
  }

  const image = (() => {
    for (let i = messages.length - 1; i >= 0; i--) {
      if (messages[i].role !== 'assistant') return undefined
      const parts = messages[i].parts ?? []
      for (let j = parts.length - 1; j >= 0; j--) {
        const p = parts[j]
        if (isImageFilePart(p) && p.mediaType?.startsWith?.('image')) {
          return p.url
        }
      }
    }
    return undefined
  })()

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
        <div className='relative flex flex-1 flex-col'>
          <div className='relative flex-1'>
            {image ? (
              <Image
                src={image}
                alt='latest result'
                fill
                sizes='100vw'
                className='object-cover'
                unoptimized
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-muted-foreground'>
                {uploadQueue.length > 0 && (
                  <div className='flex items-center gap-2'>
                    <p>Uploading...</p> <Loader2 className='animate-spin' />
                  </div>
                )}
                {status === 'submitted' || status === 'streaming'
                  ? 'Generating image...'
                  : ''}
                {!image &&
                  status !== 'submitted' &&
                  status !== 'streaming' &&
                  uploadQueue.length === 0 && (
                    <p>Send your prompt to generate an image</p>
                  )}
              </div>
            )}
            <div className='pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20' />
          </div>

          <div className='relative w-full p-safe-or-2'>
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
                placeholder='Describe an edit…'
                disabled={
                  status === 'submitted' ||
                  status === 'streaming' ||
                  uploadQueue.length > 0
                }
              />
              <div className='flex items-center justify-end p-1'>
                <PromptInputSubmit
                  disabled={
                    !input ||
                    status === 'submitted' ||
                    status === 'streaming' ||
                    uploadQueue.length > 0
                  }
                  status={status}
                />
              </div>
            </PromptInput>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chat
