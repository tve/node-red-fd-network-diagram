<!-- Network Diagram widget for FlexDash
     Copyright ©2022 Someone, MIT license, see LICENSE file
-->
<!-- The template is really trivial: all we need is a div into which vis-network can put its canvas.
     There is some magic necessary so the div fills the whole widget. It's in a flex-column
     container so we want it to grow/shrink to match the container height. We also want it to be
     100% width and we add a couple of pixels of padding left and right. Finally,
     overflow-hidden is important so the element size calculation is correct in onResize.
     All this is accomplished by the classes, which are from Vuetify.
     The same could be achieved by using straight CSS.
     We give the div a "ref", which is a unique ID, so we can get a handle to the DOM element
     in the code, basically like an "id=<something>" attribute.
-->
<template>
  <div class="px-1 width100 flex-grow-1 flex-shrink-1 overflow-hidden" ref="netdiag">
  </div>
</template>

<script scoped>
// import the two functions we need from the vis-network ESM library
import { DataSet, Network } from "vis-network/standalone/index.js";

export default {
  name: "NetworkDiagram", // the name of this widget in camel case

  // FlexDash thing: help text to show in the add-widget drop-down in FD
  help: `Computer network diagram.
Displays a computer network diagram... Send it some JSON and it does magic...`,

  // Props are the inputs to the widget. They are all reactive, meaning that whatever
  // reads them gets re-executed when they change. The tip is a FlexDash thing, not vue.
  props: {
    nodes: {
      type: Object,
      tip: "map of nodes each with id: { id:.., label:.. }",
      default() { return { } },
    },
    edges: {
      type: Object,
      tip: "map of edges, each with id: { id:.., from:.., to:.. }",
      default() { return { } },
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

  full_page: true, // allow widget to be expanded full-page, a FD thing...

  // computed values are variables that get automatically recomputed when their inputs change,
  // all we need to specify is how to compute them in the form of a function.
  // Here we will end up with this.nodeDataSet, this.edgeDataSet, and this.dataSet that look
  // like plain variables elsewhere in the code. Vue figures out automatically what each of these
  // depend on and thus when they need to be recomputed.
  computed: {
    nodeDataSet() { return new DataSet(Object.values(this.nodes||[])) },
    edgeDataSet() { return new DataSet(Object.values(this.edges||[])) },
    dataSet() { return { nodes: this.nodeDataSet, edges: this.edgeDataSet } },
  },

  // created is called by Vue when the component is instantiated, before it's template
  // is rendered into the DOM. It's usually to do stuff that doesn't fit the reactive
  // paradigm...
  created() {
    this.network = null // non-reactive, see https://github.com/almende/vis/issues/2524  
    this.ro = new ResizeObserver(() => this.onResize()) // ro is non-reactive
  },

  // mounted is called after created when the template has been rendered into the DOM.
  // At this point we can do a first render of the vis-network, which will also register
  // the resize observer
  mounted() { this.update(this.dataSet, null) },

  // watches observe some variable and trigger a function when it changes. They're typically
  // used to trigger non-reactive code. Here, when the dataSet changes we need to trigger
  // a re-render of the vis-network.
  watch: {
    // when the dataSet changes cause a display update
    dataSet(newDataSet, oldDataSet) { this.update(newDataSet, oldDataSet) },
  },

  // beforeDestroy is called just before the component is destroyed. It's a good place to
  // do some clean-up.
  beforeDestroy() {
    if (this.ro) this.ro.disconnect()
    this.ro = null
    if (this.network) this.network.destroy()
    this.network = null
  },

  // method are just simple method on the components that can be called from anywhere and have
  // 'this' bound correctly.
  methods: {
    // onResize is called bythe resize observer and gets vis-network to adapt the canvas size
    onResize() {
      const el = this.$refs.netdiag // $refs.netdiag is the $el of the div with ref="netdiag"
      if (this.network) {
        // Figure out the size the canvas should have. The div el must have overflow:hidden,
        // otherwise once the canvas is larger the clientHeight will not reduce anymore.
        const x_padding = 8 // class px-1
        console.log("resize", el.clientWidth-x_padding, el.clientHeight)
        this.network.setSize(el.clientWidth-x_padding, el.clientHeight)
        this.network.fit()
        //doesn't seem to make a difference: this.network.redraw()
      }
    },

    // observeSize restarts the resize-observer
    observeSize() {
      if (this.ro) this.ro.disconnect()
      this.ro.observe(this.$refs.netdiag)
    },

    // update calls vis-network to update the canvas
    update(newDataSet, oldDataSet) {
        console.log("Displaying network:", JSON.stringify(this.nodes), Object.keys(this.edges))
        if (this.network) this.network.destroy()
        this.network = new Network(this.$refs.netdiag, newDataSet, this.options)
        // register the resize observer a tick later so everything is rendered
        this.$nextTick(() => this.observeSize())
    },
  },

}
</script>

<style scoped> /* scoped means that any CSS only applies to this component */
/* .network-diagram { height: 100%; } */
</style>
