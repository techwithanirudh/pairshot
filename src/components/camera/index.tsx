'use client'
import { useEffect, useState } from 'react'
import { UnsupportedPlatform } from '@/components/unsupported-platform'
import { Camera } from './snap'
import { Loader2 } from 'lucide-react'
import {isMobile} from 'react-device-detect';

export function App() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

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

  return (
    <div>
      <Camera.Root onImagesReady={(imgs) => console.log('ready', imgs)}>
        <Camera.Preview>
          <Camera.Header />
          <Camera.Dock />
          <Camera.Controls />
          <Camera.CountBadge />
        </Camera.Preview>
      </Camera.Root>
    </div>
  )
}
