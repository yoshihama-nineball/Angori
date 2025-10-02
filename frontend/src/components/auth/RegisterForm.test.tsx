import { render, screen, waitFor } from '@/__tests__/utils/test-utils'
import userEvent from '@testing-library/user-event'
import RegisterForm from './RegisterForm'
import { server } from '@/__tests__/mocks/server'
import { rest } from 'msw'

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

describe('RegisterForm', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  describe('レンダリング', () => {
    it('フォームが正しく表示される', async () => {
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByText('ユーザー登録')).toBeInTheDocument()
      })

      expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument()
      expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
    })

    it('利用規約チェックボックスが表示される', async () => {
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument()
      })
    })
  })

  describe('ユーザーインタラクション', () => {
    it('利用規約に同意すると登録ボタンが有効になる', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByRole('checkbox')).toBeInTheDocument()
      })

      const checkbox = screen.getByRole('checkbox')
      const submitButton = screen.getByRole('button', {
        name: /アカウント作成/i,
      })

      expect(submitButton).toBeDisabled()
      await user.click(checkbox)
      expect(submitButton).toBeEnabled()
    })
  })

  describe('登録処理', () => {
    it('正しい入力で登録が成功し、ダッシュボードに遷移する', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument()
      })

      // フィールドを取得（getAllで取得して使い分ける）
      const passwordFields = screen.getAllByLabelText(/パスワード/)

      await user.type(screen.getByLabelText(/ユーザー名/i), 'テストユーザー')
      await user.type(
        screen.getByLabelText(/メールアドレス/i),
        'test@example.com'
      )
      await user.type(passwordFields[0], 'Password123') // 最初のパスワードフィールド
      await user.type(passwordFields[1], 'Password123') // 確認用パスワードフィールド
      await user.click(screen.getByRole('checkbox'))
      await user.click(screen.getByRole('button', { name: /アカウント作成/i }))

      await waitFor(
        () => {
          expect(mockPush).toHaveBeenCalledWith('/dashboard')
        },
        { timeout: 3000 }
      )
    })
  })

  describe.skip('Googleログイン', () => {
    it('TODO: 外部リダイレクトのモックが必要', () => {
      // 後で実装
    })
  })

  describe('バリデーション', () => {
    it('無効なメールアドレスでエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/メールアドレス/i)).toBeInTheDocument()
      })

      const emailInput = screen.getByLabelText(/メールアドレス/i)
      await user.type(emailInput, 'invalid-email')
      await user.tab()

      await waitFor(() => {
        expect(
          screen.getByText('有効なメールアドレスを入力してください')
        ).toBeInTheDocument()
      })
    })

    it('短いパスワードでエラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(document.querySelector('input[name="password"]')).toBeTruthy()
      })

      const passwordFields = document.querySelectorAll(
        'input[type="password"]'
      ) as NodeListOf<HTMLInputElement>
      await user.type(passwordFields[0], 'short')
      await user.tab()

      await waitFor(() => {
        expect(
          screen.getByText('パスワードは8文字以上で入力してください')
        ).toBeInTheDocument()
      })
    })

    it('パスワードが一致しない場合エラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(document.querySelector('input[name="password"]')).toBeTruthy()
      })

      const passwordFields = document.querySelectorAll(
        'input[type="password"]'
      ) as NodeListOf<HTMLInputElement>
      await user.type(passwordFields[0], 'Password123')
      await user.type(passwordFields[1], 'Password456')
      await user.tab()

      await waitFor(() => {
        expect(screen.getByText('パスワードが一致しません')).toBeInTheDocument()
      })
    })

    it('パスワードの形式が不正な場合エラーが表示される', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(document.querySelector('input[name="password"]')).toBeTruthy()
      })

      const passwordFields = document.querySelectorAll(
        'input[type="password"]'
      ) as NodeListOf<HTMLInputElement>
      // 大文字、小文字、数字のいずれかが欠けている
      await user.type(passwordFields[0], 'password')
      await user.tab()

      await waitFor(() => {
        expect(
          screen.getByText(
            /少なくとも1つの大文字、小文字、数字を含む必要があります/
          )
        ).toBeInTheDocument()
      })
    })

    it('利用規約に同意しない場合、登録ボタンが無効', async () => {
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument()
      })

      const submitButton = document.querySelector(
        'button[type="submit"]'
      ) as HTMLButtonElement
      expect(submitButton).toBeDisabled()
    })
  })

