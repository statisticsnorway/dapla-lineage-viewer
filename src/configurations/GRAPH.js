import { SSB_COLORS } from '@statisticsnorway/dapla-js-utilities'

export const GRAPH_CONFIG = windowSize => ({
  nodeHighlightBehavior: false,
  linkHighlightBehavior: false,
  automaticRearrangeAfterDropNode: false,
  staticGraph: false,
  staticGraphWithDragAndDrop: true,
  directed: false,
  node: {
    labelProperty: node => node.nodeLabelName === '' || node.nodeLabelName === '-' ? node.id : node.nodeLabelName,
    size: 300,
    fontSize: 16,
  },
  link: {
    renderLabel: true,
    fontSize: 16,
    markerWidth: 8,
    markerHeight: 8,
    semanticStrokeWidth: true,
    color: SSB_COLORS.GREY
  },
  d3: {
    linkStrength: 2,
    gravity: -50,
    linkLength: 50
  },
  width: ((windowSize * 0.75) * 0.96).toFixed(0),
  height: 800
})
