import { render, screen, fireEvent } from '@testing-library/react'
import Footer from './Footer'
import { useRouter } from 'next/navigation'
import * as useMediaQueryModule from '@mui/material/useMediaQuery'

// router.push をモック
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(() => '/home'),
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

    expect(screen.getByRole('navigation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /home/i })).toBeInTheDocument()
  })

  it('PC環境では表示されない', () => {
    jest.spyOn(useMediaQueryModule, 'default').mockReturnValue(false)

    render(<Footer />)

    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('ナビゲーションをクリックすると router.push が呼ばれる', () => {
    jest.spyOn(useMediaQueryModule, 'default').mockReturnValue(true)

    render(<Footer />)

    const calendarButton = screen.getByRole('button', { name: '' }) // ラベルなしなので name:'' で取得
    fireEvent.click(calendarButton)

    expect(pushMock).toHaveBeenCalled()
  })
})
