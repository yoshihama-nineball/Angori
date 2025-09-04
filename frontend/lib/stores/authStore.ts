import { User } from '@/schemas/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthState {
  isAuthenticated: boolean
  user: User | null
  setAuthenticated: (auth: boolean, user?: User) => void
  logout: () => void
  initialize: () => Promise<void> // Promiseを返すように変更
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,

      setAuthenticated: (auth: boolean, user?: User | null) =>
        set({ isAuthenticated: auth, user }),
      logout: () => {
        localStorage.removeItem('token')
        set({ isAuthenticated: false, user: null })
      },
      initialize: async () => {
        if (typeof window !== 'undefined') {
          const urlParams = new URLSearchParams(window.location.search)
          const urlToken = urlParams.get('token')

          if (urlToken) {
            localStorage.setItem('token', urlToken)
            window.history.replaceState({}, '', window.location.pathname)

            // ユーザー情報を取得
            try {
              const response = await fetch(
                'http://localhost:5000/api/v1/auth/me',
                {
                  // フルURLを指定
                  headers: {
                    Authorization: urlToken,
                    'Content-Type': 'application/json',
                  },
                }
              )
              if (response.ok) {
                const user = await response.json()
                set({ isAuthenticated: true, user })
                return
              }
            } catch {}

            set({ isAuthenticated: true, user: null })
          } else {
            const storedToken = localStorage.getItem('token')
            if (storedToken) {
              // 既存トークンでもユーザー情報を取得
              try {
                const response = await fetch(
                  'http://localhost:5000/api/v1/auth/me',
                  {
                    headers: {
                      Authorization: storedToken,
                      'Content-Type': 'application/json',
                    },
                  }
                )
                if (response.ok) {
                  const user = await response.json()
                  set({ isAuthenticated: true, user })
                  return
                }
              } catch {}

              set({ isAuthenticated: true, user: null })
            } else {
              const hasAuthToken = document.cookie.includes('auth_token=')
              if (hasAuthToken) {
                set({ isAuthenticated: true, user: null })
              }
            }
          }
        }
      },
    }),
    { name: 'auth-storage' }
  )
)
