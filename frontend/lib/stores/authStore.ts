import { User } from '@/schemas/user'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// lib/stores/authStore.ts
interface AuthState {
  isAuthenticated: boolean
  user: User | null
  setAuthenticated: (auth: boolean, user?: User) => void
  logout: () => void
  initialize: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuthenticated: (auth: boolean, user?: User | null) =>
        set({ isAuthenticated: auth, user }),
      logout: () => set({ isAuthenticated: false, user: null }),
      initialize: () => {
        if (typeof window !== 'undefined') {
          const hasAuthToken = document.cookie.includes('auth_token=')
          if (hasAuthToken) {
            set({ isAuthenticated: true })
          }
        }
      },
    }),
    { name: 'auth-storage' }
  )
)
