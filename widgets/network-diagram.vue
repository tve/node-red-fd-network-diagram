<!-- Network Diagram widget for FlexDash
     Copyright ©2022 Someone, MIT license, see LICENSE file
-->
<template>
  <div class="network-diagram" ref="netdiag"></div>
</template>

<script scoped>
import { DataSet, Network } from "vis-network/standalone/index.js";

export default {
  name: "NetworkDiagram",

  help: `Computer network diagram.
Displays a computer network diagram... Send it some JSON and it does magic...`,

  props: {
    nodes: {
      type: Object,
      tip: "map of nodes each with id: { id:.., label:.. }",
      default() { return {
        1: { id: 1, label: "Node 1" },
        2: { id: 2, label: "Node 2" },
        3: { id: 3, label: "Node 3" },
      } },
    },
    edges: {
      type: Object,
      tip: "map of edges, each with id: { id:.., from:.., to:.. }",
      default() { return {
        1001: { id: 1001, from: 1, to: 3 },
        1002: { id: 1002, from: 1, to: 2 }, 
      } },
    },
    options: {
      type: Object,
      default() { return {
        nodes: {
          shape: "box",
          size: 10,
          font: { size: 12, face: "monospace", },
        },
        edges: {
          width: 2,
          color: { inherit: "from", },
        },
        physics: {
          enabled: false,
        },
      } },
    },
  },

  data() { return {
    network: null,
  } },

  computed: {
    nodeDataSet() { return new DataSet(Object.values(this.nodes)) },
    edgeDataSet() { return new DataSet(Object.values(this.edges)) },
    dataSet() { return { nodes: this.nodeDataSet, edges: this.edgeDataSet } },
  },

  watch: {
    dataSet() { this.update() },
  },
  mounted() { this.update() },
  methods: {
    update() {
      console.log("Displaying network:", Object.keys(this.nodes), Object.keys(this.edges))
      this.network = new Network(this.$refs.netdiag, this.dataSet, this.options)
      this.$nextTick(() => this.network.redraw())
    },
  },
}
</script>

<style scoped>
.network-diagram { height: 100%; }
</style>
