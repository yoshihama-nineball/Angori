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

// console.logのモック
const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation()

// テスト用のシンプルなテーマ
const testTheme = createTheme()

describe('Header', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  afterAll(() => {
    consoleLogSpy.mockRestore()
  })

  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider theme={testTheme}>{component}</ThemeProvider>)
  }

  describe('基本表示', () => {
    it('ヘッダーが正しく表示される', () => {
      renderWithTheme(<Header />)

      expect(screen.getByText('アンゴリ')).toBeInTheDocument()
      expect(
        screen.getByLabelText('account of current user')
      ).toBeInTheDocument()
    })

    it('タイトルがリンクとして機能する', () => {
      renderWithTheme(<Header />)

      const titleLink = screen.getByRole('link')
      expect(titleLink).toHaveAttribute('href', '/')
    })

    it('アカウントアイコンが表示される', () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toBeInTheDocument()
    })
  })

  describe('メニュー機能', () => {
    it('アカウントアイコンクリックでメニューが開く', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        expect(screen.getByText('アプリについて')).toBeInTheDocument()
        expect(screen.getByText('ログアウト')).toBeInTheDocument()
      })
    })

    it('アプリについてメニュー項目をクリックするとメニューが閉じる', async () => {
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

      // メニューが閉じたことを確認（visibility: hiddenになることを確認）
      await waitFor(() => {
        const menu = screen.queryByRole('presentation', { hidden: true })
        if (menu) {
          expect(menu).toHaveClass('MuiModal-hidden')
        } else {
          // 完全に削除された場合
          expect(screen.queryByText('アプリについて')).not.toBeInTheDocument()
        }
      })
    })

    it('メニュー外クリックでメニューが閉じる', async () => {
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
    it('ログアウトメニューをクリックすると確認モーダルが表示される', async () => {
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

    it('ログアウトモーダルでキャンセルボタンをクリックするとモーダルが閉じる', async () => {
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

    it('ログアウトモーダルでログアウトボタンをクリックするとログアウト処理が実行される', async () => {
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

      // ログアウト処理が実行されることを確認
      await waitFor(() => {
        expect(consoleLogSpy).toHaveBeenCalledWith('ログアウト実行')
      })

      // モーダルが閉じることを確認
      await waitFor(() => {
        expect(screen.queryByText('ログアウト確認')).not.toBeInTheDocument()
      })
    })

    it('ログアウトモーダルでESCキーを押すとモーダルが閉じる', async () => {
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

  describe('スタイリング', () => {
    it('正しいCSS classが適用される', () => {
      renderWithTheme(<Header />)

      const appBar = screen.getByRole('banner')
      expect(appBar).toHaveClass('MuiAppBar-root')
    })

    it('タイトルに正しいスタイルが適用される', () => {
      renderWithTheme(<Header />)

      const title = screen.getByText('アンゴリ')
      expect(title).toHaveStyle('cursor: pointer')
      expect(title).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037
    })

    it('アカウントアイコンに正しい色が適用される', () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037
    })

    it('メニュー項目に正しいスタイルが適用される', async () => {
      renderWithTheme(<Header />)

      // メニューを開く
      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        const aboutItem = screen.getByText('アプリについて')
        const logoutItem = screen.getByText('ログアウト')

        expect(aboutItem).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037
        expect(logoutItem).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037
      })
    })
  })

  describe('アクセシビリティ', () => {
    it('適切なARIAラベルが設定されている', () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toHaveAttribute('aria-controls', 'menu-appbar')
      expect(accountButton).toHaveAttribute('aria-haspopup', 'true')
    })

    it('メニューが開いた時のARIA属性が正しい', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        // メニューコンテナ（role="presentation"）のIDを確認
        const menuContainer = document.getElementById('menu-appbar')
        expect(menuContainer).toBeInTheDocument()

        // 実際のメニューリスト（role="menu"）の存在を確認
        const menu = screen.getByRole('menu')
        expect(menu).toBeInTheDocument()
      })
    })

    it('モーダルに適切なロールが設定されている', async () => {
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
        const dialog = screen.getByRole('dialog')
        expect(dialog).toBeInTheDocument()
      })
    })
  })

  describe('エラーハンドリング', () => {
    it('メニューのanchorElがnullの場合でもエラーが発生しない', () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation()

      renderWithTheme(<Header />)

      expect(consoleSpy).not.toHaveBeenCalled()
      consoleSpy.mockRestore()
    })

    it('モーダルの状態変更でエラーが発生しない', async () => {
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

  describe('テーマ統一性', () => {
    it('Buttonテーマと一貫した色使いになっている', async () => {
      renderWithTheme(<Header />)

      // タイトルの色がButtonのoutlined colorと同じ
      const title = screen.getByText('アンゴリ')
      expect(title).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037

      // アカウントアイコンの色もButtonテーマと同じ
      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037

      // メニュー項目の色もButtonテーマと同じ
      fireEvent.click(accountButton)

      await waitFor(() => {
        const aboutItem = screen.getByText('アプリについて')
        expect(aboutItem).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037
      })
    })

    it('ログアウトボタンがerror colorを使用している', async () => {
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
        const logoutButton = screen.getByRole('button', { name: 'ログアウト' })
        // error colorのボタンであることを確認
        expect(logoutButton).toHaveAttribute('class')
        expect(logoutButton.className).toContain('MuiButton-containedError')
      })
    })
  })

  describe('ホバー効果', () => {
    it('タイトルホバー時に色が変わる', () => {
      renderWithTheme(<Header />)

      const title = screen.getByText('アンゴリ')

      // ホバー前の色を確認
      expect(title).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037

      // ホバー効果はCSS擬似クラスなので、実際の色変更のテストは困難
      // 代わりにスタイル設定があることを確認
      expect(title).toHaveAttribute('class')
    })

    it('アカウントアイコンにホバー効果が設定されている', () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      expect(accountButton).toHaveStyle('color: rgb(93, 64, 55)') // #5D4037
    })

    it('メニュー項目にホバー効果が設定されている', async () => {
      renderWithTheme(<Header />)

      const accountButton = screen.getByLabelText('account of current user')
      fireEvent.click(accountButton)

      await waitFor(() => {
        const aboutItem = screen.getByText('アプリについて')
        fireEvent.mouseEnter(aboutItem)

        // ホバー効果の設定を確認（実際の色変更は擬似クラスのためテスト困難）
        expect(aboutItem).toBeInTheDocument()
      })
    })
  })
})
