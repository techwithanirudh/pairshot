'use client'

import type { PropsWithChildren } from 'react'
import { useMemo } from 'react'
import Webcam from 'react-webcam'
import { useCamera } from './root'

export function Preview({ children }: PropsWithChildren) {
  const { webcamRef, facingMode } = useCamera()

  const videoConstraints = useMemo(
    () => ({
      facingMode,
      width: { ideal: 1920 },
      height: { ideal: 1080 },
    }),
    [facingMode]
  )

  return (
    <div className='absolute inset-0'>
      <Webcam
        key={`cam-${facingMode}`}
        ref={webcamRef}
        audio={false}
        videoConstraints={videoConstraints}
        screenshotFormat='image/jpeg'
        screenshotQuality={0.8}
        className='h-full w-full object-cover'
        mirrored={facingMode === 'user'}
      />
      <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 backdrop-blur-[0.5px]' />
      {children}
    </div>
  )
}
