import { render, screen } from '@testing-library/react'
import TermsPage from './page'

jest.mock('@mui/material/useMediaQuery', () => () => true) // isMobile = true

describe('TermsPage', () => {
  it('タイトルを正しくrendersする', () => {
    expect.assertions(1)
    render(<TermsPage />)
    expect(
      screen.getByRole('heading', { name: /利用規約/i })
    ).toBeInTheDocument()
  })

  it('スマホ表示用のタイトルを正しくrenderする', () => {
    render(<TermsPage />)
    const title = screen.getByRole('heading', { name: /利用規約/i })
    expect(title).toHaveClass('MuiTypography-h5') // h5 = mobile
  })

  it('サブタイトルを正しくrenderする', () => {
    expect.assertions(1)
    render(<TermsPage />)
    expect(screen.getByText(/サービス利用条件/i)).toBeInTheDocument()
  })

  it('最終更新日の表示を正しくrenderする', () => {
    expect.assertions(1)
    render(<TermsPage />)
    expect(screen.getByText(/最終更新日：2025年4月13日/i)).toBeInTheDocument()
  })

  it('各セクションのタイトルを正しくrenderする', () => {
    expect.assertions(2)
    render(<TermsPage />)
    expect(screen.getByText(/第1条（適用）/)).toBeInTheDocument()
    expect(screen.getByText(/第2条（定義）/)).toBeInTheDocument()
  })

  it('各セクションの内容を正しくrendersする', () => {
    expect.assertions(2)
    render(<TermsPage />)
    expect(
      screen.getByText(
        /本規約は、ユーザーと当社との間のサービス利用に関する条件を定めるものです。/
      )
    ).toBeInTheDocument()
    expect(
      screen.getByText(
        /本規約において「ユーザー」とは、当社のサービスを利用するすべての者を指します。/
      )
    ).toBeInTheDocument()
  })
})
