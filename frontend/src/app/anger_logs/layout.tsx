import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | アンガーログ一覧',
  description: '過去のアンガーログの一覧を閲覧できるページです',
}

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
