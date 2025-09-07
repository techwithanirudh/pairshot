'use client'
import type { Session, User } from 'better-auth'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Camera from '@/components/camera'
import { ProcessingScreen } from '@/components/processing'
import { UnsupportedPlatform } from '@/components/unsupported-platform'

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

  const [images, setImages] = useState<string[]>([])
  const [status, setStatus] = useState<
    'capturing' | 'processing' | 'completed' | 'error'
  >('capturing')

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

  const onFinish = async (imgs: string[]) => {
    setImages(imgs)
    setStatus('processing')
  }

  return (
    <div>
      {status === 'capturing' && (
        <Camera.Root onFinish={onFinish}>
          <Camera.Preview>
            <Camera.Header />
            <Camera.Dock />
            <Camera.Controls />
          </Camera.Preview>
        </Camera.Root>
      )}
      {status === 'processing' && <ProcessingScreen images={images} />}
      {status === 'completed' && <div>Completed</div>}
      {status === 'error' && <div>Error</div>}
    </div>
  )
}
