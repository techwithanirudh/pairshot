'use client'

import { Camera, FlipHorizontal, Plus, Settings, X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'

interface CameraInterfaceProps {
  onImagesReady: (images: string[]) => void
}

export function CameraInterface({ onImagesReady }: CameraInterfaceProps) {
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>(
    'environment'
  )
  const [showDock, setShowDock] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    startCamera()
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [facingMode])

  const startCamera = async () => {
    try {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }

      const newStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      })

      setStream(newStream)
      if (videoRef.current) {
        videoRef.current.srcObject = newStream
      }
    } catch (error) {
      console.error('Error accessing camera:', error)
    }
  }

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      // Play capture sound
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTuR2O/JdSYE'
      )
      audio.volume = 0.3
      audio.play().catch(() => {}) // Ignore errors if audio can't play

      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0)

        const imageDataUrl = canvas.toDataURL('image/jpeg', 0.8)
        setCapturedImages([...capturedImages, imageDataUrl])
        setShowDock(true)
      }
    }
  }

  const removeImage = (index: number) => {
    const updatedImages = capturedImages.filter((_, i) => i !== index)
    setCapturedImages(updatedImages)
  }

  const toggleCamera = () => {
    setFacingMode(facingMode === 'user' ? 'environment' : 'user')
  }

  return (
    <div className='relative h-screen overflow-hidden'>
      <div className='absolute inset-0 bg-gradient-to-br from-blue-400/20 via-purple-500/10 to-pink-500/20' />

      <div className='absolute inset-0'>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className='h-full w-full object-cover'
        />

        <div className='absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/20 backdrop-blur-[0.5px]' />

        {/* Camera grid overlay */}
        <div className='pointer-events-none absolute inset-0'>
          <svg
            className='h-full w-full opacity-20'
            viewBox='0 0 100 100'
            preserveAspectRatio='none'
          >
            <line
              x1='33.33'
              y1='0'
              x2='33.33'
              y2='100'
              stroke='white'
              strokeWidth='0.3'
            />
            <line
              x1='66.66'
              y1='0'
              x2='66.66'
              y2='100'
              stroke='white'
              strokeWidth='0.3'
            />
            <line
              x1='0'
              y1='33.33'
              x2='100'
              y2='33.33'
              stroke='white'
              strokeWidth='0.3'
            />
            <line
              x1='0'
              y1='66.66'
              x2='100'
              y2='66.66'
              stroke='white'
              strokeWidth='0.3'
            />
          </svg>
        </div>
      </div>

      <canvas ref={canvasRef} className='hidden' />

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='absolute top-0 right-0 left-0 z-10 pt-12 pb-4'
      >
        <div className='absolute inset-0 bg-black/70 backdrop-blur-sm' />

        <div className='relative z-10 flex items-center justify-between px-6'>
          <div className='flex items-center space-x-3'>
            <motion.div
              whileTap={{ scale: 0.95 }}
              className='flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-white/20 backdrop-blur-md'
            >
              <Camera className='h-4 w-4 text-white' />
            </motion.div>
            <div className='rounded-lg bg-black/60 px-3 py-1 backdrop-blur-sm'>
              <h1 className='font-bold text-lg text-white'>Add Me</h1>
              <p className='text-sm text-white/90'>Take photos to combine</p>
            </div>
          </div>
          <div className='flex items-center space-x-3'>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant='ghost'
                size='icon'
                className='border border-white/20 text-white backdrop-blur-md hover:bg-white/20'
                onClick={toggleCamera}
              >
                <FlipHorizontal className='h-5 w-5' />
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant='ghost'
                size='icon'
                className='border border-white/20 text-white backdrop-blur-md hover:bg-white/20'
              >
                <Settings className='h-5 w-5' />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>

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
                {capturedImages.slice(-4).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: 'spring',
                      damping: 15,
                      stiffness: 300,
                      delay: index * 0.1,
                    }}
                    className='relative flex-shrink-0'
                  >
                    <div className='h-16 w-16 overflow-hidden rounded-2xl border-2 border-white/30 bg-white/5 backdrop-blur-sm'>
                      <img
                        src={image || '/placeholder.svg'}
                        alt={`Photo ${index + 1}`}
                        className='h-full w-full object-cover'
                      />
                    </div>
                    <motion.button
                      whileTap={{ scale: 0.8 }}
                      onClick={() =>
                        removeImage(capturedImages.length - 4 + index)
                      }
                      className='-top-1 -right-1 absolute flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-red-500/90 shadow-lg backdrop-blur-sm'
                    >
                      <X className='h-3 w-3 text-white' />
                    </motion.button>
                  </motion.div>
                ))}

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

      <div className='absolute right-0 bottom-8 left-0 z-10'>
        <div className='flex items-center justify-center space-x-8'>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              variant='ghost'
              size='icon'
              className='h-12 w-12 rounded-xl border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-xl hover:bg-white/25'
            >
              <div className='h-6 w-6 rounded-sm bg-white/60' />
            </Button>
          </motion.div>

          <motion.div
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
            transition={{ type: 'spring', damping: 15, stiffness: 400 }}
          >
            <Button
              onClick={handleCapture}
              className='group relative h-20 w-20 rounded-full border-2 border-white/40 bg-gradient-to-br from-white/30 to-white/10 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:from-white/40 hover:to-white/20'
            >
              <div className='absolute inset-0 animate-pulse rounded-full bg-gradient-to-br from-blue-400/20 to-purple-500/20' />
              <div className='relative h-16 w-16 rounded-full border border-white/50 bg-white/90 shadow-inner backdrop-blur-sm transition-transform group-active:scale-95' />
              <div className='absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-white/10 to-transparent' />
            </Button>
          </motion.div>

          {capturedImages.length >= 2 ? (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                onClick={() => onImagesReady(capturedImages)}
                className='rounded-full border border-white/30 bg-gradient-to-r from-blue-500/90 to-purple-600/90 px-6 py-3 font-medium text-white shadow-xl backdrop-blur-xl hover:from-blue-600/90 hover:to-purple-700/90'
              >
                Combine
              </Button>
            </motion.div>
          ) : (
            <div className='h-12 w-12' />
          )}
        </div>
      </div>

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
    </div>
  )
}
