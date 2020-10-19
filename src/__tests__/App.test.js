import React from 'react'
import { render } from '@testing-library/react'

import App from '../App'

const setup = () => {
  const { getByText } = render(<App />)

  return { getByText }
}

test('Does not crash', () => {
  setup()
})
