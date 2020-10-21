import '@testing-library/jest-dom/extend-expect'

jest.mock('axios-hooks')
jest.mock('graphql-hooks')

window._env = {
  REACT_APP_API: process.env.REACT_APP_API
}
