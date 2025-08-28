import { render, screen } from '@testing-library/react'
import Alert from './Alert'

describe('アラートコンポーネントのテスト', () => {
  it('子要素を正しく取得できるかのテスト', () => {
    render(
      <Alert severity="success" data-testid="typo-test-id">
        アラートの文字列
      </Alert>
    )
    const alertElement = screen.getByRole('alert')
    expect(alertElement).toBeInTheDocument()
    expect(screen.getByText('アラートの文字列')).toBeInTheDocument()
  })

  it('正しいseverityを適用する', () => {
    render(<Alert severity="success">成功メッセージ</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardSuccess')
  })

  it('error severityで正しいクラスが適用される', () => {
    render(<Alert severity="error">エラーメッセージ</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardError')
  })

  it('warning severityで正しいクラスが適用される', () => {
    render(<Alert severity="warning">警告メッセージ</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardWarning')
  })

  it('info severityで正しいクラスが適用される', () => {
    render(<Alert severity="info">情報メッセージ</Alert>)
    const alert = screen.getByRole('alert')
    expect(alert).toHaveClass('MuiAlert-standardInfo')
  })

  it('アイコンが正しく表示される', () => {
    render(<Alert severity="success">成功メッセージ</Alert>)
    const alert = screen.getByRole('alert')
    const icon = alert.querySelector('svg[data-testid="CheckCircleIcon"]')
    expect(icon).toBeInTheDocument()
  })
})
