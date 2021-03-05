'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var useAxios = require('axios-hooks');
var semanticUiReact = require('semantic-ui-react');
var daplaJsUtilities = require('@statisticsnorway/dapla-js-utilities');
var graphqlHooks = require('graphql-hooks');
var reactD3Graph = require('react-d3-graph');
var d3Shape = require('d3-shape');
var ColorHash = require('color-hash');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var React__default = /*#__PURE__*/_interopDefaultLegacy(React);
var useAxios__default = /*#__PURE__*/_interopDefaultLegacy(useAxios);
var ColorHash__default = /*#__PURE__*/_interopDefaultLegacy(ColorHash);

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
};
const DATASETS_FROM_LINEAGE = variableType => fromVariableType[variableType];
const VARIABLES_FROM_LINEAGE = `
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
`;

const API = {
  GET_HEALTH: '/health/ready',
  GRAPHQL: '/graphql'
};
const GSIM = {
  INSTANCE_VARIABLE: 'instanceVariable',
  REPRESENTED_VARIABLE: 'representedVariable',
  VARIABLE: 'variable',
  NAME: 'name',
  DESCRIPTION: 'description',
  UNIT_DATA_SET: 'unitDataSet'
};
const MODEL = {
  DATA_TYPE: ['variable', 'dataset'],
  DATASET_TYPES: ['unitDataSet'],
  VARIABLE_TYPES: ['instanceVariable', 'representedVariable', 'variable'],
  SMART: ['smart'],
  UNIT_DATA_SET: ['lineageDataset', 'reverseUnitDataSetLineage'],
  LINEAGE_FIELDS: ['unitDataSet', 'lineage', 'reverseLineageFieldLineageDataset']
};
const QUERY_HELPERS = {
  LINEAGE_DATASET: 'lineageDataset',
  REVERSE: {
    LF_IV: 'reverseLineageFieldInstanceVariable',
    IV_RV: 'reverseInstanceVariableRepresentedVariable',
    RV_V: 'reverseRepresentedVariableVariable',
    UDS_L: 'reverseUnitDataSetLineage'
  },
  SMART: 'smart'
};

const GRAPH_CONFIG = windowSize => ({
  nodeHighlightBehavior: false,
  linkHighlightBehavior: false,
  automaticRearrangeAfterDropNode: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: true,
  directed: false,
  node: {
    labelProperty: node => node.nodeLabelName === '' || node.nodeLabelName === '-' ? node.id : node.nodeLabelName,
    size: 300,
    fontSize: 16
  },
  link: {
    renderLabel: true,
    fontSize: 16,
    markerWidth: 8,
    markerHeight: 8,
    semanticStrokeWidth: true,
    color: daplaJsUtilities.SSB_COLORS.GREY
  },
  d3: {
    linkStrength: 2,
    gravity: -50,
    linkLength: 50
  },
  width: (windowSize * 0.75 * 0.96).toFixed(0),
  height: 800
});

