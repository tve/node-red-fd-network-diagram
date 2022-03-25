<!-- Network Diagram widget for FlexDash
     Copyright ©2022 Someone, MIT license, see LICENSE file
-->
<template>
  <div class="px-1 width100 flex-grow-1 flex-shrink-1" ref="netdiag">
    <div class="width100"></div>
  </div>
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

  full_page: true, // allow widget to be expanded full-page

  created() {
    this.network = null // non-reactive, see https://github.com/almende/vis/issues/2524
    this.ro = new ResizeObserver(() => this.onResize()) // resize-observer is non-reactive
  },

  computed: {
    nodeDataSet() { return new DataSet(Object.values(this.nodes)) },
    edgeDataSet() { return new DataSet(Object.values(this.edges)) },
    dataSet() { return { nodes: this.nodeDataSet, edges: this.edgeDataSet } },
  },

  mounted() { this.update(this.dataSet, null) },

  watch: {
    // when the dataSet changes cause a display update
    dataSet(newDataSet, oldDataSet) { this.update(newDataSet, oldDataSet) },
  },

  beforeDestroy() {
    if (this.ro) this.ro.disconnect()
    this.ro = null
    if (this.network) this.network.destroy()
    this.network = null
  },

  methods: {
    onResize() {
      const el = this.$refs.netdiag
      if (this.network) {
        console.log("resize", el.clientWidth, el.clientHeight)
        this.network.setSize(el.clientWidth, el.clientHeight)
        this.network.fit()
        //doesn't seem to make a difference: this.network.redraw()
      }
    },

    observeSize() {
      if (this.ro) this.ro.disconnect()
      this.ro.observe(this.$refs.netdiag)
    },

    update(newDataSet, oldDataSet) {
        console.log("Displaying network:", Object.keys(this.nodes), Object.keys(this.edges))
        if (this.network) this.network.destroy()
        this.network = new Network(this.$refs.netdiag, newDataSet, this.options)
        this.$nextTick(() => this.observeSize())
    },
  },

}
</script>

<style scoped>
.network-diagram { height: 100%; }
</style>
