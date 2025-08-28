// app/home/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | 会員登録',
  description: '会員登録ページです',
}

export default function RegisterLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
