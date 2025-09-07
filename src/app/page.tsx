'use client'

import { Monitor, Smartphone } from 'lucide-react'
import { useState } from 'react'
import { CameraInterface } from '@/components/camera-interface'
import { ProcessingScreen } from '@/components/processing-screen'
import { ResultScreen } from '@/components/result-screen'
import { useMediaQuery } from '@/hooks/use-media-query'

export default function AddMeApp() {
  const [currentScreen, setCurrentScreen] = useState<
    'camera' | 'processing' | 'result'
  >('camera')
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const isMobile = useMediaQuery('(max-width: 768px)')

  const handleImagesReady = (images: string[]) => {
    setCapturedImages(images)
    setCurrentScreen('processing')

    // Simulate AI processing time
    setTimeout(() => {
      setCurrentScreen('result')
    }, 3000)
  }

  const handleStartOver = () => {
    setCurrentScreen('camera')
    setCapturedImages([])
  }

  if (!isMobile) {
    return (
      <div className='desktop-warning flex min-h-screen items-center justify-center bg-gradient-to-br from-background via-muted/30 to-background p-6'>
        <div className='glass-morphism max-w-md space-y-6 rounded-3xl p-8 text-center'>
          <div className='relative'>
            <div className='ai-gradient pulse-glow mx-auto flex h-20 w-20 items-center justify-center rounded-3xl'>
              <Smartphone className='h-10 w-10 text-white' />
            </div>
            <div className='-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full bg-destructive'>
              <Monitor className='h-4 w-4 text-destructive-foreground' />
            </div>
          </div>

          <div className='space-y-3'>
            <h1 className='font-bold text-2xl text-foreground'>
              Mobile Only Experience
            </h1>
            <p className='text-pretty text-muted-foreground'>
              Add Me is designed exclusively for mobile devices. Please open
              this app on your smartphone to capture and combine photos with AI.
            </p>
          </div>

          <div className='rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm'>
            <p className='mb-2 font-medium'>Why mobile only?</p>
            <p>
              Camera access and photo combining work best on mobile devices
              where you can easily switch between front and back cameras.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='mobile-only min-h-screen bg-background'>
      {currentScreen === 'camera' && (
        <CameraInterface onImagesReady={handleImagesReady} />
      )}
      {currentScreen === 'processing' && (
        <ProcessingScreen images={capturedImages} />
      )}
      {currentScreen === 'result' && (
        <ResultScreen onStartOver={handleStartOver} />
      )}
    </div>
  )
}
