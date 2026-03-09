import { render } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { MemoryRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    // Need both MemoryRouter (for Routes) and AuthProvider (for useAuth in ProtectedRoutes)
    render(
      <AuthProvider>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </AuthProvider>
    )
    expect(document.body).toBeInTheDocument()
  })
})