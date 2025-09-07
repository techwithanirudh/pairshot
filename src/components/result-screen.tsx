'use client'

import { Download, RotateCcw, Send, Share2, Sparkles } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ResultScreenProps {
  onStartOver: () => void
}

export function ResultScreen({ onStartOver }: ResultScreenProps) {
  const [editPrompt, setEditPrompt] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)

  const handleEdit = () => {
    if (editPrompt.trim()) {
      setIsEditing(true)
      // Simulate AI editing
      setTimeout(() => {
        setIsEditing(false)
        setEditPrompt('')
      }, 2000)
    }
  }

  return (
    <div className='relative min-h-screen overflow-hidden bg-black'>
      <div className='absolute inset-0'>
        {isEditing ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex h-full w-full items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600'
          >
            <div className='space-y-4 text-center'>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: 'linear',
                }}
              >
                <Sparkles className='mx-auto h-16 w-16 text-white' />
              </motion.div>
              <p className='font-medium text-lg text-white'>
                Applying AI magic...
              </p>
            </div>
          </motion.div>
        ) : (
          <img
            src='/perfect-group-photo-with-everyone-smiling-at-resta.jpg'
            alt='AI combined result'
            className='h-full w-full object-cover'
          />
        )}

        <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30' />
      </div>

      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='absolute top-0 right-0 left-0 z-10 pt-12 pb-4'
      >
        <div className='flex items-center justify-between px-6'>
          <motion.div
            whileTap={{ scale: 0.95 }}
            className='flex items-center space-x-3'
          >
            <div className='flex h-8 w-8 items-center justify-center rounded-full border border-white/30 bg-gradient-to-r from-blue-500 to-purple-600 backdrop-blur-xl'>
              <Sparkles className='h-4 w-4 text-white' />
            </div>
            <div>
              <h1 className='font-bold text-lg text-white drop-shadow-lg'>
                Perfect Shot
              </h1>
            </div>
          </motion.div>

          <motion.div whileTap={{ scale: 0.95 }}>
            <Button
              variant='ghost'
              size='icon'
              onClick={onStartOver}
              className='rounded-full border border-white/20 text-white backdrop-blur-xl hover:bg-white/20'
            >
              <RotateCcw className='h-5 w-5' />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: 'spring', damping: 15, stiffness: 300 }}
        className='absolute top-24 right-6 z-10'
      >
        <div className='flex items-center space-x-2 rounded-full border border-white/30 bg-gradient-to-r from-blue-500/90 to-purple-600/90 px-4 py-2 font-medium text-white text-xs shadow-xl backdrop-blur-xl'>
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          >
            <Sparkles className='h-3 w-3' />
          </motion.div>
          <span>AI Enhanced</span>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', damping: 20, stiffness: 300 }}
        className='absolute right-4 bottom-8 left-4 z-20'
      >
        <div className='mx-auto max-w-md'>
          <AnimatePresence>
            {isInputFocused && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className='mb-4 text-center'
              >
                <div className='inline-flex items-center space-x-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur-xl'>
                  <div className='flex h-4 w-4 items-center justify-center rounded-full bg-gradient-to-r from-blue-400 to-purple-500'>
                    <Sparkles className='h-2 w-2 text-white' />
                  </div>
                  <span className='font-medium text-sm text-white'>
                    AI Photo Editor
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.div
            animate={{
              width: isInputFocused ? '100%' : 'auto',
            }}
            transition={{ type: 'spring', damping: 20, stiffness: 300 }}
            className='rounded-3xl border border-white/30 bg-white/15 p-4 shadow-2xl backdrop-blur-2xl'
          >
            <div className='flex items-center space-x-3'>
              <motion.div
                animate={{
                  width: isInputFocused ? '100%' : '60%',
                }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                className='relative'
              >
                <input
                  type='text'
                  placeholder='Ask about details...'
                  value={editPrompt}
                  onChange={(e) => setEditPrompt(e.target.value)}
                  onFocus={() => setIsInputFocused(true)}
                  onBlur={() => setIsInputFocused(false)}
                  disabled={isEditing}
                  className='w-full border-none bg-transparent font-medium text-base text-white placeholder-white/60 outline-none'
                />

                <AnimatePresence>
                  {isInputFocused && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className='-z-10 absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-500/20 blur-xl'
                    />
                  )}
                </AnimatePresence>
              </motion.div>

              <div className='flex items-center space-x-2'>
                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    size='icon'
                    onClick={handleEdit}
                    disabled={!editPrompt.trim() || isEditing}
                    className='h-12 w-12 rounded-2xl border-none bg-gradient-to-r from-blue-500 to-purple-600 shadow-xl hover:from-blue-600 hover:to-purple-700 disabled:opacity-50'
                  >
                    <Send className='h-5 w-5 text-white' />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    size='icon'
                    className='h-12 w-12 rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-xl hover:bg-white/30'
                  >
                    <Download className='h-5 w-5 text-white' />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button
                    size='icon'
                    className='h-12 w-12 rounded-2xl border border-white/30 bg-white/20 shadow-xl backdrop-blur-xl hover:bg-white/30'
                  >
                    <Share2 className='h-5 w-5 text-white' />
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>

          <AnimatePresence>
            {!isInputFocused && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='mt-3 text-center'
              >
                <p className='text-white/60 text-xs'>
                  Tap to edit with AI • Swipe up to share
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}
