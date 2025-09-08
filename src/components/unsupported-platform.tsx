import { Smartphone } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function UnsupportedPlatform() {
  return (
    <Card>
      <CardHeader className='space-y-3'>
        <div className='mx-auto flex size-20 items-center justify-center rounded-3xl bg-muted'>
          <Smartphone className='h-10 w-10 text-muted-foreground' />
        </div>

        <CardTitle className='text-center font-bold text-2xl text-foreground'>
          Mobile Only Experience
        </CardTitle>
        <CardDescription className='text-center text-muted-foreground'>
          Add Me is designed exclusively for mobile devices. Please open this
          app on your smartphone to capture and combine photos with AI.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className='rounded-2xl bg-muted/50 p-4 text-muted-foreground text-sm'>
          <p className='mb-2 font-medium'>Why mobile only?</p>
          <p>
            Camera access and photo combining work best on mobile devices where
            you can easily switch between front and back cameras.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
