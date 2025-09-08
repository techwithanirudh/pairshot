import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import type { ReactNode } from 'react'

import '@/styles/globals.css'

import InstallPrompt from '@/components/install-prompt'
import { Providers } from './providers'
import {
  APP_NAME,
  APP_DESCRIPTION,
  APP_DEFAULT_TITLE,
  APP_TITLE_TEMPLATE,
} from '@/lib/constants'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: APP_NAME,
    startupImage: ['/icon-192x192.png', '/icon-512x512.png'],
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: 'website',
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: 'summary',
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
}

export const viewport: Viewport = {
  initialScale: 1,
  minimumScale: 1,
  width: 'device-width, shrink-to-fit=no',
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#09090B',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} flex min-h-svh flex-col antialiased`}
      >
        <Providers>
          {children}
          <InstallPrompt />
        </Providers>
      </body>
    </html>
  )
}
