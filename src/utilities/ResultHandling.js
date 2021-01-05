import { getLocalizedGsimObjectText, getNestedObject } from '@statisticsnorway/dapla-js-utilities'
import ColorHash from 'color-hash'

import { GSIM, MODEL, QUERY_HELPERS } from '../configurations'

const hash = new ColorHash({ lightness: [0.35, 0.5, 0.65] })

export const variableSymbols = {
  dataset: 'diamond',
  instanceVariable: 'triangle',
  representedVariable: 'square',
  variable: 'circle'
}

export const nodeGraphFromDataset = (id, data, language) => data.reduce((acc, cur) => {
  const lineage = {
    nodes: [
      {
        id: id,
        size: 1500,
        color: hash.hex(id),
        symbolType: variableSymbols.dataset,
        nodeLabelName: getLocalizedGsimObjectText(language, cur[GSIM.UNIT_DATA_SET][GSIM.NAME]),
        nodeLabelDescription: getLocalizedGsimObjectText(language, cur[GSIM.UNIT_DATA_SET][GSIM.DESCRIPTION])
      }
    ],
    links: []
  }

  const lineageFields = getNestedObject(cur, MODEL.LINEAGE_FIELDS)

  if (lineageFields !== undefined && lineageFields.length !== 0) {
    lineageFields.forEach(lineageField => {
      lineage.nodes.push({
        size: 600,
        id: lineageField.id,
        color: hash.hex(lineageField.id),
        nodeLabelName: lineageField.name,
        nodeLabelDescription: '',
        symbolType: variableSymbols.instanceVariable,
      })

      lineage.links.push({
        source: lineageField.id,
        target: id
      })

      lineageField.smartGraph.forEach(smartGraph => {
        lineage.links.push({
          source: smartGraph.fromId,
          target: smartGraph.toId
        })
      })
    })

    lineageFields.forEach(lineageField => {
      lineageField.smart.forEach(smart => {
        if (lineage.nodes.filter(node => node.id === smart.id).length === 0) {
          lineage.nodes.push({
            size: 300,
            id: smart.id,
            color: hash.hex(smart.id),
            nodeLabelName: smart.name,
            nodeLabelDescription: '',
            symbolType: variableSymbols.instanceVariable
          })
        }

        const representedVariable = getNestedObject(smart, [GSIM.INSTANCE_VARIABLE, GSIM.REPRESENTED_VARIABLE])
        const variable = getNestedObject(smart, [GSIM.INSTANCE_VARIABLE, GSIM.REPRESENTED_VARIABLE, GSIM.VARIABLE])

        if (representedVariable !== undefined) {
          if (lineage.nodes.filter(node => node.id === representedVariable.id).length === 0) {
            lineage.nodes.push({
              size: 600,
              id: representedVariable.id,
              color: hash.hex(representedVariable.id),
              symbolType: variableSymbols.representedVariable,
              nodeLabelName: getLocalizedGsimObjectText(language, representedVariable[GSIM.NAME]),
              nodeLabelDescription: getLocalizedGsimObjectText(language, representedVariable[GSIM.DESCRIPTION])
            })
          }

          lineage.links.push({
            source: representedVariable.id,
            target: smart.id
          })

          if (variable !== undefined) {
            if (lineage.nodes.filter(node => node.id === variable.id).length === 0) {
              lineage.nodes.push({
                size: 600,
                id: variable.id,
                color: hash.hex(variable.id),
                symbolType: variableSymbols.variable,
                nodeLabelName: getLocalizedGsimObjectText(language, variable[GSIM.NAME]),
                nodeLabelDescription: getLocalizedGsimObjectText(language, variable[GSIM.DESCRIPTION])
              })

              lineage.links.push({
                source: variable.id,
                target: representedVariable.id
              })
            }
          }
        }
      })
    })

    lineageFields.forEach(lineageField => {
      lineageField.smart.forEach(smart => {
        smart.lineageDataset.reverseUnitDataSetLineage.forEach(dataset => {
          if (lineage.nodes.filter(node => node.id === dataset.id).length === 0) {
            lineage.nodes.push({
              size: 300,
              id: dataset.id,
              color: hash.hex(dataset.id),
              symbolType: variableSymbols.dataset,
              nodeLabelName: getLocalizedGsimObjectText(language, dataset[GSIM.NAME]),
              nodeLabelDescription: getLocalizedGsimObjectText(language, dataset[GSIM.DESCRIPTION])
            })
          }

          lineage.links.push(({
            source: dataset.id,
            target: smart.id
          }))
        })
      })
    })
  }

  return lineage
}, {})

