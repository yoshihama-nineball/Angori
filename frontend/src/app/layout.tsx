import { Metadata } from 'next'
import React from 'react'
import { ClientThemeProvider } from './components/layouts/ClientThemeProvider'
import { MessageProvider } from '../../context/MessageContext'
import Loading from '@/components/feedback/Loading/Loading'

export const metadata: Metadata = {
  title: 'アンガーアプリ | TOP',
  description: 'TOPページです',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <ClientThemeProvider>
          <MessageProvider>
            <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
          </MessageProvider>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
