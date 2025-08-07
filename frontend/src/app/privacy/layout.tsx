import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'アンゴリ | プライバシーポリシー',
  description: 'プライバシーポリシーのページです',
}

export default function PrivacyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
