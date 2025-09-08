'use client'
import { Loader2 } from 'lucide-react'
import { useLayoutEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Chat from '@/components/chat'
import { UnsupportedPlatform } from '@/components/unsupported-platform'

function Page() {
  const [mounted, setMounted] = useState(false)

  useLayoutEffect(() => {
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

  return <Chat />
}

export default Page