export const nodeGraphFromVariable = (id, data, type, language) => data.reduce((acc, cur) => {
  const lineage = { nodes: [], links: [] }

  const setRusl = (lineageField, ruslId) => {
    if (lineageField.length !== 0) {
      lineageField.forEach(smart => {
        const smartSmart = getNestedObject(smart, MODEL.SMART)
        let documentedInDataset = false
        let documentedInDatasetId

        if (smart.hasOwnProperty('smartGraph') && smart.smartGraph.length === 1) {
          documentedInDatasetId = smart.smartGraph[0].fromId
        } else {
          documentedInDatasetId = false
        }

        if (smartSmart !== undefined && smartSmart.length !== 0) {
          smartSmart.forEach(lineageDataset => {
            const rudsl = getNestedObject(lineageDataset, MODEL.UNIT_DATA_SET)

            documentedInDataset = documentedInDatasetId && documentedInDatasetId === lineageDataset.id

            if (rudsl !== undefined && rudsl.length !== 0) {
              rudsl.forEach(dataset => {
                lineage.nodes.push(({
                  size: 300,
                  id: dataset.id,
                  color: hash.hex(dataset.id),
                  symbolType: variableSymbols.dataset,
                  fontWeight: documentedInDataset ? 'bold' : 'normal',
                  nodeLabelName: getLocalizedGsimObjectText(language, dataset[GSIM.NAME]),
                  nodeLabelDescription: getLocalizedGsimObjectText(language, dataset[GSIM.DESCRIPTION])
                }))
                lineage.links.push(({ source: ruslId, target: dataset.id, label: documentedInDataset ? '*' : '' }))
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
          size: 600,
          id: lineageFieldRepresented.id,
          color: hash.hex(lineageFieldRepresented.id),
          symbolType: variableSymbols.instanceVariable,
          nodeLabelName: getLocalizedGsimObjectText(language, lineageFieldRepresented[GSIM.NAME]),
          nodeLabelDescription: getLocalizedGsimObjectText(language, lineageFieldRepresented[GSIM.DESCRIPTION])
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
          size: 600,
          id: lineageFieldVariable.id,
          color: hash.hex(lineageFieldVariable.id),
          symbolType: variableSymbols.representedVariable,
          nodeLabelName: getLocalizedGsimObjectText(language, lineageFieldVariable[GSIM.NAME]),
          nodeLabelDescription: getLocalizedGsimObjectText(language, lineageFieldVariable[GSIM.DESCRIPTION])
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

      if (cur[type].hasOwnProperty(GSIM.REPRESENTED_VARIABLE)) {
        const rv = cur[type][GSIM.REPRESENTED_VARIABLE]

        lineage.nodes.push({
          size: 600,
          id: rv.id,
          color: hash.hex(rv.id),
          symbolType: variableSymbols.representedVariable,
          nodeLabelName: getLocalizedGsimObjectText(language, rv[GSIM.NAME]),
          nodeLabelDescription: getLocalizedGsimObjectText(language, rv[GSIM.DESCRIPTION])
        })

        lineage.links.push({ source: rv.id, target: id })

        if (rv.hasOwnProperty(GSIM.VARIABLE)) {
          const rvV = rv[GSIM.VARIABLE]

          lineage.nodes.push({
            size: 600,
            id: rvV.id,
            color: hash.hex(rvV.id),
            symbolType: variableSymbols.variable,
            nodeLabelName: getLocalizedGsimObjectText(language, rvV[GSIM.NAME]),
            nodeLabelDescription: getLocalizedGsimObjectText(language, rvV[GSIM.DESCRIPTION])
          })

          lineage.links.push({ source: rvV.id, target: rv.id })
        }
      }

      break

    case GSIM.REPRESENTED_VARIABLE:
      const lineageFieldsRepresented = cur[type][QUERY_HELPERS.REVERSE.IV_RV]

      setLfr(lineageFieldsRepresented, id)

      if (cur[type].hasOwnProperty(GSIM.VARIABLE)) {
        const rvV = cur[type][GSIM.VARIABLE]

        lineage.nodes.push({
          size: 600,
          id: rvV.id,
          color: hash.hex(rvV.id),
          symbolType: variableSymbols.variable,
          nodeLabelName: getLocalizedGsimObjectText(language, rvV[GSIM.NAME]),
          nodeLabelDescription: getLocalizedGsimObjectText(language, rvV[GSIM.DESCRIPTION])
        })

        lineage.links.push({ source: rvV.id, target: id })
      }

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
