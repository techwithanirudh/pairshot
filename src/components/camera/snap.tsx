'use client'

import {
  Camera as CameraIcon,
  FlipHorizontal,
  Plus,
  RotateCcw,
  Settings,
  X,
} from 'lucide-react'
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
import { Button } from '@/components/ui/button'

type FacingMode = 'user' | 'environment'

type CameraContextValue = {
  webcamRef: React.RefObject<Webcam | null>
  facingMode: FacingMode
  setFacingMode: React.Dispatch<React.SetStateAction<FacingMode>>
  capturedImages: string[]
  removeImage: (index: number) => void
  capture: () => void
  playShutter: () => void
  showDock: boolean
  setShowDock: React.Dispatch<React.SetStateAction<boolean>>
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
  const [showDock, setShowDock] = useState(false)

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
    setShowDock(true)
  }, [playShutter])

  const removeImage = useCallback((index: number) => {
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
      showDock,
      setShowDock,
      onImagesReady,
    }),
    [
      facingMode,
      capturedImages,
      removeImage,
      capture,
      playShutter,
      showDock,
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
  const { facingMode, setFacingMode } = useCamera()

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [setFacingMode])

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='absolute top-0 right-0 left-0 z-10 flex h-16'
    >
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm' />
      <div className='relative z-10 flex flex-1 items-center justify-between px-safe-or-4'>
        <div className='flex items-center space-x-3'>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className='flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md'
            aria-hidden
          >
            <CameraIcon className='h-4 w-4 text-white' />
          </motion.div>
        </div>

        <div className='flex items-center space-x-3'>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant='ghost'
              size='icon'
              className='border border-white/20 text-white backdrop-blur-md hover:bg-white/20'
              onClick={toggleCamera}
              aria-label={`Switch camera, current ${facingMode}`}
            >
              <RotateCcw className='h-5 w-5' />
            </Button>
          </motion.div>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant='ghost'
              size='icon'
              className='border border-white/20 text-white backdrop-blur-md hover:bg-white/20'
              aria-label='Open settings'
            >
              <Settings className='h-5 w-5' />
            </Button>
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
  const { capturedImages, removeImage, showDock } = useCamera()
  const last4 = capturedImages.slice(-4)

  return (
    <AnimatePresence>
      {capturedImages.length > 0 && showDock && (
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

              <div className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 border-dashed bg-white/5 backdrop-blur-sm'>
                <Plus className='h-6 w-6 text-white/60' />
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Controls() {
  const { capture } = useCamera()

  return (
    <div className='absolute right-0 bottom-8 left-0 z-10'>
      <div className='flex items-center justify-center space-x-8'>
        {/* <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant='ghost'
            size='icon'
            className='h-12 w-12 rounded-xl border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-xl hover:bg-white/25'
          >
            <div className='h-6 w-6 rounded-sm bg-white/60' />
          </Button>
        </motion.div> */}

        <motion.div
          whileTap={{ scale: 0.95 }}
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', damping: 15, stiffness: 400 }}
        >
          <Button
            onClick={capture}
            className='relative h-20 w-20 rounded-full border-2 border-white/20 bg-white/50 p-0 shadow-2xl backdrop-blur-xl hover:bg-white/60 disabled:cursor-not-allowed disabled:opacity-50'
          >
            <div className='h-16 w-16 rounded-full border border-gray-200 bg-white shadow-inner' />
          </Button>
        </motion.div>

        {/* <motion.div whileTap={{ scale: 0.9 }}>
          <Button
            variant='ghost'
            size='icon'
            className='w-12 h-12 rounded-xl bg-white/15 backdrop-blur-xl border border-white/30 text-white hover:bg-white/25 shadow-lg'
            onClick={toggleCamera}
          >
            <FlipHorizontal className='w-5 h-5' />
          </Button>
        </motion.div> */}
      </div>
    </div>
  )
}

function CountBadge() {
  const { capturedImages } = useCamera()
  return (
    <AnimatePresence>
      {capturedImages.length > 0 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className='absolute top-32 right-6 z-10'
        >
          <div className='rounded-full border border-white/20 bg-black/30 px-3 py-1 backdrop-blur-xl'>
            <span className='font-medium text-sm text-white'>
              {capturedImages.length}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function Gallery() {
  return <Dock />
}

export const Camera = {
  Root,
  Header,
  Preview,
  Dock,
  Gallery,
  Controls,
  CountBadge,
}
