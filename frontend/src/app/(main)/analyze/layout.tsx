import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | 怒りの傾向マップ',
  description: 'あなたの怒りの傾向を可視化できるページです',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
