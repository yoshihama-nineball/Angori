export const mockUser = {
  id: 1,
  name: 'テストユーザー',
  email: 'test@example.com',
}

export const mockLoginRequest = {
  email: 'test@example.com',
  password: 'Password123',
}

export const mockRegisterRequest = {
  name: 'テストユーザー',
  email: 'test@example.com',
  password: 'Password123',
  password_confirmation: 'Password123',
}

export const mockAuthToken = 'Bearer mock-jwt-token'

export const mockApiError = {
  errors: ['認証に失敗しました'],
  success: '',
}

export const mockApiSuccess = {
  errors: [],
  success: 'ログインに成功しました',
}
