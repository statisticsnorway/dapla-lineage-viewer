import React from 'react'
import userEvent from '@testing-library/user-event'
import { render } from '@testing-library/react'

import { AppSettings } from '../components'
import { ApiContext, LanguageContext } from '../context/AppContext'
import { TEST_CONFIGURATIONS } from '../configurations/TEST'
import { SETTINGS, TEST_IDS } from '../enums'

const { alternativeApi, errorObject, errorString, language } = TEST_CONFIGURATIONS
const apiContext = TEST_CONFIGURATIONS.apiContext(jest.fn(), jest.fn())

const setup = (error, loading) => {
  const { getByPlaceholderText, getByTestId, getByText } = render(
    <ApiContext.Provider value={apiContext}>
      <LanguageContext.Provider value={{ language: language }}>
        <AppSettings error={error} loading={loading} open={true} setOpen={jest.fn()} />
      </LanguageContext.Provider>
    </ApiContext.Provider>
  )

  return { getByPlaceholderText, getByTestId, getByText }
}

test('Renders correctly', () => {
  const { getByPlaceholderText } = setup(undefined, false)

  expect(getByPlaceholderText(SETTINGS.API[language])).toHaveValue(apiContext.api)
})

test('Clicking button and pressing enter in input fires api call', async () => {
  const { getByPlaceholderText, getByText } = setup(undefined, false)

  await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), '{enter}')

  userEvent.click(getByText(SETTINGS.APPLY[language]))

  expect(apiContext.setRestApi).toHaveBeenCalled()
  expect(apiContext.setGraphqlApi).toHaveBeenCalled()
})

test('Editing values works correctly', async () => {
  const { getByPlaceholderText, getByText } = setup(undefined, false)

  await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), alternativeApi)

  expect(getByText(SETTINGS.EDITED_VALUES[language])).toBeInTheDocument()

  userEvent.click(getByText(SETTINGS.APPLY[language]))

  expect(apiContext.setRestApi).toHaveBeenCalled()
  expect(apiContext.setGraphqlApi).toHaveBeenCalled()
})

test('Resetting to default values works correctly', async () => {
  const { getByPlaceholderText, getByTestId } = setup(undefined, false)

  await userEvent.type(getByPlaceholderText(SETTINGS.API[language]), alternativeApi)

  userEvent.click(getByTestId(TEST_IDS.DEFAULT_SETTINGS_VALUES_BUTTON))

  expect(getByPlaceholderText(SETTINGS.API[language])).toHaveValue(apiContext.api)
})

test('Shows error when there is a problem with the API', () => {
  const { getByText } = setup(errorObject, false)

  expect(getByText(errorString)).toBeInTheDocument()
})