const hash$1 = new ColorHash__default['default']({
  lightness: [0.35, 0.5, 0.65]
});
const variableSymbols = {
  dataset: 'diamond',
  instanceVariable: 'triangle',
  representedVariable: 'square',
  variable: 'circle'
};
const nodeGraphFromDataset = (id, data, language) => data.reduce((acc, cur) => {
  const lineage = {
    nodes: [{
      id: id,
      size: 1500,
      color: hash$1.hex(id),
      symbolType: variableSymbols.dataset,
      nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, cur[GSIM.UNIT_DATA_SET][GSIM.NAME]),
      nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, cur[GSIM.UNIT_DATA_SET][GSIM.DESCRIPTION])
    }],
    links: []
  };
  const lineageFields = daplaJsUtilities.getNestedObject(cur, MODEL.LINEAGE_FIELDS);

  if (lineageFields !== undefined && lineageFields.length !== 0) {
    lineageFields.forEach(lineageField => {
      lineage.nodes.push({
        size: 600,
        id: lineageField.id,
        color: hash$1.hex(lineageField.id),
        nodeLabelName: lineageField.name,
        nodeLabelDescription: '',
        symbolType: variableSymbols.instanceVariable
      });
      lineage.links.push({
        source: lineageField.id,
        target: id
      });
      lineageField.smartGraph.forEach(smartGraph => {
        lineage.links.push({
          source: smartGraph.fromId,
          target: smartGraph.toId
        });
      });
    });
    lineageFields.forEach(lineageField => {
      lineageField.smart.forEach(smart => {
        if (lineage.nodes.filter(node => node.id === smart.id).length === 0) {
          lineage.nodes.push({
            size: 300,
            id: smart.id,
            color: hash$1.hex(smart.id),
            nodeLabelName: smart.name,
            nodeLabelDescription: '',
            symbolType: variableSymbols.instanceVariable
          });
        }

        const representedVariable = daplaJsUtilities.getNestedObject(smart, [GSIM.INSTANCE_VARIABLE, GSIM.REPRESENTED_VARIABLE]);
        const variable = daplaJsUtilities.getNestedObject(smart, [GSIM.INSTANCE_VARIABLE, GSIM.REPRESENTED_VARIABLE, GSIM.VARIABLE]);

        if (representedVariable !== undefined) {
          if (lineage.nodes.filter(node => node.id === representedVariable.id).length === 0) {
            lineage.nodes.push({
              size: 600,
              id: representedVariable.id,
              color: hash$1.hex(representedVariable.id),
              symbolType: variableSymbols.representedVariable,
              nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, representedVariable[GSIM.NAME]),
              nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, representedVariable[GSIM.DESCRIPTION])
            });
          }

          lineage.links.push({
            source: representedVariable.id,
            target: smart.id
          });

          if (variable !== undefined) {
            if (lineage.nodes.filter(node => node.id === variable.id).length === 0) {
              lineage.nodes.push({
                size: 600,
                id: variable.id,
                color: hash$1.hex(variable.id),
                symbolType: variableSymbols.variable,
                nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, variable[GSIM.NAME]),
                nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, variable[GSIM.DESCRIPTION])
              });
              lineage.links.push({
                source: variable.id,
                target: representedVariable.id
              });
            }
          }
        }
      });
    });
    lineageFields.forEach(lineageField => {
      lineageField.smart.forEach(smart => {
        smart.lineageDataset.reverseUnitDataSetLineage.forEach(dataset => {
          if (lineage.nodes.filter(node => node.id === dataset.id).length === 0) {
            lineage.nodes.push({
              size: 300,
              id: dataset.id,
              color: hash$1.hex(dataset.id),
              symbolType: variableSymbols.dataset,
              nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, dataset[GSIM.NAME]),
              nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, dataset[GSIM.DESCRIPTION])
            });
          }

          lineage.links.push({
            source: dataset.id,
            target: smart.id
          });
        });
      });
    });
  }

  return lineage;
}, {});
const nodeGraphFromVariable = (id, data, type, language) => data.reduce((acc, cur) => {
  const lineage = {
    nodes: [],
    links: []
  };

  const setRusl = (lineageField, ruslId) => {
    if (lineageField.length !== 0) {
      lineageField.forEach(smart => {
        const smartSmart = daplaJsUtilities.getNestedObject(smart, MODEL.SMART);
        let documentedInDataset = false;
        let documentedInDatasetId;

        if (smart.hasOwnProperty('smartGraph') && smart.smartGraph.length === 1) {
          documentedInDatasetId = smart.smartGraph[0].fromId;
        } else {
          documentedInDatasetId = false;
        }

        if (smartSmart !== undefined && smartSmart.length !== 0) {
          smartSmart.forEach(lineageDataset => {
            const rudsl = daplaJsUtilities.getNestedObject(lineageDataset, MODEL.UNIT_DATA_SET);
            documentedInDataset = documentedInDatasetId && documentedInDatasetId === lineageDataset.id;

            if (rudsl !== undefined && rudsl.length !== 0) {
              rudsl.forEach(dataset => {
                lineage.nodes.push({
                  size: 300,
                  id: dataset.id,
                  color: hash$1.hex(dataset.id),
                  symbolType: variableSymbols.dataset,
                  fontWeight: documentedInDataset ? 'bold' : 'normal',
                  nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, dataset[GSIM.NAME]),
                  nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, dataset[GSIM.DESCRIPTION])
                });
                lineage.links.push({
                  source: ruslId,
                  target: dataset.id,
                  label: documentedInDataset ? '*' : ''
                });
              });
            }
          });
        }
      });
    }
  };

  const setLfr = (lineageFieldsRepresented, lfrId) => {
    if (lineageFieldsRepresented.length !== 0) {
      lineageFieldsRepresented.forEach(lineageFieldRepresented => {
        lineage.nodes.push({
          size: 600,
          id: lineageFieldRepresented.id,
          color: hash$1.hex(lineageFieldRepresented.id),
          symbolType: variableSymbols.instanceVariable,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, lineageFieldRepresented[GSIM.NAME]),
          nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, lineageFieldRepresented[GSIM.DESCRIPTION])
        });
        lineage.links.push({
          source: lfrId,
          target: lineageFieldRepresented.id
        });
        setRusl(lineageFieldRepresented[QUERY_HELPERS.REVERSE.LF_IV], lineageFieldRepresented.id);
      });
    }
  };

  const setLfv = (lineageFieldsVariable, lfvId) => {
    if (lineageFieldsVariable.length !== 0) {
      lineageFieldsVariable.forEach(lineageFieldVariable => {
        lineage.nodes.push({
          size: 600,
          id: lineageFieldVariable.id,
          color: hash$1.hex(lineageFieldVariable.id),
          symbolType: variableSymbols.representedVariable,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, lineageFieldVariable[GSIM.NAME]),
          nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, lineageFieldVariable[GSIM.DESCRIPTION])
        });
        lineage.links.push({
          source: lfvId,
          target: lineageFieldVariable.id
        });
        setLfr(lineageFieldVariable[QUERY_HELPERS.REVERSE.IV_RV], lineageFieldVariable.id);
      });
    }
  };

  switch (type) {
    case GSIM.INSTANCE_VARIABLE:
      const lineageFieldsInstance = cur[type][QUERY_HELPERS.REVERSE.LF_IV];
      setRusl(lineageFieldsInstance, id);

      if (cur[type].hasOwnProperty(GSIM.REPRESENTED_VARIABLE)) {
        const rv = cur[type][GSIM.REPRESENTED_VARIABLE];
        lineage.nodes.push({
          size: 600,
          id: rv.id,
          color: hash$1.hex(rv.id),
          symbolType: variableSymbols.representedVariable,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, rv[GSIM.NAME]),
          nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, rv[GSIM.DESCRIPTION])
        });
        lineage.links.push({
          source: rv.id,
          target: id
        });

        if (rv.hasOwnProperty(GSIM.VARIABLE)) {
          const rvV = rv[GSIM.VARIABLE];
          lineage.nodes.push({
            size: 600,
            id: rvV.id,
            color: hash$1.hex(rvV.id),
            symbolType: variableSymbols.variable,
            nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, rvV[GSIM.NAME]),
            nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, rvV[GSIM.DESCRIPTION])
          });
          lineage.links.push({
            source: rvV.id,
            target: rv.id
          });
        }
      }

      break;

    case GSIM.REPRESENTED_VARIABLE:
      const lineageFieldsRepresented = cur[type][QUERY_HELPERS.REVERSE.IV_RV];
      setLfr(lineageFieldsRepresented, id);

      if (cur[type].hasOwnProperty(GSIM.VARIABLE)) {
        const rvV = cur[type][GSIM.VARIABLE];
        lineage.nodes.push({
          size: 600,
          id: rvV.id,
          color: hash$1.hex(rvV.id),
          symbolType: variableSymbols.variable,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, rvV[GSIM.NAME]),
          nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, rvV[GSIM.DESCRIPTION])
        });
        lineage.links.push({
          source: rvV.id,
          target: id
        });
      }

      break;

    case GSIM.VARIABLE:
      const lineageFieldsVariable = cur[type][QUERY_HELPERS.REVERSE.RV_V];
      setLfv(lineageFieldsVariable, id);
      break;
  }

  return lineage;
}, {});

