import { render, screen, fireEvent } from '@testing-library/react'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import * as useMediaQueryModule from '@mui/material/useMediaQuery'

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/'),
}))

describe('Footer', () => {
  const pushMock = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    ;(useRouter as jest.Mock).mockReturnValue({ push: pushMock })
  })

  it('モバイル環境で表示される', () => {
    jest.spyOn(useMediaQueryModule, 'default').mockReturnValue(true)

    render(<Footer />)

    expect(screen.getByTestId('footer-nav')).toBeInTheDocument()
  })

  it('PC環境では表示されない', () => {
    jest.spyOn(useMediaQueryModule, 'default').mockReturnValue(false)

    render(<Footer />)

    expect(screen.queryByTestId('footer-nav')).not.toBeInTheDocument()
  })

  it('ナビゲーションをクリックすると router.push が呼ばれる', () => {
    jest.spyOn(useMediaQueryModule, 'default').mockReturnValue(true)

    render(<Footer />)

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[3]) // 例: カレンダーアイコン

    expect(pushMock).toHaveBeenCalledWith('/calendar')
  })
})
