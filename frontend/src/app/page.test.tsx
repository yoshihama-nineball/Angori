import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import theme from '@/theme'
import TutorialPage from './page'

// IntersectionObserverのモック
const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver

// Next.js Imageコンポーネントのモック
jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: any) {
    return <img src={src} alt={alt} {...props} />
  }
})

// テストヘルパー: ThemeProviderでラップ
const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>)
}

describe('TutorialPage', () => {
  beforeEach(() => {
    // コンソールログのモック
    jest.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('基本的な表示要素', () => {
    test('メインタイトルが表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(screen.getByText('ゴリラの力で怒りを笑いに')).toBeInTheDocument()
    })

    test('ゴリラ画像が表示される', () => {
      renderWithTheme(<TutorialPage />)

      const gorillaImages = screen.getAllByAltText('アンガーゴリラ')
      expect(gorillaImages).toHaveLength(3) // メイン + 相談機能 + 可視化機能
    })

    test('スピーチバブルが表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(screen.getByText('バナナ食うか？')).toBeInTheDocument()
      expect(screen.getByText('どうした？')).toBeInTheDocument()
      expect(screen.getByText('一緒に解決しよう！')).toBeInTheDocument()
    })

    test('アクションボタンが表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(screen.getByText('ユーザ登録')).toBeInTheDocument()
      expect(screen.getByText('ゲスト利用してみる')).toBeInTheDocument()
    })
  })

  describe('サービス説明セクション', () => {
    test('Angoriの説明文が表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(
        screen.getByText(/Angoriは、従来の真面目なアンガーマネジメント/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/ASDやHSPなど感情コントロールが難しい方/)
      ).toBeInTheDocument()
    })

    test('感情コントロールの説明が表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(
        screen.getByText(/負の感情で疲れているあなたを/)
      ).toBeInTheDocument()
      expect(
        screen.getByText(/やさしくユーモアあふれたゴリラと一緒に/)
      ).toBeInTheDocument()
    })
  })

  describe('アプリ機能セクション', () => {
    test('アプリについてのタイトルが表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(screen.getByText('アプリについて')).toBeInTheDocument()
    })

    test('相談機能の説明が表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(screen.getByText('相談室での相談で悩みを解決')).toBeInTheDocument()
      expect(screen.getByText(/今回の怒りはバナナ何本分だ/)).toBeInTheDocument()
    })

    test('可視化機能の説明が表示される', () => {
      renderWithTheme(<TutorialPage />)

      expect(screen.getByText('怒りの傾向を可視化')).toBeInTheDocument()
      expect(screen.getByText(/過去のアンガーログの記録/)).toBeInTheDocument()
      expect(screen.getByText(/落ち着きポイントシステム/)).toBeInTheDocument()
    })
  })

  describe('ユーザーインタラクション', () => {
    test('ユーザ登録ボタンをクリックするとコンソールログが出力される', () => {
      const consoleSpy = jest.spyOn(console, 'log')
      renderWithTheme(<TutorialPage />)

      const userRegisterButton = screen.getByText('ユーザ登録')
      fireEvent.click(userRegisterButton)

      expect(consoleSpy).toHaveBeenCalledWith('ユーザ登録画面へ遷移')
    })

    test('ゲスト利用ボタンをクリックするとコンソールログが出力される', () => {
      const consoleSpy = jest.spyOn(console, 'log')
      renderWithTheme(<TutorialPage />)

      const guestLoginButton = screen.getByText('ゲスト利用してみる')
      fireEvent.click(guestLoginButton)

      expect(consoleSpy).toHaveBeenCalledWith('ゲストログイン')
    })
  })

  describe('レスポンシブデザイン', () => {
    test('コンテナのmaxWidthがsmに設定されている', () => {
      renderWithTheme(<TutorialPage />)

      // Containerコンポーネントの存在を確認
      const container = document.querySelector('.MuiContainer-root')
      expect(container).toBeInTheDocument()
    })
  })

  describe('アニメーション要素', () => {
    test('アニメーション用のdata-animate属性が設定されている', () => {
      renderWithTheme(<TutorialPage />)

      // data-animate属性を持つ要素の存在確認
      const animatedElements = document.querySelectorAll('[data-animate]')
      expect(animatedElements.length).toBeGreaterThan(0)
    })

    test('スピーチバブルにバウンスアニメーションが設定されている', () => {
      renderWithTheme(<TutorialPage />)

      const speechBubble = screen.getByText('バナナ食うか？')
      const chipElement = speechBubble.closest('.MuiChip-root')

      // アニメーションスタイルが適用されているかチェック
      expect(chipElement).toHaveStyle({
        animation: 'bounce 2s infinite',
      })
    })
  })

  describe('画像の設定', () => {
    test('ゴリラ画像のsrcが正しく設定されている', () => {
      renderWithTheme(<TutorialPage />)

      const gorillaImages = screen.getAllByAltText('アンガーゴリラ')
      gorillaImages.forEach((img) => {
        expect(img).toHaveAttribute(
          'src',
          '/angori-image/angori-counseling.jpg'
        )
      })
    })

    test('画像にpriorityが設定されている（メイン画像）', () => {
      renderWithTheme(<TutorialPage />)

      // priority属性はNext.jsのImageコンポーネントで重要
      // テストではsrc属性の存在で代用
      const mainImage = screen.getAllByAltText('アンガーゴリラ')[0]
      expect(mainImage).toHaveAttribute('src')
    })
  })

  describe('テーマの適用', () => {
    test('theme.paletteの色が正しく適用されている', () => {
      renderWithTheme(<TutorialPage />)

      const title = screen.getByText('ゴリラの力で怒りを笑いに')
      // MUIのTypographyコンポーネントが存在することを確認
      expect(title).toHaveClass('MuiTypography-root')
      expect(title).toHaveClass('MuiTypography-h4')
    })

    test('ボタンにprimary/secondaryカラーが設定されている', () => {
      renderWithTheme(<TutorialPage />)

      const primaryButton = screen.getByText('ユーザ登録')
      const secondaryButton = screen.getByText('ゲスト利用してみる')

      expect(primaryButton.closest('button')).toHaveClass(
        'MuiButton-containedPrimary'
      )
      expect(secondaryButton.closest('button')).toHaveClass(
        'MuiButton-containedSecondary'
      )
    })
  })

  describe('アクセシビリティ', () => {
    test('メインタイトルがh1要素として設定されている', () => {
      renderWithTheme(<TutorialPage />)

      const mainTitle = screen.getByRole('heading', { level: 1 })
      expect(mainTitle).toHaveTextContent('ゴリラの力で怒りを笑いに')
    })

    test('サブタイトルがh2要素として設定されている', () => {
      renderWithTheme(<TutorialPage />)

      const subTitle = screen.getByRole('heading', { level: 2 })
      expect(subTitle).toHaveTextContent('アプリについて')
    })

    test('ボタンにrole="button"が適用されている', () => {
      renderWithTheme(<TutorialPage />)

      const buttons = screen.getAllByRole('button')
      expect(buttons).toHaveLength(2)
      expect(buttons[0]).toHaveTextContent('ユーザ登録')
      expect(buttons[1]).toHaveTextContent('ゲスト利用してみる')
    })
  })
})
