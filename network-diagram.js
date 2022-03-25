// Node-RED Network Diagram Node - this code runs in Node-RED

module.exports = function (RED) {

  // Instantiate the Node-RED node, 'this' is the node being constructed
  // and config contains the values set by the user in the flow editor.
  function NetworkDiagram(config) {
    const fd = RED.nodes.getNode(config.fd) // get a handle onto FlexDash
    RED.nodes.createNode(this, config)
    if (!fd) return // not much we can do, wait for the next deploy...

    // WARNING: this is a preliminary version of this node that updates all props of the widget
    // at every change. This is not efficient, but more granular set/delete needs a bit more
    // infrastrtucture work...
    //
    // Initialize the state of this node, specifically, we need to keep track of nodes, edges,
    // zoom value, and a few more things so we can process add/remove operations locally and
    // then update the FD state.
    // The vis-network package expects arrays of nodes/edges, but we keep maps indexed
    // by id to make insertion/deletion easier and to avoid duplicates.
    this.state = {
      // note: putting two nodes and one edge in for dev purposes, remove later...
      nodes: {1: {id:1,name:'router'}, 2:{id:2,name:'laptop'}}, // ex: {id:1,name:'router'}
      edges: {1001:{id:1001,from:1,to:2}}, // ex: {id:1001,from:1,to:2}
      options: {},
    }
    
    // initWidget ensures that a widget exists in FD and initializes its props with the
    // second arg.
    // The third arg is the kind of widget to create, if it doesn't exist
    Object.assign(config, this.state)
    if (config.title === undefined || config.title === null) config.title = config.name
    fd.initWidget(this, config, 'NetworkDiagram')

    // handle flow input messages
    this.on("input", msg => {
      const topic = msg.topic
      const payload = msg.payload

      switch(topic) {
        case "set_network":
            if(payload.nodes && !Array.isArray(payload.nodes)) {
                throw "The payload.nodes should contain an array of nodes"
            }

            if(payload.edges && !Array.isArray(payload.edges)) {
                throw "The payload.edges should contain an array of edges"
            }
            
            this.state.nodes = {}
            if (payload.nodes) {
              this.state.nodes = Object.fromEntries(payload.nodes.map(n => [n.id, n]))
            }
            this.state.edges = {}
            if (payload.edges) {
              this.state.edges = Object.fromEntries(payload.edges.map(e => [e.id, e]))
            }

            if(payload.options && typeof payload.options === "object") {
                Object.assign(this.state.options, payload.options)
            }

            fd.updateWidget(this, this.state)
                       
            break

        case "add_nodes":
            if(!payload) {
                throw "The payload should contain one or more objects with node settings"
            }
            
            if(!Array.isArray(payload)) payload = [payload]

            const newNodes = Object.fromEntries(payload.map(n => [n.id, n]))
            Object.assign(this.state.nodes, newNodes)

            fd.updateWidget(this, this.state)
            break

        default:
          throw "Unsupported command '" + topic + "' in topic"
      }

    })

  }

  RED.nodes.registerType("network-diagram", NetworkDiagram)
}
