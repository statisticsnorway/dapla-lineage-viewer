export const API = {
  GET_HEALTH: '/health/ready',
  GRAPHQL: '/graphql',
}

export const GSIM = {
  INSTANCE_VARIABLE: 'instanceVariable',
  REPRESENTED_VARIABLE: 'representedVariable',
  VARIABLE: 'variable',
  NAME: 'name'
}

export const MODEL = {
  DATASET_TYPES: ['unitDataSet'],
  VARIABLE_TYPES: ['instanceVariable', 'representedVariable', 'variable'],
  SMART: ['smart'],
  UNIT_DATA_SET: ['lineageDataset', 'reverseUnitDataSetLineage']
}

export const QUERY_HELPERS = {
  LINEAGE_DATASET: 'lineageDataset',
  REVERSE: {
    LF_IV: 'reverseLineageFieldInstanceVariable',
    IV_RV: 'reverseInstanceVariableRepresentedVariable',
    RV_V: 'reverseRepresentedVariableVariable',
    UDS_L: 'reverseUnitDataSetLineage'
  },
  SMART: 'smart'
}
