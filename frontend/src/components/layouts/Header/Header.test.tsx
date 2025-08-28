import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import Header from './Header'
import { useRouter } from 'next/navigation'
import * as authStoreModule from '../../../../lib/stores/authStore'

// Next.js と auth store のモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}))

jest.mock('../../../../lib/api/auth', () => ({
  logoutUser: jest.fn(() => Promise.resolve({ success: true })),
}))

jest.mock('../../../../lib/stores/authStore', () => ({
  useAuthStore: jest.fn(),
}))

// テスト用のシンプルなテーマ
const testTheme = createTheme()

describe('Header', () => {
  const pushMock = jest.fn()
  const mockSetAuthenticated = jest.fn()
  const mockInitialize = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={testTheme}>{component}</ThemeProvider>)
  }

  describe('未認証状態', () => {
    beforeEach(() => {
      const mockUseAuthStore = jest.mocked(authStoreModule.useAuthStore)
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        setAuthenticated: mockSetAuthenticated,
        initialize: mockInitialize,
      })
    })

    test('ログインボタンが表示される', () => {
      renderWithTheme(<Header />)

      expect(screen.getByText('アンゴリ')).toBeInTheDocument()
      expect(screen.getByText('ログイン')).toBeInTheDocument()
      expect(
        screen.queryByLabelText('account of current user')
      ).not.toBeInTheDocument()
    })

    test('タイトルがリンクとして機能する', () => {
      renderWithTheme(<Header />)

      const titleLink = screen.getByText('アンゴリ').closest('a')
      expect(titleLink).toHaveAttribute('href', '/')
    })
  })

  describe('認証状態', () => {
    beforeEach(() => {
      const mockUseAuthStore = jest.mocked(authStoreModule.useAuthStore)
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: true,
        setAuthenticated: mockSetAuthenticated,
        initialize: mockInitialize,
      })
    })

    test('アカウントアイコンが表示される', () => {
      renderWithTheme(<Header />)

      expect(
        screen.getByLabelText('account of current user')
      ).toBeInTheDocument()
      expect(screen.queryByText('ログイン')).not.toBeInTheDocument()
    })

    test('アカウントアイコンクリックでメニューが開く', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })
    })

    test('ログアウトメニューをクリックすると確認モーダルが表示される', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })

      const logoutItem = screen.getByText('ログアウト')
      fireEvent.click(logoutItem)

      await waitFor(() => {
        expect(screen.getByText('ログアウト確認')).toBeInTheDocument()
        expect(
          screen.getByText('本当にログアウトしますか？')
        ).toBeInTheDocument()
      })
    })

    test('ログアウトモーダルでキャンセルボタンをクリックするとモーダルが閉じる', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })

      const logoutItem = screen.getByText('ログアウト')
      fireEvent.click(logoutItem)

      await waitFor(() => {
        expect(screen.getByText('ログアウト確認')).toBeInTheDocument()
      })

      const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
      fireEvent.click(cancelButton)

      await waitFor(() => {
        expect(screen.queryByText('ログアウト確認')).not.toBeInTheDocument()
      })
    })
  })

  describe('基本機能', () => {
    beforeEach(() => {
      const mockUseAuthStore = jest.mocked(authStoreModule.useAuthStore)
      mockUseAuthStore.mockReturnValue({
        isAuthenticated: false,
        setAuthenticated: mockSetAuthenticated,
        initialize: mockInitialize,
      })
    })

    test('正しいMUIコンポーネントが使用されている', () => {
      renderWithTheme(<Header />)

      const appBar = screen.getByRole('banner')
      expect(appBar).toHaveClass('MuiAppBar-root')

      const title = screen.getByText('アンゴリ')
      expect(title).toHaveClass('MuiTypography-root')
    })
  })
})
