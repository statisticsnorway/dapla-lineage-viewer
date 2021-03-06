const fromVariableType = {
  instanceVariable: `
    {
      instanceVariable(filter: {id: $id}) {
        id
        name {
          languageCode
          languageText
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
        reverseLineageFieldInstanceVariable {
          id
          name
          smartGraph {
            fromId
            toId
          }
          smart {
            id
            name
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
        reverseInstanceVariableRepresentedVariable {
          id
          name {
            languageText
            languageCode
          }
          description {
            languageCode
            languageText
          }
          reverseLineageFieldInstanceVariable {
            id
            name
            smartGraph {
              fromId
              toId
            }
            smart {
              id
              name
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
        description {
          languageCode
          languageText
        }
        reverseRepresentedVariableVariable {
          id
          name {
            languageText
            languageCode
          }
          description {
            languageCode
            languageText
          }
          reverseInstanceVariableRepresentedVariable {
            id
            name {
              languageText
              languageCode
            }
            description {
              languageCode
              languageText
            }
            reverseLineageFieldInstanceVariable {
              id
              name
              smartGraph {
                fromId
                toId
              }
              smart {
                id
                name
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
          name
          smartGraph {
            fromId
            toId
          }
          smart {
            id
            name
            lineageDataset {
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
              }
            }
            instanceVariable {
              id
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
