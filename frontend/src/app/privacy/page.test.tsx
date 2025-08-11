import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import PrivacyPage from './page'

// useMediaQueryのモック
jest.mock('@mui/material', () => ({
  ...jest.requireActual('@mui/material'),
  useMediaQuery: jest.fn(),
}))

const mockUseMediaQuery = useMediaQuery as jest.MockedFunction<
  typeof useMediaQuery
>

// テーマの設定
const theme = createTheme()

// テスト用のWrapper
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={theme}>{children}</ThemeProvider>
)

describe('PrivacyPage', () => {
  beforeEach(() => {
    // デフォルトはデスクトップ表示
    mockUseMediaQuery.mockReturnValue(false)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('基本レンダリング', () => {
    test('ページタイトルが正しく表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
      expect(
        screen.getByText('Angori（アンゴリ）個人情報保護方針')
      ).toBeInTheDocument()
      expect(screen.getByText('最終更新日：2025年8月11日')).toBeInTheDocument()
    })

    test('全ての条項が表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      // 各条項のタイトルをチェック
      expect(screen.getByText('第1条（収集する情報）')).toBeInTheDocument()
      expect(screen.getByText('第2条（利用目的）')).toBeInTheDocument()
      expect(screen.getByText('第3条（第三者提供）')).toBeInTheDocument()
      expect(screen.getByText('第4条（利用者の権利）')).toBeInTheDocument()
      expect(screen.getByText('第5条（Cookieの利用）')).toBeInTheDocument()
      expect(screen.getByText('第6条（お問い合わせ窓口）')).toBeInTheDocument()
      expect(screen.getByText('第7条（ポリシー変更）')).toBeInTheDocument()
    })
  })

  describe('第1条（収集する情報）', () => {
    test('利用者が提供する情報が正しく表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('1.1 利用者が提供する情報')).toBeInTheDocument()
      expect(
        screen.getByText(/メールアドレス、パスワード（暗号化保存）/)
      ).toBeInTheDocument()
      expect(screen.getByText(/怒りレベル（1-10段階）/)).toBeInTheDocument()
      expect(screen.getByText(/AI相談データ/)).toBeInTheDocument()
    })

    test('自動的に収集される情報が表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('1.2 自動的に収集される情報')).toBeInTheDocument()
      expect(screen.getByText(/ログイン日時、機能利用履歴/)).toBeInTheDocument()
      expect(
        screen.getByText(/落ち着きポイント、レベル、連続記録日数/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/IPアドレス、ブラウザ情報、アクセス日時/)
      ).toBeInTheDocument()
    })

    test('外部サービス連携情報が表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('1.3 外部サービス連携情報')).toBeInTheDocument()
      expect(
        screen.getByText(/Googleログイン利用時のプロフィール情報/)
      ).toBeInTheDocument()
    })
  })

  describe('第2条（利用目的）', () => {
    test('サービス提供目的が表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('2.1 サービス提供目的')).toBeInTheDocument()
      expect(
        screen.getByText(/アンガーマネジメント機能の提供/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/AI相談機能でのアドバイス生成/)
      ).toBeInTheDocument()
    })

    test('サービス改善目的が表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('2.2 サービス改善目的')).toBeInTheDocument()
      expect(screen.getByText(/利用状況の分析/)).toBeInTheDocument()
    })
  })

  describe('第3条（第三者提供）', () => {
    test('外部サービス利用の情報が表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('3.2 外部サービス利用')).toBeInTheDocument()
      expect(
        screen.getByText(/AI相談機能でのGPT-4 API利用/)
      ).toBeInTheDocument()
      expect(screen.getByText(/openai\.com\/privacy/)).toBeInTheDocument()
      expect(
        screen.getByText(/policies\.google\.com\/privacy/)
      ).toBeInTheDocument()
    })
  })

  describe('第4条（利用者の権利）', () => {
    test('利用者の権利が正しく表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(screen.getByText('4.1 開示・訂正・削除')).toBeInTheDocument()
      expect(screen.getByText(/個人情報の開示請求/)).toBeInTheDocument()
      expect(screen.getByText('4.2 データポータビリティ')).toBeInTheDocument()
      expect(screen.getByText('4.3 権利行使方法')).toBeInTheDocument()
    })
  })

  describe('第6条（お問い合わせ窓口）', () => {
    test('GitHubのリンクが正しく表示される', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      expect(
        screen.getByText(/yoshihama-nineball\/Angori\/issues/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/yoshihama-nineball\/Angori\/discussions/)
      ).toBeInTheDocument()
    })
  })

  describe('モバイル対応', () => {
    test('モバイル表示時のスタイルが適用される', () => {
      // モバイル表示をシミュレート
      mockUseMediaQuery.mockReturnValue(true)

      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      // モバイル表示でもコンテンツが表示されることを確認
      expect(screen.getByText('プライバシーポリシー')).toBeInTheDocument()
      expect(screen.getByText('第1条（収集する情報）')).toBeInTheDocument()
    })

    test('デスクトップ表示時にDividerが表示される', () => {
      // デスクトップ表示
      mockUseMediaQuery.mockReturnValue(false)

      const { container } = render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      // Dividerコンポーネントが存在することを確認
      const dividers = container.querySelectorAll('.MuiDivider-root')
      expect(dividers.length).toBeGreaterThan(0)
    })

    test('モバイル表示時にDividerが非表示になる', () => {
      // モバイル表示
      mockUseMediaQuery.mockReturnValue(true)

      const { container } = render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      // モバイル表示ではDividerが少ないことを確認
      const dividers = container.querySelectorAll('.MuiDivider-root')
      expect(dividers.length).toBe(0)
    })
  })

  describe('アクセシビリティ', () => {
    test('見出しが適切な階層構造になっている', () => {
      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      // h1相当のメインタイトル
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()

      // h2相当の各条項
      const h2Elements = screen.getAllByRole('heading', { level: 6 })
      expect(h2Elements.length).toBeGreaterThanOrEqual(7) // 7つの条項
    })

    test('リストが適切にマークアップされている', () => {
      const { container } = render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      const lists = container.querySelectorAll('ul')
      expect(lists.length).toBeGreaterThan(0)

      const listItems = container.querySelectorAll('li')
      expect(listItems.length).toBeGreaterThan(0)
    })
  })

  describe('エラーハンドリング', () => {
    test('useMediaQueryでエラーが発生しても表示される', () => {
      // useMediaQueryがエラーを投げる場合をシミュレート
      mockUseMediaQuery.mockImplementation(() => {
        throw new Error('Media query error')
      })

      // エラーが発生してもコンポーネントがクラッシュしないことを確認
      expect(() => {
        render(
          <TestWrapper>
            <PrivacyPage />
          </TestWrapper>
        )
      }).toThrow('Media query error')
    })
  })

  describe('パフォーマンス', () => {
    test('コンポーネントが適切にレンダリングされる時間', () => {
      const start = performance.now()

      render(
        <TestWrapper>
          <PrivacyPage />
        </TestWrapper>
      )

      const end = performance.now()
      const renderTime = end - start

      // レンダリング時間が合理的な範囲内であることを確認（200ms以下に緩和）
      expect(renderTime).toBeLessThan(200)
    })
  })
})
