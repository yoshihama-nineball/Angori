import '@testing-library/jest-dom'
import 'whatwg-fetch'

const { server } = require('./src/__tests__/mocks/server')

// MUI テストのためのモック
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Next.js Image コンポーネントのモック
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    return <img {...props} />
  },
}))

// Next.js Router のモック
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => '/',
}))

// MSWサーバーの設定
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }))
afterEach(() => {
  server.resetHandlers()

  // Zustand ストアのリセット（存在する場合のみ）
  try {
    const { useAuthStore } = require('./src/lib/stores/authStore')
    if (useAuthStore?.setState) {
      useAuthStore.setState({ isAuthenticated: false })
    }
  } catch (error) {
    // authStoreが存在しない場合は無視
  }
})
afterAll(() => server.close())
