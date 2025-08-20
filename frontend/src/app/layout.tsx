import { Metadata } from 'next'
import React from 'react'
import Footer from '../components/layouts/Footer/Footer'
import { ClientThemeProvider } from './components/layouts/ClientThemeProvider'
import Header from '@/components/layouts/Header/Header'
import FlashMessage from '@/components/feedback/Alert/FlashMessage'
import { MessageProvider } from '../../context/MessageContext'
import Loading from '@/components/feedback/Loading/Loading'
import { Sidebar } from '@/components/layouts/Sidebar/Sidebar'

export const metadata: Metadata = {
  title: 'アンガーアプリ | TOP',
  description: 'TOPページです',
  icons: {
    icon: '/favicon.ico',
  },
}

// layout.tsx を修正
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
            <Header />
            <FlashMessage />
            <Sidebar />

            <main
              style={{
                paddingTop: 'var(--header-height, 64px)',
                paddingLeft: 'var(--sidebar-width, 0px)',
                minHeight: 'calc(100vh - var(--footer-height, 56px))',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start', // 上詰め
                alignItems: 'center', // 水平中央
              }}
            >
              <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
            </main>
            <Footer />
          </MessageProvider>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
