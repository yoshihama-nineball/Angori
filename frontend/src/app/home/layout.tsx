import { Metadata } from 'next'
import React from 'react'
// import Loading from "./components/feedback//Loading/Loading";
import Footer from '../../components/layouts/Footer/Footer'
// import Header from "../components/layouts/Header/Header";
import { ClientThemeProvider } from '../components/layouts/ClientThemeProvider'

export const metadata: Metadata = {
  title: 'Angori | TOP',
  description: 'TOPページです',
  icons: {
    icon: '/icon.png',
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
          <div>ヘッダー</div>
          {/* メインコンテンツをラップして、ヘッダーの高さ分のパディングを追加 */}
          <main
            style={{
              paddingTop: 'var(--header-height, 64px)', // デフォルト値として64pxを設定
              minHeight: 'calc(100vh - var(--footer-height, 56px))', // フッターの高さを考慮
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* <React.Suspense fallback={<Loading />}>{children}</React.Suspense> */}
            <React.Suspense>{children}</React.Suspense>
          </main>
          <Footer />
        </ClientThemeProvider>
      </body>
    </html>
  )
}
