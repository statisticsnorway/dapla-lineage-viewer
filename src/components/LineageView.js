import React, { useEffect, useState } from 'react'
import { useManualQuery } from 'graphql-hooks'
import { Graph } from 'react-d3-graph'
import { symbol, symbols } from 'd3-shape'
import { Grid, Header, Rail, Segment } from 'semantic-ui-react'
import { getLocalizedGsimObjectText, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'
import ColorHash from 'color-hash'

import { DATASETS_FROM_LINEAGE } from '../queries'
import { nodeGraphFromVariable, variableSymbols } from '../utilities'
import { GRAPH_CONFIG, GSIM } from '../configurations'
import { UI } from '../enums'

const hash = new ColorHash({ lightness: [0.35, 0.5, 0.65] })

function LineageView ({ language, variableId, variableType }) {
  const [nodes, setNodes] = useState(false)
  const [clickedNode, setClickedNode] = useState('')
  const [graphConfig] = useState(GRAPH_CONFIG(window.screen.width))

  const [fetchResults, { loading, error, data }] = useManualQuery(DATASETS_FROM_LINEAGE(variableType), { variables: { id: variableId } })

  useEffect(() => {
    fetchResults().then(() => null)
  }, [fetchResults])

  useEffect(() => {
    if (!loading && !error && data !== undefined) {
      const nodesFrom = nodeGraphFromVariable(variableId, data, variableType, language)

      const graphNodes = {
        nodes: nodesFrom.nodes.concat([{
          id: variableId,
          nodeLabelName: getLocalizedGsimObjectText(language, data[0][variableType][GSIM.NAME]),
          color: hash.hex(variableId),
          size: 600,
          fontSize: 20,
          highlightFontSize: 20,
          symbolType: variableSymbols[variableType]
        }]).filter((node, index, a) => a.findIndex(t => (t.id === node.id)) === index),
        links: nodesFrom.links
      }

      setNodes(graphNodes)
    }
  }, [loading, error, data, variableId, variableType, language])

  const onClickNode = nodeId => setClickedNode(nodeId)

  return (
    <>
      <Header content={`Sporing av ${variableId}`} />
      {nodes &&
      <Grid>
        <Grid.Column width={12}>
          <Segment raised>
            <Graph id='graph-id' data={nodes} config={graphConfig} onClickNode={onClickNode} />
            <Rail attached internal position='right'>
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
