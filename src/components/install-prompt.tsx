'use client'
import { XIcon } from 'lucide-react'
import { motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'

export default function Page() {
  return (
    <div>
      <InstallPrompt />
    </div>
  )
}

function InstallPrompt() {
  const [isStandalone, setIsStandalone] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const handleDismiss = () => {
    setDismissed(true)
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone || dismissed) {
    return null
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className='absolute inset-0 top-safe-offset-0 z-10 flex h-16'
        data-header='camera-header'
      >
        <div className='absolute inset-0 bg-background/50 backdrop-blur-sm' />
        <div className='relative z-10 flex flex-1 items-center justify-between px-safe-or-4'>
          <div className='flex-1 text-sm'>
            Please install the app to get the best experience.
          </div>

          <div className='flex items-center space-x-3'>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant='ghost'
                size='sm'
                className='hover:!bg-accent/30 h-9 border bg-accent/20 text-accent-foreground backdrop-blur-md'
                aria-label={`Install`}
                onClick={() => setDialogOpen(true)}
              >
                Install
              </Button>
            </motion.div>
            <motion.div whileTap={{ scale: 0.95 }}>
              <Button
                variant='ghost'
                size='icon'
                className='hover:!bg-accent/30 rounded-full border bg-accent/20 text-accent-foreground backdrop-blur-md'
                aria-label={`Dismiss`}
                onClick={handleDismiss}
              >
                <XIcon />
              </Button>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <InstallDialog open={dialogOpen} setOpen={setDialogOpen} />
    </>
  )
}

function InstallDialog({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (v: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Install Instructions</DialogTitle>
          <DialogDescription>
            Follow the steps for your device below to add the app to your home
            screen.
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-4'>
          <section>
            <h4 className='font-medium'>iOS</h4>
            <p className='text-sm'>
              Tap the share button (the square with an arrow), then select "Add
              to Home Screen".
            </p>
          </section>

          <section>
            <h4 className='font-medium'>Android / Chrome</h4>
            <p className='text-sm'>
              Open the browser menu (three dots) and tap "Install app" or "Add
              to Home screen".
            </p>
          </section>

          <section>
            <h4 className='font-medium'>Desktop (Chromium)</h4>
            <p className='text-sm'>
              Use the install option in the address bar or browser menu to
              install the Progressive Web App.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}
