import { getLocalizedGsimObjectText, getNestedObject } from '@statisticsnorway/dapla-js-utilities'
import ColorHash from 'color-hash'

import { GSIM, MODEL, QUERY_HELPERS } from '../configurations'

const hash = new ColorHash({ lightness: [0.35, 0.5, 0.65] })

export const variableSymbols = {
  dataset: 'square',
  instanceVariable: 'circle',
  representedVariable: 'diamond',
  variable: 'star'
}

export const nodeGraphFromVariable = (id, data, type, language) => data.reduce((acc, cur) => {
  const lineage = { nodes: [], links: [] }

  const setRusl = (lineageField, ruslId) => {
    if (lineageField.length !== 0) {
      lineageField.forEach(smart => {
        const smartSmart = getNestedObject(smart, MODEL.SMART)

        if (smartSmart !== undefined && smartSmart.length !== 0) {
          smartSmart.forEach(lineageDataset => {
            const rudsl = getNestedObject(lineageDataset, MODEL.UNIT_DATA_SET)

            if (rudsl !== undefined && rudsl.length !== 0) {
              rudsl.forEach(unitDataSet => {
                lineage.nodes.push(({
                  id: unitDataSet.id,
                  nodeLabelName: getLocalizedGsimObjectText(language, unitDataSet[GSIM.NAME]),
                  color: hash.hex(unitDataSet.id),
                  symbolType: variableSymbols.dataset
                }))
                lineage.links.push(({ source: ruslId, target: unitDataSet.id }))
              })
            }
          })
        }
      })
    }
  }

  const setLfr = (lineageFieldsRepresented, lfrId) => {
    if (lineageFieldsRepresented.length !== 0) {
      lineageFieldsRepresented.forEach(lineageFieldRepresented => {
        lineage.nodes.push(({
          id: lineageFieldRepresented.id,
          nodeLabelName: getLocalizedGsimObjectText(language, lineageFieldRepresented[GSIM.NAME]),
          color: hash.hex(lineageFieldRepresented.id),
          symbolType: variableSymbols.instanceVariable
        }))
        lineage.links.push(({ source: lfrId, target: lineageFieldRepresented.id }))

        setRusl(lineageFieldRepresented[QUERY_HELPERS.REVERSE.LF_IV], lineageFieldRepresented.id)
      })
    }
  }

  const setLfv = (lineageFieldsVariable, lfvId) => {
    if (lineageFieldsVariable.length !== 0) {
      lineageFieldsVariable.forEach(lineageFieldVariable => {
        lineage.nodes.push(({
          id: lineageFieldVariable.id,
          nodeLabelName: getLocalizedGsimObjectText(language, lineageFieldVariable[GSIM.NAME]),
          color: hash.hex(lineageFieldVariable.id),
          symbolType: variableSymbols.representedVariable
        }))
        lineage.links.push(({ source: lfvId, target: lineageFieldVariable.id }))

        setLfr(lineageFieldVariable[QUERY_HELPERS.REVERSE.IV_RV], lineageFieldVariable.id)
      })
    }
  }

  switch (type) {
    case GSIM.INSTANCE_VARIABLE:
      const lineageFieldsInstance = cur[type][QUERY_HELPERS.REVERSE.LF_IV]

      setRusl(lineageFieldsInstance, id)

      break

    case GSIM.REPRESENTED_VARIABLE:
      const lineageFieldsRepresented = cur[type][QUERY_HELPERS.REVERSE.IV_RV]

      setLfr(lineageFieldsRepresented, id)

      break

    case GSIM.VARIABLE:
      const lineageFieldsVariable = cur[type][QUERY_HELPERS.REVERSE.RV_V]

      setLfv(lineageFieldsVariable, id)

      break

    default:
      break
  }

  return lineage
}, {})
