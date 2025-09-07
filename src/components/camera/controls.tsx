'use client'

import { Check } from 'lucide-react'
import { motion } from 'motion/react'
import { Button } from '@/components/ui/button'
import { useCamera } from './root'

export function Controls() {
  const { capture, capturedImages, onFinish } = useCamera()

  return (
    <div className='absolute right-safe-offset-0 bottom-safe-offset-12 left-safe-offset-0 z-10'>
      <div className='flex items-center justify-center'>
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

          {capturedImages.length >= 2 && (
            <motion.div
              whileTap={{ scale: 0.9 }}
              className='-translate-y-1/2 absolute top-1/2 left-full ml-6'
            >
              <Button
                variant='ghost'
                size='icon'
                className='size-8 rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-xl hover:bg-white/25'
                onClick={() => onFinish?.(capturedImages)}
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
