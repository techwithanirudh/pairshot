'use client'
import type { Session, User } from 'better-auth'
import { Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { isMobile } from 'react-device-detect'
import Chat from '@/components/chat'
import { UnsupportedPlatform } from '@/components/unsupported-platform'

function Page({
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
      <Chat />
    </div>
  )
}

export default Page
