'use client'

import { UserButton } from '@daveyplate/better-auth-ui'
import { RefreshCcw } from 'lucide-react'
import { motion } from 'motion/react'
import { useCallback } from 'react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useCamera } from './root'

export function Header() {
  const { facingMode, setFacingMode, capturedImages } = useCamera()

  const toggleCamera = useCallback(() => {
    setFacingMode((prev) => (prev === 'user' ? 'environment' : 'user'))
  }, [setFacingMode])

  return (
    // fake status bar
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className='absolute inset-0 top-safe-offset-0 z-10 flex h-16'
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
              'hover:!bg-accent/30 rounded-full border bg-accent/20 text-accent-foreground backdrop-blur-md'
            )}
          >
            <span className='font-medium text-accent-foreground text-sm'>
              {capturedImages.length}
            </span>
          </div>
        </motion.div>

        <div className='flex items-center space-x-3'>
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant='ghost'
              size='icon'
              className='hover:!bg-accent/30 rounded-full border bg-accent/20 text-accent-foreground backdrop-blur-md'
              onClick={toggleCamera}
              aria-label={`Switch camera, current ${facingMode}`}
            >
              <RefreshCcw className='-rotate-40 size-4' />
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
