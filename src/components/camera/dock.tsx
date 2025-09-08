'use client'

import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useCamera } from './root'

export function Dock() {
  const { capturedImages, removeImage, onFinish } = useCamera()
  const images = capturedImages.slice(-3)

  return (
    <AnimatePresence>
      {capturedImages.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className='-translate-x-1/2 absolute bottom-safe-offset-32 left-1/2 z-10 w-full max-w-sm transform px-4'
        >
          <div className='rounded-3xl border border-white/20 bg-white/10 p-4 shadow-2xl backdrop-blur-xl'>
            <div className='flex flex-wrap items-center justify-center gap-3'>
              {images.map((image, idx) => {
                const globalIndex = capturedImages.length - images.length + idx
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
                      <picture>
                        <img
                          src={URL.createObjectURL(image) || '/placeholder.svg'}
                          alt={`Thumbnail ${globalIndex + 1}`}
                          className='h-full w-full object-cover'
                        />
                      </picture>
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

              {capturedImages.length > 3 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 border-dashed bg-white/5 backdrop-blur-sm'
                >
                  <span className='font-medium text-white/60 text-xs'>
                    +{capturedImages.length - 3}
                  </span>
                </motion.div>
              )}

              {/* keep done button if we want a dock-based done */}
              {/* <motion.button whileTap={{ scale: 0.9 }} onClick={() => onFinish?.(capturedImages)} className='flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl border-2 border-white/40 border-dashed bg-white/5 backdrop-blur-sm' aria-label='Done' title='Done'><Check className='h-6 w-6 text-white/60' /></motion.button> */}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
