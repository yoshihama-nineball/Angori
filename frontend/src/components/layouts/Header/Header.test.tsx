import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'
import Header from './Header'
import { useRouter } from 'next/navigation'

// Next.jsのモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}))

// テスト用のシンプルなテーマ
const testTheme = createTheme()

describe('Header', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={testTheme}>{component}</ThemeProvider>)
  }

  describe('基本表示', () => {
    test('ヘッダーが正しく表示される', () => {
      renderWithTheme(<Header />)

      expect(screen.getByText('アンゴリ')).toBeInTheDocument()
      expect(
        screen.getByLabelText('account of current user')
      ).toBeInTheDocument()
    })

    test('タイトルがリンクとして機能する', () => {
      renderWithTheme(<Header />)

      const titleLink = screen.getByRole('link')
      expect(titleLink).toHaveAttribute('href', '/')
    })

    test('アカウントアイコンが表示される', () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toBeInTheDocument()
    })
  })

  describe('メニュー機能', () => {
    test('アカウントアイコンクリックでメニューが開く', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })
    })

    test('アプリについてメニュー項目をクリックするとメニューが閉じる', async () => {
      renderWithTheme(<Header />)

      // メニューを開く
      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
      })

      // アプリについてをクリック
      const aboutItem = screen.getByText('アプリについて')
      fireEvent.click(aboutItem)

      // メニューが閉じたことを確認
      await waitFor(() => {
        const menu = screen.queryByRole('presentation', { hidden: true })
        if (menu) {
          expect(menu).toHaveClass('MuiModal-hidden')
        } else {
          expect(screen.queryByText('アプリについて')).not.toBeInTheDocument()
        }
      })
    })

    test('メニュー外クリックでメニューが閉じる', async () => {
      renderWithTheme(<Header />)

      // メニューを開く
      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
      })

      // 背景（Backdrop）をクリック
      const backdrop = document.querySelector('.MuiBackdrop-root')
      if (backdrop) {
        fireEvent.click(backdrop)
      }

      // メニューが閉じたことを確認
      await waitFor(() => {
        const menu = document.getElementById('menu-appbar')
        if (menu) {
          expect(menu.className).toContain('MuiModal-hidden')
        } else {
          expect(screen.queryByText('アプリについて')).not.toBeInTheDocument()
        }
      })
    })
  })

  describe('ログアウト確認モーダル', () => {
    test('ログアウトメニューをクリックすると確認モーダルが表示される', async () => {
      renderWithTheme(<Header />)

      // メニューを開く
      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })

      // ログアウトをクリック
      const logoutItem = screen.getByText('ログアウト')
      fireEvent.click(logoutItem)

      // モーダルが表示されることを確認
      await waitFor(() => {
        expect(screen.getByText('ログアウト確認')).toBeInTheDocument()
        expect(
          screen.getByText('本当にログアウトしますか？')
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'キャンセル' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('button', { name: 'ログアウト' })
        ).toBeInTheDocument()
      })
    })

    test('ログアウトモーダルでキャンセルボタンをクリックするとモーダルが閉じる', async () => {
      renderWithTheme(<Header />)

      // メニューを開いてログアウトをクリック
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

      // キャンセルボタンをクリック
      const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
      fireEvent.click(cancelButton)

      // モーダルが閉じることを確認
      await waitFor(() => {
        expect(screen.queryByText('ログアウト確認')).not.toBeInTheDocument()
      })
    })

    test('ログアウトモーダルでログアウトボタンをクリックするとモーダルが閉じる', async () => {
      renderWithTheme(<Header />)

      // メニューを開いてログアウトをクリック
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

      // ログアウトボタンをクリック
      const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
      fireEvent.click(logoutButton)

      // モーダルが閉じることを確認（console.logの代わり）
      await waitFor(() => {
        expect(screen.queryByText('ログアウト確認')).not.toBeInTheDocument()
      })
    })

    test('ログアウトモーダルでESCキーを押すとモーダルが閉じる', async () => {
      renderWithTheme(<Header />)

      // メニューを開いてログアウトをクリック
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

      // Dialog要素にESCキーイベントを送る
      const dialog = screen.getByRole('dialog')
      fireEvent.keyDown(dialog, {
        key: 'Escape',
        code: 'Escape',
        keyCode: 27,
        charCode: 27,
      })

      // モーダルが閉じることを確認
      await waitFor(
        () => {
          expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })
  })

  describe('コンポーネント構造', () => {
    test('正しいMUIコンポーネントが使用されている', () => {
      renderWithTheme(<Header />)

      const appBar = screen.getByRole('banner')
      expect(appBar).toHaveClass('MuiAppBar-root')

      const title = screen.getByText('アンゴリ')
      expect(title).toHaveClass('MuiTypography-root')

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toHaveClass('MuiIconButton-root')
    })

    test('タイトルがクリック可能な要素として設定されている', () => {
      renderWithTheme(<Header />)

      const title = screen.getByText('アンゴリ')
      expect(title).toHaveAttribute('class')
      expect(title.closest('a')).toHaveAttribute('href', '/')
    })

    test('メニュー項目が正しく構造化されている', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        const aboutItem = screen.getByText('アプリについて')
        const logoutItem = screen.getByText('ログアウト')

        expect(aboutItem).toHaveClass('MuiMenuItem-root')
        expect(logoutItem).toHaveClass('MuiMenuItem-root')
      })
    })
  })

  describe('アクセシビリティ', () => {
    test('適切なARIAラベルが設定されている', () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toHaveAttribute('aria-controls', 'menu-appbar')
      expect(accountButton).toHaveAttribute('aria-haspopup', 'true')
    })

    test('メニューが開いた時のARIA属性が正しい', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        const menuContainer = document.getElementById('menu-appbar')
        expect(menuContainer).toBeInTheDocument()

        const menu = screen.getByRole('menu')
        expect(menu).toBeInTheDocument()
      })
    })

    test('モーダルに適切なロールが設定されている', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })

      const logoutItem = screen.getByText('ログアウト')
      fireEvent.click(logoutItem)

      await waitFor(() => {
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      })
    })
  })

  describe('エラーハンドリング', () => {
    test('メニューのanchorElがnullの場合でもエラーが発生しない', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      renderWithTheme(<Header />)

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    test('モーダルの状態変更でエラーが発生しない', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      renderWithTheme(<Header />)

      // 複数回モーダルを開閉
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

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })
  })

  describe('ボタン機能', () => {
    test('ログアウトボタンがerror colorを使用している', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })

      const logoutItem = screen.getByText('ログアウト')
      fireEvent.click(logoutItem)

      await waitFor(() => {
        const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
        expect(logoutButton).toHaveClass('MuiButton-containedError')
      })
    })

    test('キャンセルボタンがoutlinedスタイルを使用している', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })

      const logoutItem = screen.getByText('ログアウト')
      fireEvent.click(logoutItem)

      await waitFor(() => {
        const cancelButton = screen.getByRole('button', { name: 'キャンセル' })
        expect(cancelButton).toHaveClass('MuiButton-outlined')
      })
    })
  })

  describe('インタラクション', () => {
    test('ボタンが正常にクリックできる', async () => {
      renderWithTheme(<Header />)

      // アカウントボタンのクリック
      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toBeInTheDocument()

      fireEvent.click(accountButton)

      // メニューが開くことを確認
      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
      })
    })

    test('メニュー項目が正常にクリックできる', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
      })

      const aboutItem = screen.getByText('アプリについて')
      expect(aboutItem).toBeInTheDocument()

      // クリックしてもエラーが発生しないことを確認
      fireEvent.click(aboutItem)
    })
  })
})
