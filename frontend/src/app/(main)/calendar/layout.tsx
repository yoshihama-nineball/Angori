import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | カレンダー',
  description: 'カレンダーページです',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
