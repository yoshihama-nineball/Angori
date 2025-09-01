import { Metadata } from 'next'
import React from 'react'
import Script from 'next/script'
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
        {/* Google Analytics */}
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
