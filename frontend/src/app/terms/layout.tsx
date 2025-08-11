// app/home/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | 利用規約',
  description: '利用規約のページです',
}

export default function TermsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
