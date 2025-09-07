'use client'

import { Plus, Sparkles, Zap } from 'lucide-react'
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card'
import { Progress } from './ui/progress'

interface ProcessingScreenProps {
  images: string[]
}

export function ProcessingScreen({ images }: ProcessingScreenProps) {
  const [currentStep, _setCurrentStep] = useState('Eating some bananas...')

  return (
    <div className='flex min-h-screen items-center justify-center bg-background p-4'>
      <Card className='w-full max-w-sm text-center'>
        <CardHeader className='relative'>
          <div className='pulse-glow mx-auto flex h-24 w-24 items-center justify-center rounded-3xl bg-muted'>
            <Sparkles className='h-12 w-12 text-white' />
          </div>
          <div className='-top-2 -right-2 absolute flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-lg'>
            <Zap className='h-4 w-4 text-accent' />
          </div>
        </CardHeader>

        <CardContent className='space-y-3 px-6'>
          <CardTitle className='text-balance font-bold text-2xl text-foreground'>
            AI is combining your photos
          </CardTitle>
          <CardDescription className='text-pretty text-base text-muted-foreground'>
            Creating the perfect group shot with everyone included
          </CardDescription>
        </CardContent>

        <CardContent className='px-2'>
          <div className='flex items-center justify-center space-x-4'>
            {images.map((image, index) => (
              <div
                key={index}
                className='relative flex-shrink-0 rotate-combine'
              >
                <div className='h-24 w-20 overflow-hidden rounded-xl border-2 border-white/20 bg-card shadow-lg'>
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`Image ${index + 1}`}
                    className='h-full w-full object-cover'
                  />
                </div>
                <div className='-bottom-3 -translate-x-1/2 absolute left-1/2 transform rounded-full bg-white px-3 py-1 font-medium text-accent text-xs shadow-md'>
                  {index === 0 ? 'Group' : 'You'}
                </div>
              </div>
            ))}

            <div className='flex flex-shrink-0 items-center justify-center'>
              <div className='mx-2 h-0.5 w-8 rounded-full bg-muted' />
              <div className='pulse-glow flex h-8 w-8 items-center justify-center rounded-full bg-muted'>
                <Plus className='h-4 w-4 text-white' />
              </div>
              <div className='mx-2 h-0.5 w-8 rounded-full bg-muted' />
            </div>

            <div className='glass-morphism flex h-24 w-20 flex-shrink-0 items-center justify-center rounded-xl border-2 border-accent/50 border-dashed'>
              <Sparkles className='pulse-glow h-6 w-6 text-accent' />
            </div>
          </div>
        </CardContent>

        <CardFooter className='flex flex-col space-y-2 px-2'>
          <Progress indeterminate />
          <p className='font-medium text-foreground text-sm'>{currentStep}</p>
        </CardFooter>
      </Card>
    </div>
  )
}
