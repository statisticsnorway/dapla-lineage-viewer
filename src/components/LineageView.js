import React, { useEffect, useMemo, useState } from 'react'
import { useManualQuery } from 'graphql-hooks'
import { Graph } from 'react-d3-graph'
import { symbol, symbols } from 'd3-shape'
import { Grid, List, Rail, Segment } from 'semantic-ui-react'
import { getLocalizedGsimObjectText, SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'
import ColorHash from 'color-hash'

import { DATASETS_FROM_LINEAGE, VARIABLES_FROM_LINEAGE } from '../queries'
import { nodeGraphFromDataset, nodeGraphFromVariable, variableSymbols } from '../utilities'
import { GRAPH_CONFIG, GSIM } from '../configurations'
import { UI } from '../enums'

const hash = new ColorHash({ lightness: [0.35, 0.5, 0.65] })

function LineageView ({ dataId, dataType, language }) {
  const [nodes, setNodes] = useState(false)
  const [clickedNode, setClickedNode] = useState(false)
  const [graphConfig] = useState(GRAPH_CONFIG(window.screen.width))

  const [fetchResults, { loading, error, data }] = useManualQuery(dataType !== 'dataset' ?
    DATASETS_FROM_LINEAGE(dataType) : VARIABLES_FROM_LINEAGE, { variables: { id: dataId } }
  )

  useEffect(() => {
    fetchResults().then(() => null)
  }, [fetchResults])

  useMemo(() => {
    if (!loading && !error && data !== undefined) {
      if (dataType !== 'dataset') {
        const nodesFrom = nodeGraphFromVariable(dataId, data, dataType, language)

        const graphNodes = {
          nodes: nodesFrom.nodes.concat([{
            size: 1500,
            id: dataId,
            color: hash.hex(dataId),
            symbolType: variableSymbols[dataType],
            nodeLabelName: getLocalizedGsimObjectText(language, data[0][dataType][GSIM.NAME]),
            nodeLabelDescription: getLocalizedGsimObjectText(language, data[0][dataType][GSIM.DESCRIPTION]),
          }]).filter((node, index, a) => a.findIndex(t => (t.id === node.id)) === index),
          links: nodesFrom.links
        }

        setNodes(graphNodes)
      } else {
        const nodesFrom = nodeGraphFromDataset(dataId, data, language)

        setNodes(nodesFrom)
      }
    }
  }, [loading, error, data, dataId, dataType, language])

  const onMouseOverNode = nodeId => setClickedNode(nodes.nodes.filter(node => node.id === nodeId)[0])
  const onMouseOutNode = () => setClickedNode(false)

  if (nodes) {
    return (
      <Grid>
        <Grid.Column width={12}>
          <Segment raised>
            <Graph id='graph-id' data={nodes} config={graphConfig} onMouseOverNode={onMouseOverNode}
                   onMouseOutNode={onMouseOutNode} />
            <Rail attached internal position='right' style={{ height: '30%' }}>
              <Segment>
                <Grid>
                  {[5, 3, 0, 2].map(thing =>
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
          {clickedNode &&
          <Segment raised>
            <List relaxed='very'>
              <List.Item
                header='Id'
                description={clickedNode.id}
              />
              <List.Item
                header='Name'
                description={clickedNode.nodeLabelName}
              />
              <List.Item
                header='Description'
                description={clickedNode.nodeLabelDescription}
              />
            </List>
          </Segment>
          }
        </Grid.Column>
      </Grid>
    )
  } else {
    return null
  }
}

export default LineageView
