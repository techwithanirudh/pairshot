'use client'
import type { Session, User } from 'better-auth'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import { UnsupportedPlatform } from '@/components/unsupported-platform'
import { useUploadFile } from '@/hooks/useUploadFile'
import Camera from '@/components/camera'

export function App({
  session: _session,
}: {
  session: {
    user: User
    session: Session
  }
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const upload = useUploadFile()
  const [isUploading, setIsUploading] = useState(false)

  if (!mounted) {
    return (
      <div className='relative mx-auto flex size-full h-svh max-w-lg items-center justify-center p-6'>
        <Loader2 className='size-10 animate-spin' />
      </div>
    )
  }

  if (!isMobile) {
    return (
      <div className='relative mx-auto flex size-full h-svh max-w-lg items-center justify-center p-6'>
        <UnsupportedPlatform />
      </div>
    )
  }

  const handleImagesReady = async (imgs: string[]) => {
    setIsUploading(true)
    try {
      for (const [i, dataUrl] of imgs.entries()) {
        const res = await fetch(dataUrl)
        const blob = await res.blob()
        const file = new File([blob], `photo-${Date.now()}-${i}.jpg`, {
          type: blob.type || 'image/jpeg',
        })
        await upload.mutateAsync(file)
      }
    } catch (e) {
      console.error('Failed to upload image', e)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <Camera.Root onFinish={handleImagesReady}>
        <Camera.Preview>
          <Camera.Header />
          <Camera.Dock />
          <Camera.Controls />
        </Camera.Preview>
      </Camera.Root>

      {isUploading && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60'>
          <div className='flex flex-col items-center space-y-4 rounded-lg bg-white/5 p-6 backdrop-blur-md'>
            <Loader2 className='size-12 animate-spin text-white' />
            <span className='text-white'>Uploading...</span>
          </div>
        </div>
      )}
    </div>
  )
}
