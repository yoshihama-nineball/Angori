import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | アンガー相談室',
  description: '相談室のページです',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
