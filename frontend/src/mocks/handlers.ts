import { rest } from 'msw'

const API_BASE = 'http://localhost:5000/api/v1'

export const handlers = [
  // サインアップAPI
  rest.post(`${API_BASE}/users`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Authorization', 'Bearer mock-jwt-token-signup'),
      ctx.json({
        message: 'User created successfully'
      })
    )
  }),

  // ログインAPI
  rest.post(`${API_BASE}/users/sign_in`, (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.set('Authorization', 'Bearer mock-jwt-token-login'),
      ctx.json({})
    )
  }),
]