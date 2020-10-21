import React, { useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Button, Divider, Dropdown, Grid, Input, Loader } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import LineageView from './LineageView'
import { API, MODEL } from '../configurations'
import { UI } from '../enums'

function AppHome ({ restApi, language }) {
  const [apiReady, setApiReady] = useState(false)
  const [variableId, setVariableId] = useState('Variable_DUMMY')
  const [variableType, setVariableType] = useState(MODEL.VARIABLE_TYPES[2])

  const [{ loading, error }] = useAxios(`${restApi}${API.GET_HEALTH}`, { useCache: false })

  useEffect(() => {
    if (!loading && !error) {
      setApiReady(true)

      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      const id = urlParams.get('id')
      const type = urlParams.get('type')

      if (id && type !== null) {
        setVariableId(id)
        setVariableType(type)
      }
    } else {
      setApiReady(false)
    }
  }, [error, loading])

  return (
    <>
      <Grid>
        <Grid.Column width={3}>
          <Input
            fluid
            value={variableId}
            onFocus={(e) => e.target.select()}
            onKeyPress={({ key }) => key === 'Enter' && setApiReady(true)}
            onChange={(e, { value }) => {
              setApiReady(false)
              setVariableId(value)
            }}
          />
        </Grid.Column>
        <Grid.Column width={13}>
          <Dropdown
            selection
            value={variableType}
            options={MODEL.VARIABLE_TYPES.map(type => ({ key: type, text: type, value: type }))}
            onChange={(e, { value }) => {
              setApiReady(false)
              setVariableType(value)
            }}
          />
        </Grid.Column>
      </Grid>
      <Divider hidden />
      <Button primary content='Go' onClick={() => setApiReady(true)} />
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> :
          apiReady &&
          <LineageView language={language} variableId={variableId} variableType={variableType} />
      }
    </>
  )
}

export default AppHome
