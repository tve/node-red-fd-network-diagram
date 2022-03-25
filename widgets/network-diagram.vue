<!-- Network Diagram widget for FlexDash
     Copyright ©2022 Someone, MIT license, see LICENSE file
-->
<template>
  <div class="network-diagram" ref="netdiag"></div>
</template>

<script scoped>
import { DataSet, Network } from 'vis-network/standalone/index.js'

export default {
  name: 'NetworkDiagram',

  help: `Computer network diagram.
Displays a computer network diagram... Send it some JSON and it does magic...`,

  props: {
    nodes: { type: Array, default() { return [
      { id: 1, label: "Node 1" },
      { id: 2, label: "Node 2" },
      { id: 3, label: "Node 3" },
      { id: 4, label: "Node 4" },
      { id: 5, label: "Node 5" },
    ] } },
    edges: { type: Array, default() { return [
      { from: 1, to: 3 },
      { from: 1, to: 2 },
      { from: 2, to: 4 },
      { from: 2, to: 5 },
      { from: 3, to: 3 },
    ] } },
    options: { type: Object, default() { return {
      nodes: {
        shape: 'box',
        size: 10,
        font: {
          size: 12,
          face: 'monospace',
        },
      },
      edges: {
        width: 2,
        color: {
          inherit: 'from',
        },
      },
      physics: {
        enabled: false,
      },
    } } },
  },

  computed: {
    nodeDataSet() { return new DataSet(this.nodes) },
    edgeDataSet() { return new DataSet(this.edges) },
    dataSet() { return { nodes: this.nodeDataSet, edges: this.edgeDataSet } },
  },

  watch: { dataSet() { this.update() } },
  mounted() { this.update() },
  methods: {
    update() {
      console.log("Displaying network:", this.nodes, this.edges)
      return new Network(this.$refs.netdiag, this.dataSet, this.options)
    },
  },

}
</script>

<style scoped>
.network-diagram { height: 100%; }
</style>
