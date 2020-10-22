import React, { useEffect, useState } from 'react'
import { useManualQuery } from 'graphql-hooks'
import { Graph } from 'react-d3-graph'
import { symbol, symbols } from 'd3-shape'
import { Grid, Header, Rail, Segment } from 'semantic-ui-react'
import { getLocalizedGsimObjectText, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'
import ColorHash from 'color-hash'

import { DATASETS_FROM_LINEAGE, VARIABLES_FROM_LINEAGE } from '../queries'
import { nodeGraphFromDataset, nodeGraphFromVariable, variableSymbols } from '../utilities'
import { GRAPH_CONFIG, GSIM } from '../configurations'
import { UI } from '../enums'

const hash = new ColorHash({ lightness: [0.35, 0.5, 0.65] })

function LineageView ({ dataId, dataType, language }) {
  const [nodes, setNodes] = useState(false)
  const [clickedNode, setClickedNode] = useState('')
  const [graphConfig] = useState(GRAPH_CONFIG(window.screen.width))

  const [fetchResults, { loading, error, data }] = useManualQuery(dataType !== 'dataset' ?
    DATASETS_FROM_LINEAGE(dataType) : VARIABLES_FROM_LINEAGE, { variables: { id: dataId } }
  )

  useEffect(() => {
    fetchResults().then(() => null)
  }, [fetchResults])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      if (dataType !== 'dataset') {
        const nodesFrom = nodeGraphFromVariable(dataId, data, dataType, language)

        const graphNodes = {
          nodes: nodesFrom.nodes.concat([{
            id: dataId,
            nodeLabelName: getLocalizedGsimObjectText(language, data[0][dataType][GSIM.NAME]),
            color: hash.hex(dataId),
            size: 1000,
            fontSize: 20,
            highlightFontSize: 20,
            symbolType: variableSymbols[dataType]
          }]).filter((node, index, a) => a.findIndex(t => (t.id === node.id)) === index),
          links: nodesFrom.links
        }

        setNodes(graphNodes)
      } else {
        console.log(data)

        const nodesFrom = nodeGraphFromDataset(dataId, data, language)

        const graphNodes = {
          nodes: nodesFrom.nodes.concat([{
            id: dataId,
            nodeLabelName: getLocalizedGsimObjectText(language, data[0].unitDataSet.name),
            color: hash.hex(dataId),
            size: 1000,
            fontSize: 20,
            highlightFontSize: 20,
            symbolType: variableSymbols.dataset
          }]).filter((node, index, a) => a.findIndex(t => (t.id === node.id)) === index),
          links: nodesFrom.links
        }

        setNodes(graphNodes)
        console.log(nodesFrom)
      }
    }
  }, [loading, error, data, dataId, dataType, language])

  const onClickNode = nodeId => setClickedNode(nodeId)

  return (
    <>
      <Header content={`Sporing av ${dataId} (${dataType})`} />
      {nodes &&
      <Grid>
        <Grid.Column width={12}>
          <Segment raised>
            <Graph id='graph-id' data={nodes} config={graphConfig} onClickNode={onClickNode} />
            <Rail attached internal position='right' style={{ height: '30%' }}>
              <Segment>
                <Grid>
                  {[4, 2, 0, 3].map(thing =>
                    <Grid.Row key={thing} style={{ paddingTop: '0.5rem', paddingBottom: '0.5rem' }}>
                      <Grid.Column width={2}>
                        <svg width='30' height='30' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                          <path
                            transform='translate(15, 15)'
                            style={{ fill: SSB_COLORS.GREY }}
                            d={symbol(symbols[thing], 300)()}
                          />
                        </svg>
                      </Grid.Column>
                      <Grid.Column width={14} verticalAlign='middle'>
                        {`= ${UI.LEGEND[thing]}`}
                      </Grid.Column>
                    </Grid.Row>
                  )}
                </Grid>
              </Segment>
            </Rail>
          </Segment>
        </Grid.Column>
        <Grid.Column width={4}>
          <Segment raised>
            {`Clicked node: ${clickedNode}`}
          </Segment>
        </Grid.Column>
      </Grid>
      }
    </>

  )
}

export default LineageView
