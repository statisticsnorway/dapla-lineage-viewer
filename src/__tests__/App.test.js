import React from 'react'
import useAxios from 'axios-hooks'
import { render } from '@testing-library/react'

import App from '../App'
import { AppContextProvider } from '../context/AppContext'
import { API } from '../configurations'
import { TEST_CONFIGURATIONS } from '../configurations/TEST'
import { UI } from '../enums'

const { errorObject, language } = TEST_CONFIGURATIONS

jest.mock('../components/AppHome', () => () => null)
jest.mock('../components/AppMenu', () => () => null)
jest.mock('../components/AppSettings', () => () => null)

const setup = () => {
  const { getByText } = render(
    <AppContextProvider>
      <App />
    </AppContextProvider>
  )

  return { getByText }
}

test('Loads', () => {
  useAxios.mockReturnValue([{ loading: true, error: undefined }])
  setup()

  expect(useAxios).toHaveBeenCalledWith(`${window.__ENV.REACT_APP_API}${API.GET_HEALTH}`, { useCache: false })
})

test('Does not crash', () => {
  useAxios.mockReturnValue([{ loading: false, error: undefined }])
  setup()

  expect(useAxios).toHaveBeenCalledWith(`${window.__ENV.REACT_APP_API}${API.GET_HEALTH}`, { useCache: false })
})

test('Renders error when backend call returns error', () => {
  useAxios.mockReturnValue([{ loading: false, error: errorObject }])
  const { getByText } = setup()

  expect(getByText(UI.API_ERROR_MESSAGE[language])).toBeInTheDocument()
})
