'use client'

import type React from 'react'
import {
  createContext,
  type PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from 'react'
import type Webcam from 'react-webcam'
import useSound from 'use-sound'
import { dataUrlToFile } from '@/lib/utils'

type FacingMode = 'user' | 'environment'

type CameraContextValue = {
  webcamRef: React.RefObject<Webcam | null>
  facingMode: FacingMode
  setFacingMode: React.Dispatch<React.SetStateAction<FacingMode>>
  capturedImages: File[]
  removeImage: (index: number) => void
  capture: () => void
  playShutter: () => void
  onFinish?: (images: File[]) => void
}

const CameraCtx = createContext<CameraContextValue | null>(null)
export const useCamera = () => {
  const ctx = useContext(CameraCtx)
  if (!ctx) throw new Error('Camera.* must be used inside <Camera.Root>')
  return ctx
}

interface CameraRootProps {
  onFinish?: (images: File[]) => void
  initialFacing?: FacingMode
}

export function Root({
  children,
  onFinish,
  initialFacing = 'environment',
}: PropsWithChildren<CameraRootProps>) {
  const [capturedImages, setCapturedImages] = useState<File[]>([])
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacing)

  const webcamRef = useRef<Webcam | null>(null)

  const [playShutter] = useSound('/sounds/capture.mp3', {
    interrupt: true,
  })

  const capture = useCallback(async () => {
    playShutter()
    const shot = webcamRef.current?.getScreenshot()
    if (!shot) return

    try {
      const file = await dataUrlToFile(shot, `capture-${Date.now()}.png`)
      setCapturedImages((prev) => [...prev, file])
    } catch (e) {
      console.error('Failed to convert screenshot to file', e)
    }
  }, [playShutter])

  const removeImage = useCallback((index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const finish = useCallback(
    (images: File[]) => {
      try {
        const videoEl = webcamRef.current?.video
        const stream = videoEl?.srcObject ?? null

        if (stream instanceof MediaStream) {
          for (const track of stream.getTracks()) {
            track.stop()
          }
        }
      } catch (e) {
        console.error('Failed to stop camera in finish()', e)
      }

      setCapturedImages([])
      onFinish?.(images)
    },
    [onFinish]
  )

  const value = useMemo<CameraContextValue>(
    () => ({
      webcamRef,
      facingMode,
      setFacingMode,
      capturedImages,
      removeImage,
      capture,
      playShutter,
      onFinish: finish,
    }),
    [facingMode, capturedImages, removeImage, capture, playShutter, finish]
  )

  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/10 to-pink-500/20' />
      <CameraCtx.Provider value={value}>{children}</CameraCtx.Provider>
    </div>
  )
}
