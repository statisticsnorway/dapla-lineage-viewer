export const GRAPH_CONFIG = windowSize => ({
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
    highlightColor: 'lightblue',
  },
  d3: {
    gravity: -1500,
    linkLength: 200
  },
  width: ((windowSize * 0.75) * 0.96).toFixed(0),
  height: 600
})
