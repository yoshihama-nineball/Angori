import { rest } from 'msw'

const API_BASE = 'http://localhost:5000/api/v1'

export const handlers = [
  // 正常系: サインアップ
  rest.post(`${API_BASE}/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Authorization', 'Bearer mock-jwt-token-signup'),
      ctx.json({
        message: 'User created successfully',
      })
    )
  }),

  // 正常系: ログイン
  rest.post(`${API_BASE}/users/sign_in`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Authorization', 'Bearer mock-jwt-token-login'),
      ctx.json({})
    )
  }),

  // Googleログイン
  rest.post(`${API_BASE}/users/google_login`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Authorization', 'Bearer mock-jwt-token-google'),
      ctx.json({})
    )
  }),
]

// エラーハンドラー（テストで上書き用）
export const errorHandlers = {
  loginError: rest.post(`${API_BASE}/users/sign_in`, (req, res, ctx) => {
    return res(ctx.status(401), ctx.json({ error: '認証に失敗しました' }))
  }),

  signupError: rest.post(`${API_BASE}/users`, (req, res, ctx) => {
    return res(
      ctx.status(422),
      ctx.json({ errors: { email: ['既に使用されています'] } })
    )
  }),

  networkError: rest.post(`${API_BASE}/users/sign_in`, (_req, res, _ctx) => {
    return res.networkError('Network error')
  }),
}
