import { Metadata } from 'next'
import React from 'react'
import Script from 'next/script'
import { ClientThemeProvider } from './components/layouts/ClientThemeProvider'
import { MessageProvider } from '../../context/MessageContext'
import Loading from '@/components/feedback/Loading/Loading'

export const metadata: Metadata = {
  title: 'アンゴリ - Dr.ゴリのアンガーマネジメント相談室',
  description:
    'Dr.ゴリと一緒に怒りの感情を整理しよう🦍 アンガーマネジメントで心を軽やかに。あなたの気持ちに寄り添います。',
  keywords: [
    'アンガーマネジメント',
    '怒り',
    '感情管理',
    'ストレス',
    'メンタルヘルス',
    'Dr.ゴリ',
    'アンゴリ',
  ],
  authors: [{ name: 'アンゴリチーム' }],
  creator: 'アンゴリ',

  // Open Graph設定（完全版）
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    title: 'アンゴリ - Dr.ゴリのアンガーマネジメント相談室',
    description:
      'Dr.ゴリと一緒に怒りの感情を整理しよう🦍 アンガーマネジメントで心を軽やかに。',
    siteName: 'アンゴリ',
    url: 'https://angori.vercel.app',
    images: [
      {
        url: 'https://angori.vercel.app/angori-image/angori-ogp.png',
        width: 1200,
        height: 630,
        alt: 'アンゴリ - Dr.ゴリのアンガーマネジメント相談室',
        type: 'image/png',
      },
    ],
  },

  // Twitter Card設定（完全版）
  twitter: {
    card: 'summary_large_image',
    site: '@angori_app', // 実際のアカウントがあれば変更
    creator: '@angori_app',
    title: 'アンゴリ - Dr.ゴリのアンガーマネジメント相談室',
    description:
      'Dr.ゴリと一緒に怒りの感情を整理しよう🦍 アンガーマネジメントで心を軽やかに。',
    images: {
      url: 'https://angori.vercel.app/angori-image/angori-ogp.png',
      alt: 'アンゴリ - Dr.ゴリのアンガーマネジメント相談室',
    },
  },

  // その他のメタタグ
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    // google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://angori.vercel.app',
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/favicon.ico',
  },

  // 絶対URLの基準
  metadataBase: new URL('https://angori.vercel.app'),
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
