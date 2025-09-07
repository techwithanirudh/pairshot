'use client'

import { Check, RotateCcw, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
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
import Webcam from 'react-webcam'
import useSound from 'use-sound'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { UserButton } from '@daveyplate/better-auth-ui'

type FacingMode = 'user' | 'environment'

type CameraContextValue = {
  webcamRef: React.RefObject<Webcam | null>
  facingMode: FacingMode
  setFacingMode: React.Dispatch<React.SetStateAction<FacingMode>>
  capturedImages: string[]
  removeImage: (index: number) => void
  capture: () => void
  playShutter: () => void
  onImagesReady?: (images: string[]) => void
}

const CameraCtx = createContext<CameraContextValue | null>(null)
const useCamera = () => {
  const ctx = useContext(CameraCtx)
  if (!ctx) throw new Error('Camera.* must be used inside <Camera.Root>')
  return ctx
}

interface CameraRootProps {
  onImagesReady?: (images: string[]) => void
  initialFacing?: FacingMode
}

function Root({
  children,
  onImagesReady,
  initialFacing = 'environment',
}: PropsWithChildren<CameraRootProps>) {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [facingMode, setFacingMode] = useState<FacingMode>(initialFacing)

  const webcamRef = useRef<Webcam | null>(null)

  const [playShutter] = useSound('/sounds/capture.mp3', {
    interrupt: true,
    preload: true,
  })

  const capture = useCallback(() => {
    playShutter()
    const shot = webcamRef.current?.getScreenshot()
    if (!shot) return
    setCapturedImages((prev) => [...prev, shot])
  }, [playShutter])

  const removeImage = useCallback((index: number) => {
    // remove by index in the full list
    setCapturedImages((prev) => prev.filter((_, i) => i !== index))
  }, [])

  const value = useMemo<CameraContextValue>(
    () => ({
      webcamRef,
      facingMode,
      setFacingMode,
      capturedImages,
      removeImage,
      capture,
      playShutter,
      onImagesReady,
    }),
    [
      facingMode,
      capturedImages,
      removeImage,
      capture,
      playShutter,
      onImagesReady,
    ]
  )

  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/10 to-pink-500/20' />
      <CameraCtx.Provider value={value}>{children}</CameraCtx.Provider>
    </div>
  )
}

function Header() {
  const { facingMode, setFacingMode, capturedImages } = useCamera()

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [setFacingMode])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='absolute inset-0 z-10 flex h-16'
    >
      <div className='absolute inset-0 bg-background/30 backdrop-blur-sm' />
      <div className='relative z-10 flex flex-1 items-center justify-between px-safe-or-4'>
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        >
          <div
            className={cn(
              buttonVariants({ variant: 'ghost', size: 'icon' }),
              'rounded-full border bg-accent/20 text-accent-foreground backdrop-blur-md hover:!bg-accent/30'
            )}
          >
            <span className='font-medium text-sm text-accent-foreground'>
              {capturedImages.length}
            </span>
          </div>
        </motion.div>

        <div className='flex items-center space-x-3'>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant='ghost'
              size='icon'
              className='rounded-full border bg-accent/20 text-accent-foreground backdrop-blur-md hover:!bg-accent/30'
              onClick={toggleCamera}
              aria-label={`Switch camera, current ${facingMode}`}
            >
              <RotateCcw className='h-5 w-5' />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <UserButton
              size='icon'
              align='end'
              classNames={{
                trigger: {
                  base: 'rounded-full border border-accent/30',
                  avatar: {
                    skeleton: 'size-9',
                    base: 'size-9',
                    fallback: 'size-9',
                    fallbackIcon: 'size-9',
                    image: 'size-9',
                  },
                },
              }}
            />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

function Preview({ children }: PropsWithChildren) {
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
        key={`cam-${facingMode}`} // force remount when flipping
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

function Dock() {
  const { capturedImages, removeImage, onImagesReady } = useCamera()
  const last4 = capturedImages.slice(-4)

  return (
    <AnimatePresence>
      {capturedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className='-translate-x-1/2 absolute bottom-32 left-1/2 z-10 w-full max-w-sm transform px-4'
        >
          <div className='rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl'>
            <div className='scrollbar-hide flex items-center space-x-3 overflow-x-auto'>
              {last4.map((image, idx) => {
                const globalIndex = capturedImages.length - last4.length + idx
                return (
                  <motion.div
                    key={globalIndex}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 15,
                      stiffness: 300,
                      delay: idx * 0.1,
                    }}
                    className='relative flex-shrink-0'
                  >
                    <div className='h-16 w-16 overflow-hidden rounded-2xl border-2 border-white/30 bg-white/5 backdrop-blur-sm'>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Photo ${globalIndex + 1}`}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() => removeImage(globalIndex)}
                      className='-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-red-500/90 shadow-lg backdrop-blur-sm'
                      aria-label={`Remove photo ${globalIndex + 1}`}
                    >
                      <X className='h-3 w-3 text-white' />
                    </motion.button>
                  </motion.div>
                )
              })}

              {capturedImages.length > 4 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 border-dashed bg-white/5 backdrop-blur-sm'
                >
                  <span className='font-medium text-white/60 text-xs'>
                    +{capturedImages.length - 4}
                  </span>
                </motion.div>
              )}

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => onImagesReady?.(capturedImages)}
                className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 border-dashed bg-white/5 backdrop-blur-sm'
                aria-label='Done'
                title='Done'
              >
                <Check className='h-6 w-6 text-white/60' />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Controls() {
  const { capture, capturedImages } = useCamera()

  return (
    <div className='absolute right-0 bottom-8 left-0 z-10'>
      <div className='flex items-center justify-center'>
        {/* center container - capture stays centered, secondary button is absolutely positioned */}
        <div className='relative'>
          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 15, stiffness: 400 }}
          >
            <Button
              onClick={capture}
              className='relative h-20 w-20 rounded-full border-2 border-input/20 bg-white/50 p-0 shadow-2xl backdrop-blur-xl hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <div className='h-16 w-16 rounded-full border border-gray-200 bg-white shadow-inner' />
            </Button>
          </motion.div>

          {capturedImages.length > 0 && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className='absolute left-full ml-6 top-1/2 -translate-y-1/2'
            >
              <Button
                variant='ghost'
                size='icon'
                className='size-8 rounded-full bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 shadow-lg'
                onClick={() => {}}
              >
                <Check className='size-5' />
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}

export const Camera = {
  Root,
  Header,
  Preview,
  Dock,
  Controls,
}
