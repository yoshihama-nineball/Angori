import { registerUser, loginUser } from '../../lib/api/auth'

describe('MSW動作確認テスト', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('サインアップAPIがモックされている', async () => {
    const result = await registerUser({
      name: 'Test User',
      email: 'test@example.com',
      password: 'Password123', // 大文字、小文字、数字を含む
      password_confirmation: 'Password123',
    })

    console.log('サインアップ結果:', result)

    expect(result.errors).toHaveLength(0)
    expect(localStorage.getItem('token')).toBeTruthy()
  })

  it('ログインAPIがモックされている', async () => {
    const result = await loginUser({
      email: 'test@example.com',
      password: 'Password123', // こちらも統一
    })

    expect(result.success).toBeTruthy()
    expect(result.errors).toHaveLength(0)
  })
})
