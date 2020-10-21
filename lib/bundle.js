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
};
const DATASETS_FROM_LINEAGE = variableType => fromVariableType[variableType];

const API = {
  GET_HEALTH: '/health/ready',
  GRAPHQL: '/graphql'
};
const GSIM = {
  INSTANCE_VARIABLE: 'instanceVariable',
  REPRESENTED_VARIABLE: 'representedVariable',
  VARIABLE: 'variable',
  NAME: 'name'
};
const MODEL = {
  DATASET_TYPES: ['unitDataSet'],
  VARIABLE_TYPES: ['instanceVariable', 'representedVariable', 'variable'],
  SMART: ['smart'],
  UNIT_DATA_SET: ['lineageDataset', 'reverseUnitDataSetLineage']
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
  nodeHighlightBehavior: true,
  automaticRearrangeAfterDropNode: false,
  staticGraph: false,
  node: {
    labelProperty: node => node.nodeLabelName === '' || node.nodeLabelName === '-' ? node.id : node.nodeLabelName,
    size: 300,
    highlightStrokeColor: 'blue',
    fontSize: 14,
    highlightFontSize: 14,
    highlightFontWeight: 'bold'
  },
  link: {
    highlightColor: 'lightblue'
  },
  d3: {
    gravity: -1500,
    linkLength: 200
  },
  width: (windowSize * 0.75 * 0.96).toFixed(0),
  height: 600
});

