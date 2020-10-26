export const API = {
  GET_HEALTH: '/health/ready',
  GRAPHQL: '/graphql',
}

export const GSIM = {
  INSTANCE_VARIABLE: 'instanceVariable',
  REPRESENTED_VARIABLE: 'representedVariable',
  VARIABLE: 'variable',
  NAME: 'name',
  DESCRIPTION: 'description',
  UNIT_DATA_SET: 'unitDataSet'
}

export const MODEL = {
  DATA_TYPE: ['variable', 'dataset'],
  DATASET_TYPES: ['unitDataSet'],
  VARIABLE_TYPES: ['instanceVariable', 'representedVariable', 'variable'],
  SMART: ['smart'],
  UNIT_DATA_SET: ['lineageDataset', 'reverseUnitDataSetLineage'],
  LINEAGE_FIELDS: ['unitDataSet', 'lineage', 'reverseLineageFieldLineageDataset']
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
