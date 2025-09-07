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

type FacingMode = 'user' | 'environment'

type CameraContextValue = {
  webcamRef: React.RefObject<Webcam | null>
  facingMode: FacingMode
  setFacingMode: React.Dispatch<React.SetStateAction<FacingMode>>
  capturedImages: string[]
  removeImage: (index: number) => void
  capture: () => void
  playShutter: () => void
  // called after camera streams/tracks are stopped and camera is torn down
  onFinish?: (images: string[]) => void
}

const CameraCtx = createContext<CameraContextValue | null>(null)
export const useCamera = () => {
  const ctx = useContext(CameraCtx)
  if (!ctx) throw new Error('Camera.* must be used inside <Camera.Root>')
  return ctx
}

interface CameraRootProps {
  onFinish?: (images: string[]) => void
  initialFacing?: FacingMode
}

export function Root({
  children,
  onFinish,
  initialFacing = 'environment',
}: PropsWithChildren<CameraRootProps>) {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacing)

  const webcamRef = useRef<Webcam | null>(null)

  const [playShutter] = useSound('/sounds/capture.mp3', {
    interrupt: true,
  })

  const capture = useCallback(() => {
    playShutter()
    const shot = webcamRef.current?.getScreenshot()
    if (!shot) return
    setCapturedImages((prev) => [...prev, shot])
  }, [playShutter])

  const removeImage = useCallback((index: number) => {
    setCapturedImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const finish = useCallback(
    (images: string[]) => {
      try {
        const videoEl = webcamRef.current?.video
        const stream = videoEl?.srcObject ?? null

        if (stream instanceof MediaStream) {
          for (const track of stream.getTracks()) {
            track.stop();
          }
        }
      } catch (e) {
        console.error('Failed to stop camera in finish()', e)
      }

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
