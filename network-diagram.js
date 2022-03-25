// Node-RED Network Diagram Node - this code runs in Node-RED

module.exports = function (RED) {

  // Instantiate the Node-RED node, 'this' is the node being constructed
  // and config contains the values set by the user in the flow editor.
  function NetworkDiagram(config) {
    const fd = RED.nodes.getNode(config.fd) // get a handle onto FlexDash
    RED.nodes.createNode(this, config)
    if (!fd) return // not much we can do, will have to wait for a FD node to be selected
    
    // propagate this node's config to the FD widget
    // The third arg is the kind of widget to create, if it doesn't exist
    fd.initWidget(this, config, 'NetworkDiagram')

    // handle flow input messages, basically massage them a bit and update the FD widget
    this.on("input", msg => {
      // prepare update of widget params
      const params = typeof msg.params === 'object' ? Object.assign({}, msg.params) : {}
      // msg.payload is interpreted as setting the value
      //if ('payload' in msg) params.payload_param = msg.payload
      // send the params to the widget
      fd.updateWidget(this, params)
    })

  }

  RED.nodes.registerType("network-diagram", NetworkDiagram)
}
