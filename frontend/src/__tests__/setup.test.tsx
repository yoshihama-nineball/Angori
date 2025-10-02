import { render, screen } from './utils/test-utils'

describe('テスト環境の動作確認', () => {
  it('基本的なレンダリングができる', () => {
    render(<div>Hello Test</div>)
    expect(screen.getByText('Hello Test')).toBeInTheDocument()
  })
})
