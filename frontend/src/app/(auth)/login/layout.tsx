// app/home/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | ログイン',
  description: 'ログインページです',
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
