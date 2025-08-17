'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { ThemeProvider } from 'next-themes'
import type { ReactNode } from 'react'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { Toaster } from '@/components/ui/sonner'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <ProgressProvider
        height="2px"
        color="var(--color-primary)"
        options={{
          showSpinner: false,
        }}
        stopDelay={1000}
        delay={1000}
        startOnLoad
        shallowRouting
      >
        {children}
        <Toaster />
        <TailwindIndicator />
      </ProgressProvider>
    </ThemeProvider>
  )
}
