import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | TOP',
  description: 'ダッシュボードのページです',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