const UI = {
  API_ERROR_MESSAGE: {
    en: 'Something went wrong, check settings',
    nb: 'Noe gikk galt, sjekk innstillingene'
  },
  HEADER: {
    en: 'Lineage Viewer',
    nb: 'Sporingsvisning'
  },
  LEGEND: ['variable', '', 'dataset', 'representedVariable', '', 'instanceVariable'],
  LINEAGE_FOR: {
    en: 'Lineage for',
    nb: 'Sporing av'
  }
};

const hash = new ColorHash__default['default']({
  lightness: [0.35, 0.5, 0.65]
});

function LineageView({
  dataId,
  dataType,
  language
}) {
  const [nodes, setNodes] = React.useState(false);
  const [clickedNode, setClickedNode] = React.useState(false);
  const [graphConfig] = React.useState(GRAPH_CONFIG(window.screen.width));
  const [fetchResults, {
    loading,
    error,
    data
  }] = graphqlHooks.useManualQuery(dataType !== 'dataset' ? DATASETS_FROM_LINEAGE(dataType) : VARIABLES_FROM_LINEAGE, {
    variables: {
      id: dataId
    }
  });
  React.useEffect(() => {
    fetchResults().then(() => null);
  }, [fetchResults]);
  React.useMemo(() => {
    if (!loading && !error && data !== undefined) {
      if (dataType !== 'dataset') {
        const nodesFrom = nodeGraphFromVariable(dataId, data, dataType, language);
        const graphNodes = {
          nodes: nodesFrom.nodes.concat([{
            size: 1500,
            id: dataId,
            color: hash.hex(dataId),
            symbolType: variableSymbols[dataType],
            nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, data[0][dataType][GSIM.NAME]),
            nodeLabelDescription: daplaJsUtilities.getLocalizedGsimObjectText(language, data[0][dataType][GSIM.DESCRIPTION])
          }]).filter((node, index, a) => a.findIndex(t => t.id === node.id) === index),
          links: nodesFrom.links
        };
        setNodes(graphNodes);
      } else {
        const nodesFrom = nodeGraphFromDataset(dataId, data, language);
        setNodes(nodesFrom);
      }
    }
  }, [loading, error, data, dataId, dataType, language]);

  const onMouseOverNode = nodeId => setClickedNode(nodes.nodes.filter(node => node.id === nodeId)[0]);

  const onMouseOutNode = () => setClickedNode(false);

  if (nodes) {
    return /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
      width: 12
    }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Segment, {
      raised: true
    }, /*#__PURE__*/React__default['default'].createElement(reactD3Graph.Graph, {
      id: "graph-id",
      data: nodes,
      config: graphConfig,
      onMouseOverNode: onMouseOverNode,
      onMouseOutNode: onMouseOutNode
    }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Rail, {
      attached: true,
      internal: true,
      position: "right",
      style: {
        height: '30%'
      }
    }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Segment, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid, null, [5, 3, 0, 2].map(thing => /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Row, {
      key: thing,
      style: {
        paddingTop: '0.5rem',
        paddingBottom: '0.5rem'
      }
    }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
      width: 2
    }, /*#__PURE__*/React__default['default'].createElement("svg", {
      width: "30",
      height: "30",
      version: "1.1",
      xmlns: "http://www.w3.org/2000/svg"
    }, /*#__PURE__*/React__default['default'].createElement("path", {
      transform: "translate(15, 15)",
      style: {
        fill: daplaJsUtilities.SSB_COLORS.GREY
      },
      d: d3Shape.symbol(d3Shape.symbols[thing], 300)()
    }))), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
      width: 14,
      verticalAlign: "middle"
    }, `= ${UI.LEGEND[thing]}`)))))))), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
      width: 4
    }, clickedNode && /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Segment, {
      raised: true
    }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.List, {
      relaxed: "very"
    }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.List.Item, {
      header: "Id",
      description: clickedNode.id
    }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.List.Item, {
      header: "Name",
      description: clickedNode.nodeLabelName
    }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.List.Item, {
      header: "Description",
      description: clickedNode.nodeLabelDescription
    })))));
  } else {
    return null;
  }
}

