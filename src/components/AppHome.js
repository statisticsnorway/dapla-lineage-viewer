import React, { useEffect, useState } from 'react'
import useAxios from 'axios-hooks'
import { Divider, Dropdown, Grid, Input, Loader } from 'semantic-ui-react'
import { ErrorMessage } from '@statisticsnorway/dapla-js-utilities'

import LineageView from './LineageView'
import { API, MODEL } from '../configurations'
import { UI } from '../enums'

const options = MODEL.VARIABLE_TYPES.map(type => ({ key: type, text: type, value: type }))
  .concat([{ key: 'dataset', text: 'dataset', value: 'dataset' }])

function AppHome ({ restApi, language }) {
  const [apiReady, setApiReady] = useState(false)
  const [dataId, setDataId] = useState('Variable_DUMMY')
  const [dataType, setDataType] = useState(MODEL.VARIABLE_TYPES[2])

  const [{ loading, error }] = useAxios(`${restApi}${API.GET_HEALTH}`, { useCache: false })

  useEffect(() => {
    if (!loading && !error) {
      const queryString = window.location.search
      const urlParams = new URLSearchParams(queryString)
      const id = urlParams.get('id')
      const type = urlParams.get('type')

      if (id && type !== null) {
        setDataId(id)
        setDataType(type)
      }

      setApiReady(true)
    } else {
      setApiReady(false)
    }
  }, [error, loading])

  return (
    <>
      {loading ? <Loader active inline='centered' /> :
        error ? <ErrorMessage error={UI.API_ERROR_MESSAGE[language]} language={language} /> :
          apiReady && <LineageView dataId={dataId} dataType={dataType} language={language} />
      }
      <Divider hidden />
      <Grid>
        <Grid.Column width={3}>
          <Input
            fluid
            value={dataId}
            onFocus={(e) => e.target.select()}
            onKeyPress={({ key }) => key === 'Enter' && setApiReady(true)}
            onChange={(e, { value }) => {
              setApiReady(false)
              setDataId(value)
            }}
          />
        </Grid.Column>
        <Grid.Column width={13}>
          <Dropdown
            selection
            value={dataType}
            options={options}
            onChange={(e, { value }) => {
              setApiReady(false)
              setDataType(value)
            }}
          />
        </Grid.Column>
      </Grid>
    </>
  )
}

export default AppHome
