'use client'

import { type UseChatHelpers, useChat } from '@ai-sdk/react'
import type { UIMessage } from 'ai'
import { PaperclipIcon } from 'lucide-react'
import type React from 'react'
import { type ChangeEvent, memo, useCallback, useRef, useState } from 'react'
import { toast } from 'sonner'
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from '@/components/ai-elements/prompt-input'
import type { Attachment } from '@/lib/types'
import { Button } from '../ui/button'
import { PreviewAttachment } from './preview-attachment'
import Camera from '../camera'

function Chat() {
  const [input, setInput] = useState('')
  const { sendMessage, status, regenerate } = useChat()
  const [attachments, setAttachments] = useState<Array<Attachment>>([])

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
      {uploadQueue.length === 0 && (
        <Camera.Root onFinish={handleFiles}>
          <Camera.Preview>
            <Camera.Header />
            <Camera.Dock />
            <Camera.Controls />
          </Camera.Preview>
        </Camera.Root>
      )}
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
    </div>
  )
}

export default Chat
