// app/home/layout.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | Home',
  description: 'Homeのページです',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
