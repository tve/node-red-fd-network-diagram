// Node-RED Network Diagram Node - this code runs in Node-RED

module.exports = function (RED) {

  // Instantiate the Node-RED node, 'this' is the node being constructed
  // and config contains the values set by the user in the flow editor.
  function NetworkDiagram2(config) {
    const fd = RED.nodes.getNode(config.fd) // get a handle onto FlexDash
    RED.nodes.createNode(this, config)
    if (!fd) return // not much we can do, wait for the next deploy...

    // initWidget ensures that a widget exists in FD and initializes its props with the
    // second arg. The third arg is the kind of widget to create, if it doesn't exist.
    Object.assign(config, { nodes: {}, edges: {}, options: {} })
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
          
          fd.setWidgetParam(this, 'nodes', Object.fromEntries(payload.nodes.map(n => [n.id, n])))
          fd.setWidgetParam(this, 'edges', Object.fromEntries(payload.edges.map(e => [e.id, e])))

          if(payload.options && typeof payload.options === "object") {
            fd.setWidgetParam(this, 'options', payload.options)
          }

          break

        case "add_nodes":
          if(!payload) {
              throw "The payload should contain one or more objects with node settings"
          }
          
          if(!Array.isArray(payload)) payload = [payload]
          for (const n of payload) {
            fd.setWidgetParam(this, `nodes/${n.id}`, n)
          }

          break

        default:
          throw "Unsupported command '" + topic + "' in topic"
      }

    })

  }

  RED.nodes.registerType("network-diagram-2", NetworkDiagram2)
}
