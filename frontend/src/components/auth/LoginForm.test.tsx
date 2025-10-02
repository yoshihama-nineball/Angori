import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import userEvent from '@testing-library/user-event'
import LoginForm from './LoginForm'
import { server } from '@/__tests__/mocks/server'  // 追加
import { rest } from 'msw'  // 追加

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

describe('LoginForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('レンダリング', () => {
    it('フォームが正しく表示される', async () => {
      render(<LoginForm />)

      await waitFor(() => {
        expect(screen.getByText('ログイン')).toBeInTheDocument()
      })

      expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
      expect(document.querySelector('input[name="password"]')).toBeTruthy()
    })

    it('新規登録リンクが表示される', async () => {
      render(<LoginForm />)

      await waitFor(() => {
        expect(screen.getByText(/新規登録/i)).toBeInTheDocument()
      })
    })
  })

  describe('ユーザーインタラクション', () => {
    it('パスワード表示/非表示トグルが動作する', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await waitFor(() => {
        expect(document.querySelector('input[name="password"]')).toBeTruthy()
      })

      const passwordInput = document.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement
      const toggleButton = screen.getByLabelText(/パスワードの表示切替/i)

      expect(passwordInput.type).toBe('password')
      await user.click(toggleButton)
      expect(passwordInput.type).toBe('text')
    })
  })

  describe('ログイン処理', () => {
    it('正しい入力でログインが成功し、ダッシュボードに遷移する', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText(/メールアドレス/i)
      const passwordInput = document.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'Password123')

      // type="submit"のボタンを取得（Googleログインはtype="button"）
      const loginButton = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement
      await user.click(loginButton)

      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/dashboard')
        },
        { timeout: 3000 }
      )
    })

    it.skip('ログインエラー時、エラーメッセージが表示される', async () => {
      const user = userEvent.setup()

      server.use(
        rest.post(
          'http://localhost:5000/api/v1/users/sign_in',
          (req, res, ctx) => {
            return res(
              ctx.status(401),
              ctx.json({ error: '認証に失敗しました' })
            )
          }
        )
      )

      render(<LoginForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText(/メールアドレス/i)
      const passwordInput = document.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement

      await user.type(emailInput, 'test@example.com')
      await user.type(passwordInput, 'WrongPassword')

      const loginButton = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement
      await user.click(loginButton)

      await waitFor(
        () => {
          const errorText = screen.queryByText(/認証に失敗|エラーが発生/i)
          expect(errorText).toBeInTheDocument()
        },
        { timeout: 3000 }
      )
    })
  })

  describe.skip('Googleログイン', () => {
    it('TODO: 外部リダイレクトのモックが必要', () => {})
  })

  describe('バリデーション', () => {
    it('無効なメールアドレスでエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<LoginForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText(/メールアドレス/i)
      await user.type(emailInput, 'invalid-email')

      const passwordInput = document.querySelector(
        'input[name="password"]'
      ) as HTMLInputElement
      await user.type(passwordInput, 'test')

      const loginButton = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement
      await user.click(loginButton)

      await waitFor(() => {
        expect(
          screen.getByText('有効なメールアドレスを入力してください')
        ).toBeInTheDocument()
      })
    })
  })
})
