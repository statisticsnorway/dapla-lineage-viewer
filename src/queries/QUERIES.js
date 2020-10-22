const fromVariableType = {
  instanceVariable: `
    {
      instanceVariable(filter: {id: $id}) {
        id
        name {
          languageCode
          languageText
        }
        reverseLineageFieldInstanceVariable {
          id
          smart {
            id
            lineageDataset {
              id
              reverseUnitDataSetLineage {
                id
                name {
                  languageCode
                  languageText
                }
                description {
                  languageCode
                  languageText
                }
                version
                administrativeStatus
                valuation
                createdBy
                lastUpdatedBy
                metadataSourcePath
                shortName
                temporalityType
                dataSetState
                dataSourcePath
              }
            }
          }
        }
      }
    }
  `,
  representedVariable: `
    {
      representedVariable(filter: {id: $id}) {
        id
        name {
          languageCode
          languageText
        }
        reverseInstanceVariableRepresentedVariable {
          id
          name {
            languageText
            languageCode
          }
          reverseLineageFieldInstanceVariable {
            id
            smart {
              id
              lineageDataset {
                id
                reverseUnitDataSetLineage {
                  id
                  name {
                    languageText
                    languageCode
                  }
                  description {
                    languageText
                    languageCode
                  }
                  version
                  administrativeStatus
                  valuation
                  createdBy
                  lastUpdatedBy
                  metadataSourcePath
                  shortName
                  temporalityType
                  dataSetState
                  dataSourcePath
                }
              }
            }
          }
        }
      }
    }
  `,
  variable: `
    {
      variable(filter: {id: $id}) {
        id
        name {
          languageCode
          languageText
        }
        reverseRepresentedVariableVariable {
          id
          name {
            languageText
            languageCode
          }
          reverseInstanceVariableRepresentedVariable {
            id
            name {
              languageText
              languageCode
            }
            reverseLineageFieldInstanceVariable {
              id
              smart {
                id
                lineageDataset {
                  id
                  reverseUnitDataSetLineage {
                    id
                    name {
                      languageText
                      languageCode
                    }
                    description {
                      languageText
                      languageCode
                    }
                    version
                    administrativeStatus
                    valuation
                    createdBy
                    lastUpdatedBy
                    metadataSourcePath
                    shortName
                    temporalityType
                    dataSetState
                    dataSourcePath
                  }
                }
              }
            }
          }
        }
      }
    }
  `
}

export const DATASETS_FROM_LINEAGE = variableType => fromVariableType[variableType]

export const VARIABLES_FROM_LINEAGE = `
  {
    unitDataSet(filter: {id: $id}) {
      id
      name {
        languageCode
        languageText
      }
      description {
        languageCode
        languageText
      }
      lineage {
        id
        reverseLineageFieldLineageDataset {
          id
          smart {
            id
            instanceVariable {
              id
              name {
                languageText
                languageCode
              }
              description {
                languageCode
                languageText
              }
              representedVariable {
                id
                name {
                  languageCode
                  languageText
                }
                description {
                  languageCode
                  languageText
                }
                variable {
                  id
                  name {
                    languageCode
                    languageText
                  }
                  description {
                    languageCode
                    languageText
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`
