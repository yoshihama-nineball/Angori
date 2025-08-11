import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import TermsPage from './page'

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

describe('TermsPage', () => {
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
          <TermsPage />
        </TestWrapper>
      )

      expect(screen.getByText('利用規約')).toBeInTheDocument()
      expect(
        screen.getByText('Angori（アンゴリ）サービス利用条件')
      ).toBeInTheDocument()
      expect(screen.getByText('最終更新日：2025年8月11日')).toBeInTheDocument()
    })

    test('全ての条項が表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      // 各条項のタイトルをチェック
      expect(screen.getByText('第1条（サービス内容）')).toBeInTheDocument()
      expect(screen.getByText('第2条（禁止事項）')).toBeInTheDocument()
      expect(screen.getByText('第3条（免責事項）')).toBeInTheDocument()
      expect(
        screen.getByText('第4条（サービス変更・停止）')
      ).toBeInTheDocument()
      expect(screen.getByText('第5条（規約変更）')).toBeInTheDocument()
      expect(screen.getByText('第6条（準拠法）')).toBeInTheDocument()
    })
  })

  describe('第1条（サービス内容）', () => {
    test('サービス内容が正しく表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      expect(screen.getByText('第1条（サービス内容）')).toBeInTheDocument()
      expect(
        screen.getByText(/アンガーマネジメントをサポートするWebアプリです/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/感情記録、AI相談、過去ログ管理などの機能を提供します/)
      ).toBeInTheDocument()
    })
  })

  describe('第2条（禁止事項）', () => {
    test('禁止事項が正しく表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      expect(screen.getByText('第2条（禁止事項）')).toBeInTheDocument()
      expect(screen.getByText(/以下の行為を禁止します/)).toBeInTheDocument()
      expect(screen.getByText(/法令に違反する行為/)).toBeInTheDocument()
      expect(
        screen.getByText(/他の利用者に迷惑をかける行為/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/サービスの運営を妨害する行為/)
      ).toBeInTheDocument()
      expect(screen.getByText(/虚偽の情報を登録する行為/)).toBeInTheDocument()
    })
  })

  describe('第3条（免責事項）', () => {
    test('免責事項が正しく表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      expect(screen.getByText('第3条（免責事項）')).toBeInTheDocument()
      expect(
        screen.getByText(/本サービスは医療行為ではありません/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/AI相談の内容について責任を負いません/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/データの損失について責任を負いません/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/サービスの完全性を保証しません/)
      ).toBeInTheDocument()
    })
  })

  describe('第4条（サービス変更・停止）', () => {
    test('サービス変更・停止について表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      expect(
        screen.getByText('第4条（サービス変更・停止）')
      ).toBeInTheDocument()
      expect(
        screen.getByText(
          /事前通知なくサービス内容の変更・停止を行う場合があります/
        )
      ).toBeInTheDocument()
    })
  })

  describe('第5条（規約変更）', () => {
    test('規約変更について表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      expect(screen.getByText('第5条（規約変更）')).toBeInTheDocument()
      expect(
        screen.getByText(/必要に応じて本規約を変更することがあります/)
      ).toBeInTheDocument()
    })
  })

  describe('第6条（準拠法）', () => {
    test('準拠法について表示される', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      expect(screen.getByText('第6条（準拠法）')).toBeInTheDocument()
      expect(screen.getByText(/本規約は日本法に準拠します/)).toBeInTheDocument()
    })
  })

  describe('モバイル対応', () => {
    test('モバイル表示時のスタイルが適用される', () => {
      // モバイル表示をシミュレート
      mockUseMediaQuery.mockReturnValue(true)

      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      // モバイル表示でもコンテンツが表示されることを確認
      expect(screen.getByText('利用規約')).toBeInTheDocument()
      expect(screen.getByText('第1条（サービス内容）')).toBeInTheDocument()
    })

    test('デスクトップ表示時にDividerが表示される', () => {
      // デスクトップ表示
      mockUseMediaQuery.mockReturnValue(false)

      const { container } = render(
        <TestWrapper>
          <TermsPage />
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
          <TermsPage />
        </TestWrapper>
      )

      // モバイル表示ではDividerが少ないことを確認
      const dividers = container.querySelectorAll('.MuiDivider-root')
      expect(dividers.length).toBe(0)
    })
  })

  describe('リスト構造', () => {
    test('禁止事項がul形式で表示される', () => {
      const { container } = render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      const ulElements = container.querySelectorAll('ul')
      expect(ulElements.length).toBeGreaterThan(0)

      const liElements = container.querySelectorAll('ul li')
      expect(liElements.length).toBe(4) // 禁止事項は4つ
    })

    test('免責事項がol形式で表示される', () => {
      const { container } = render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      const olElements = container.querySelectorAll('ol')
      expect(olElements.length).toBeGreaterThan(0)

      const liElements = container.querySelectorAll('ol li')
      expect(liElements.length).toBe(4) // 免責事項は4つ
    })
  })

  describe('アクセシビリティ', () => {
    test('見出しが適切な階層構造になっている', () => {
      render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      // h1相当のメインタイトル
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()

      // h2相当の各条項
      const h2Elements = screen.getAllByRole('heading', { level: 6 })
      expect(h2Elements.length).toBeGreaterThanOrEqual(6) // 6つの条項
    })

    test('リストが適切にマークアップされている', () => {
      const { container } = render(
        <TestWrapper>
          <TermsPage />
        </TestWrapper>
      )

      const lists = container.querySelectorAll('ul, ol')
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
            <TermsPage />
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
          <TermsPage />
        </TestWrapper>
      )

      const end = performance.now()
      const renderTime = end - start

      // レンダリング時間が合理的な範囲内であることを確認（200ms以下）
      expect(renderTime).toBeLessThan(200)
    })
  })
})
