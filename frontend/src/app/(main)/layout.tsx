import React from 'react'
import Header from '@/components/layouts/Header/Header'
import FlashMessage from '@/components/feedback/Alert/FlashMessage'
import Loading from '@/components/feedback/Loading/Loading'
import { Sidebar } from '@/components/layouts/Sidebar/Sidebar'
import Footer from '@/components/layouts/Footer/Footer'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Header />
      <FlashMessage />
      <Sidebar />
      <main
        style={{
          paddingTop: 'var(--header-height, 64px)',
          marginLeft: 'var(--sidebar-width, 0px)',
          minHeight: 'calc(100vh - var(--footer-height, 56px))',
          width: 'calc(100vw - var(--sidebar-width, 0px))',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          alignItems: 'stretch',
        }}
      >
        <React.Suspense fallback={<Loading />}>{children}</React.Suspense>
      </main>
      <Footer />
    </>
  )
}
