import { render} from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    // Test basique pour vérifier que l'application se charge
    expect(document.body).toBeInTheDocument()
  })
})