describe('エラーハンドリング', () => {
  it.skip('ネットワークエラー時にエラーメッセージが表示される', async () => {
    // このテストはMSWの制限によりスキップ
  })

  it('利用規約に同意せずに送信しようとするとボタンが無効', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument()
    })

    const passwordFields = document.querySelectorAll('input[type="password"]') as NodeListOf<HTMLInputElement>
    
    await user.type(screen.getByLabelText(/ユーザー名/i), 'テストユーザー')
    await user.type(screen.getByLabelText(/メールアドレス/i), 'test@example.com')
    await user.type(passwordFields[0], 'Password123')
    await user.type(passwordFields[1], 'Password123')
    
    const submitButton = document.querySelector('button[type="submit"]') as HTMLButtonElement
    expect(submitButton).toBeDisabled()
  })

  it.skip('名前が空の場合エラーが表示される', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await waitFor(() => {
      expect(screen.getByLabelText(/ユーザー名/i)).toBeInTheDocument()
    })

    const nameInput = screen.getByLabelText(/ユーザー名/i)
    await user.click(nameInput)
    await user.tab()

    await waitFor(() => {
      expect(screen.getByText('ユーザー名は必須です')).toBeInTheDocument()
    })
  })
})

  describe('UI インタラクション', () => {
    it('パスワード確認フィールドの表示/非表示トグルが動作する', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(document.querySelector('input[name="password"]')).toBeTruthy()
      })

      const passwordFields = document.querySelectorAll(
        'input[type="password"], input[type="text"]'
      ) as NodeListOf<HTMLInputElement>
      const toggleButtons = screen.getAllByLabelText(
        /パスワードの表示切替|確認パスワードの表示切替/i
      )

      // ここから追加が必要
      // 最初はパスワードタイプ
      expect(passwordFields[1].type).toBe('password')

      // 2番目のトグルボタンをクリック（確認用パスワード）
      if (toggleButtons.length > 1) {
        await user.click(toggleButtons[1])

        await waitFor(() => {
          const updatedFields = document.querySelectorAll(
            'input[name="password_confirmation"]'
          ) as NodeListOf<HTMLInputElement>
          expect(updatedFields[0].type).toBe('text')
        })
      }
    }) // この閉じ括弧が抜けていた

    it('利用規約モーダルが開ける', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByText(/利用規約/)).toBeInTheDocument()
      })

      const termsLink = screen.getByText(/利用規約/)
      await user.click(termsLink)

      await waitFor(() => {
        expect(
          document.querySelector('[role="dialog"]') ||
            document.querySelector('.MuiModal-root')
        ).toBeTruthy()
      })
    })

    it('プライバシーポリシーモーダルが開ける', async () => {
      const user = userEvent.setup()
      render(<RegisterForm />)

      await waitFor(() => {
        expect(screen.getByText(/プライバシーポリシー/)).toBeInTheDocument()
      })

      const privacyLink = screen.getByText(/プライバシーポリシー/)
      await user.click(privacyLink)

      await waitFor(() => {
        expect(
          document.querySelector('[role="dialog"]') ||
            document.querySelector('.MuiModal-root')
        ).toBeTruthy()
      })
    })
  })

  it('利用規約モーダルが開ける', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await waitFor(() => {
      expect(screen.getByText(/利用規約/)).toBeInTheDocument()
    })

    // 利用規約リンクをクリック
    const termsLink = screen.getByText(/利用規約/)
    await user.click(termsLink)

    // モーダルが開くことを確認（TermsModalコンポーネントがレンダリングされる）
    await waitFor(() => {
      // モーダルのタイトルや閉じるボタンなどが表示されることを確認
      expect(
        document.querySelector('[role="dialog"]') ||
          document.querySelector('.MuiModal-root')
      ).toBeTruthy()
    })
  })

  it('プライバシーポリシーモーダルが開ける', async () => {
    const user = userEvent.setup()
    render(<RegisterForm />)

    await waitFor(() => {
      expect(screen.getByText(/プライバシーポリシー/)).toBeInTheDocument()
    })

    const privacyLink = screen.getByText(/プライバシーポリシー/)
    await user.click(privacyLink)

    await waitFor(() => {
      expect(
        document.querySelector('[role="dialog"]') ||
          document.querySelector('.MuiModal-root')
      ).toBeTruthy()
    })
  })
})
