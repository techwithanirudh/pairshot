'use client'

import { ProgressProvider } from '@bprogress/next/app'
import { AuthUIProvider } from '@daveyplate/better-auth-ui'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeProvider } from 'next-themes'
import { type ReactNode, useState } from 'react'
import { Toaster } from 'sonner'
import { TailwindIndicator } from '@/components/tailwind-indicator'
import { authClient } from '@/lib/auth-client'

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // With SSR, we usually want to set some default staleTime
            // above 0 to avoid refetching immediately on the client
            staleTime: 60 * 1000,
          },
        },
      })
  )

  return (
    <ThemeProvider
      attribute='class'
      forcedTheme='dark'
      enableSystem={false}
      themes={['dark']}
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <AuthUIProvider
          authClient={authClient}
          navigate={router.push}
          replace={router.replace}
          onSessionChange={() => {
            router.refresh()
          }}
          Link={Link}
        >
          <ProgressProvider
            height='2px'
            color='var(--color-primary)'
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
        </AuthUIProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}