const hash = new ColorHash__default['default']({
  lightness: [0.35, 0.5, 0.65]
});
const variableSymbols = {
  dataset: 'square',
  instanceVariable: 'circle',
  representedVariable: 'diamond',
  variable: 'star'
};
const nodeGraphFromVariable = (id, data, type, language) => data.reduce((acc, cur) => {
  const lineage = {
    nodes: [],
    links: []
  };

  const setRusl = (lineageField, ruslId) => {
    if (lineageField.length !== 0) {
      lineageField.forEach(smart => {
        const smartSmart = daplaJsUtilities.getNestedObject(smart, MODEL.SMART);

        if (smartSmart !== undefined && smartSmart.length !== 0) {
          smartSmart.forEach(lineageDataset => {
            const rudsl = daplaJsUtilities.getNestedObject(lineageDataset, MODEL.UNIT_DATA_SET);

            if (rudsl !== undefined && rudsl.length !== 0) {
              rudsl.forEach(unitDataSet => {
                lineage.nodes.push({
                  id: unitDataSet.id,
                  nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, unitDataSet[GSIM.NAME]),
                  color: hash.hex(unitDataSet.id),
                  symbolType: variableSymbols.dataset
                });
                lineage.links.push({
                  source: ruslId,
                  target: unitDataSet.id
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
          id: lineageFieldRepresented.id,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, lineageFieldRepresented[GSIM.NAME]),
          color: hash.hex(lineageFieldRepresented.id),
          symbolType: variableSymbols.instanceVariable
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
          id: lineageFieldVariable.id,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, lineageFieldVariable[GSIM.NAME]),
          color: hash.hex(lineageFieldVariable.id),
          symbolType: variableSymbols.representedVariable
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
      break;

    case GSIM.REPRESENTED_VARIABLE:
      const lineageFieldsRepresented = cur[type][QUERY_HELPERS.REVERSE.IV_RV];
      setLfr(lineageFieldsRepresented, id);
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
  LEGEND: ['instanceVariable', '', 'representedVariable', 'dataset', 'variable']
};

const hash$1 = new ColorHash__default['default']({
  lightness: [0.35, 0.5, 0.65]
});

function LineageView({
  language,
  variableId,
  variableType
}) {
  const [nodes, setNodes] = React.useState(false);
  const [clickedNode, setClickedNode] = React.useState('');
  const [graphConfig] = React.useState(GRAPH_CONFIG(window.screen.width));
  const [fetchResults, {
    loading,
    error,
    data
  }] = graphqlHooks.useManualQuery(DATASETS_FROM_LINEAGE(variableType), {
    variables: {
      id: variableId
    }
  });
  React.useEffect(() => {
    fetchResults().then(() => null);
  }, [fetchResults]);
  React.useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const nodesFrom = nodeGraphFromVariable(variableId, data, variableType, language);
      const graphNodes = {
        nodes: nodesFrom.nodes.concat([{
          id: variableId,
          nodeLabelName: daplaJsUtilities.getLocalizedGsimObjectText(language, data[0][variableType][GSIM.NAME]),
          color: hash$1.hex(variableId),
          size: 600,
          fontSize: 20,
          highlightFontSize: 20,
          symbolType: variableSymbols[variableType]
        }]).filter((node, index, a) => a.findIndex(t => t.id === node.id) === index),
        links: nodesFrom.links
      };
      setNodes(graphNodes);
    }
  }, [loading, error, data, variableId, variableType, language]);

  const onClickNode = nodeId => setClickedNode(nodeId);

  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Header, {
    content: `Sporing av ${variableId}`
  }), nodes && /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
    width: 12
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Segment, {
    raised: true
  }, /*#__PURE__*/React__default['default'].createElement(reactD3Graph.Graph, {
    id: "graph-id",
    data: nodes,
    config: graphConfig,
    onClickNode: onClickNode
  }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Rail, {
    attached: true,
    internal: true,
    position: "right"
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Segment, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid, null, [4, 2, 0, 3].map(thing => /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Row, {
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
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Segment, {
    raised: true
  }, `Clicked node: ${clickedNode}`))));
}

function AppHome({
  restApi,
  language
}) {
  const [apiReady, setApiReady] = React.useState(false);
  const [variableId, setVariableId] = React.useState('Variable_DUMMY');
  const [variableType, setVariableType] = React.useState(MODEL.VARIABLE_TYPES[2]);
  const [{
    loading,
    error
  }] = useAxios__default['default'](`${restApi}${API.GET_HEALTH}`, {
    useCache: false
  });
  React.useEffect(() => {
    if (!loading && !error) {
      setApiReady(true);
      const queryString = window.location.search;
      const urlParams = new URLSearchParams(queryString);
      const id = urlParams.get('id');
      const type = urlParams.get('type');

      if (id && type !== null) {
        setVariableId(id);
        setVariableType(type);
      }
    } else {
      setApiReady(false);
    }
  }, [error, loading]);
  return /*#__PURE__*/React__default['default'].createElement(React__default['default'].Fragment, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid, null, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
    width: 3
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Input, {
    fluid: true,
    value: variableId,
    onFocus: e => e.target.select(),
    onKeyPress: ({
      key
    }) => key === 'Enter' && setApiReady(true),
    onChange: (e, {
      value
    }) => {
      setApiReady(false);
      setVariableId(value);
    }
  })), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Grid.Column, {
    width: 13
  }, /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Dropdown, {
    selection: true,
    value: variableType,
    options: MODEL.VARIABLE_TYPES.map(type => ({
      key: type,
      text: type,
      value: type
    })),
    onChange: (e, {
      value
    }) => {
      setApiReady(false);
      setVariableType(value);
    }
  }))), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Divider, {
    hidden: true
  }), /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Button, {
    primary: true,
    content: "Go",
    onClick: () => setApiReady(true)
  }), loading ? /*#__PURE__*/React__default['default'].createElement(semanticUiReact.Loader, {
    active: true,
    inline: "centered"
  }) : error ? /*#__PURE__*/React__default['default'].createElement(daplaJsUtilities.ErrorMessage, {
    error: UI.API_ERROR_MESSAGE[language],
    language: language
  }) : apiReady && /*#__PURE__*/React__default['default'].createElement(LineageView, {
    language: language,
    variableId: variableId,
    variableType: variableType
  }));
}

exports.LineageViewer = AppHome;
