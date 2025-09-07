'use client'
import { UnsupportedPlatform } from '@/components/unsupported-platform'
import { useMediaQuery } from '@/hooks/use-media-query'

export function Camera() {
  const isMobile = useMediaQuery('(max-width: 768px)')

  if (!isMobile) {
    return (
      <div className='relative mx-auto flex size-full h-svh max-w-lg items-center justify-center p-6'>
        <UnsupportedPlatform />
      </div>
    )
  }

  return (
    <div>
      <Snap.Root>
        <Snap.Header />
        <Snap.Preview>
          <Snap.Gallery />
          <Snap.Shutter />
        </Snap.Preview>
      </Snap.Root>
    </div>
  )
}
