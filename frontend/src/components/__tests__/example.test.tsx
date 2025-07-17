import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

const theme = createTheme()

const TestComponent = () => (
  <div data-testid="test-component">Hello Angori! 🦍</div>
)

describe('Example Test', () => {
  it('renders correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('test-component')).toBeInTheDocument()
    expect(screen.getByText('Hello Angori! 🦍')).toBeInTheDocument()
  })
})
