'use client'

import { Plus, Sparkles, Zap } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'

interface ProcessingScreenProps {
  images: string[]
}

export function ProcessingScreen({ images }: ProcessingScreenProps) {
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState('Analyzing images...')

  useEffect(() => {
    const steps = [
      'Analyzing images...',
      'Detecting faces...',
      'Matching lighting...',
      'Blending seamlessly...',
      'Finalizing result...',
    ]

    let stepIndex = 0
    const interval = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev + 20
        if (newProgress <= 100) {
          setCurrentStep(
            steps[Math.floor(newProgress / 20) - 1] || steps[steps.length - 1]
          )
        }
        return newProgress
      })

      stepIndex++
      if (stepIndex >= 5) {
        clearInterval(interval)
      }
    }, 600)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/20 p-4'>
      <div className='absolute inset-0'>
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
          }}
          className='absolute top-1/4 left-1/4 h-64 w-64 rounded-full bg-gradient-to-r from-blue-500/30 to-cyan-500/30 blur-3xl'
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 5,
            repeat: Number.POSITIVE_INFINITY,
            ease: 'easeInOut',
            delay: 1,
          }}
          className='absolute right-1/4 bottom-1/4 h-80 w-80 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 blur-3xl'
        />
      </div>

      <div className='relative z-10 w-full max-w-sm space-y-8 text-center'>
        <div className='relative'>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
            className='absolute inset-0 mx-auto h-28 w-28 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 p-0.5'
          >
            <div className='h-full w-full rounded-3xl bg-slate-900/80 backdrop-blur-xl' />
          </motion.div>
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className='relative mx-auto flex h-28 w-28 items-center justify-center rounded-3xl border border-white/20 bg-gradient-to-br from-blue-500/90 to-purple-600/90 shadow-2xl backdrop-blur-xl'
          >
            <Sparkles className='h-12 w-12 text-white' />
          </motion.div>
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className='-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg'
          >
            <Zap className='h-4 w-4 text-white' />
          </motion.div>
        </div>

        <div className='space-y-3'>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className='text-balance font-bold text-2xl text-white drop-shadow-lg'
          >
            AI is combining your photos
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className='text-pretty text-base text-white/80 drop-shadow-md'
          >
            Creating the perfect group shot with everyone included
          </motion.p>
        </div>

        <div className='flex items-center justify-center space-x-4 px-2'>
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                type: 'spring',
                damping: 15,
                stiffness: 300,
                delay: index * 0.2,
              }}
              className='relative flex-shrink-0'
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 4,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
                className='-inset-1 absolute rounded-2xl bg-gradient-to-r from-blue-500 via-cyan-500 via-purple-500 to-blue-500 p-0.5'
              >
                <div className='h-full w-full rounded-2xl bg-slate-900/50 backdrop-blur-sm' />
              </motion.div>

              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                  delay: index * 0.5,
                }}
                className='relative h-24 w-20 overflow-hidden rounded-xl border border-white/30 bg-white/10 shadow-2xl backdrop-blur-xl'
              >
                <img
                  src={image || '/placeholder.svg'}
                  alt={`Image ${index + 1}`}
                  className='h-full w-full object-cover'
                />
              </motion.div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5 + index * 0.2 }}
                className='-bottom-3 -translate-x-1/2 absolute left-1/2 transform rounded-full border border-white/50 bg-white/90 px-3 py-1 font-medium text-slate-800 text-xs shadow-lg backdrop-blur-sm'
              >
                {index === 0 ? 'Group' : 'You'}
              </motion.div>
            </motion.div>
          ))}

          <motion.div
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className='flex flex-shrink-0 items-center justify-center'
          >
            <motion.div
              animate={{
                scaleX: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              className='mx-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg'
            />

            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.3, 1],
              }}
              transition={{
                rotate: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                },
                scale: {
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                },
              }}
              className='flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-cyan-400 to-blue-500 shadow-xl'
            >
              <Plus className='h-4 w-4 text-white' />
            </motion.div>

            <motion.div
              animate={{
                scaleX: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
              className='mx-2 h-0.5 w-8 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 shadow-lg'
            />
          </motion.div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              delay: 1,
              type: 'spring',
              damping: 15,
              stiffness: 300,
            }}
            className='relative flex-shrink-0'
          >
            <motion.div
              animate={{ rotate: -360 }}
              transition={{
                duration: 5,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
              className='-inset-1 absolute rounded-2xl bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-cyan-500 p-0.5'
            >
              <div className='h-full w-full rounded-2xl bg-slate-900/50 backdrop-blur-sm' />
            </motion.div>

            <div className='relative flex h-24 w-20 items-center justify-center rounded-xl border-2 border-white/40 border-dashed bg-white/5 shadow-2xl backdrop-blur-xl'>
              <motion.div
                animate={{
                  rotate: [0, 360],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'easeInOut',
                }}
              >
                <Sparkles className='h-6 w-6 text-cyan-400' />
              </motion.div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className='space-y-4 px-2'
        >
          <div className='h-3 w-full overflow-hidden rounded-full border border-white/20 bg-white/10 shadow-inner backdrop-blur-sm'>
            <motion.div
              className='h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 shadow-lg'
              style={{ width: `${progress}%` }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(59, 130, 246, 0.5)',
                  '0 0 20px rgba(147, 51, 234, 0.7)',
                  '0 0 10px rgba(6, 182, 212, 0.5)',
                ],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'easeInOut',
              }}
            />
          </div>
          <motion.p
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'easeInOut',
            }}
            className='font-medium text-sm text-white drop-shadow-md'
          >
            {currentStep}
          </motion.p>
          <p className='text-white/70 text-xs drop-shadow-sm'>
            {progress}% complete
          </p>
        </motion.div>
      </div>
    </div>
  )
}