const options = MODEL.VARIABLE_TYPES.map(type => ({
  key: type,
  text: type,
  value: type
})).concat([{
  key: 'dataset',
  text: 'dataset',
  value: 'dataset'
}]);

function AppHome({
  restApi,
  language
}) {
  const [apiReady, setApiReady] = React.useState(false);
  const [dataId, setDataId] = React.useState('Variable_DUMMY');
  const [dataType, setDataType] = React.useState(MODEL.VARIABLE_TYPES[2]);
  const [{
    loading,
    error
  }] = useAxios__default['default'](`${restApi}${API.GET_HEALTH}`, {
    useCache: false
  });
  React.useEffect(() => {
    if (!loading && !error) {
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      const type = urlParams.get('type');

      if (id && type !== null) {
        setDataId(id);
        setDataType(type);
      }

      setApiReady(true);
    } else {
      setApiReady(false);
    }
  }, [error, loading]);
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, loading ? /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Loader, {
    active: true,
    inline: "centered"
  }) : error ? /*#__PURE__*/React__default['default'].createElement(daplaJsUtilities.ErrorMessage, {
    error: UI.API_ERROR_MESSAGE[language],
    language: language
  }) : apiReady && /*#__PURE__*/React__default['default'].createElement(LineageView, {
    dataId: dataId,
    dataType: dataType,
    language: language
  }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Divider, {
    hidden: true
  }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
    width: 3
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Input, {
    fluid: true,
    value: dataId,
    onFocus: e => e.target.select(),
    onKeyPress: ({
      key
    }) => key === 'Enter' && setApiReady(true),
    onChange: (e, {
      value
    }) => {
      setApiReady(false);
      setDataId(value);
    }
  })), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
    width: 13
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Dropdown, {
    selection: true,
    value: dataType,
    options: options,
    onChange: (e, {
      value
    }) => {
      setApiReady(false);
      setDataType(value);
    }
  }))));
}

exports.LineageViewer = AppHome;
