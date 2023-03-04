module.exports = function (RED) {
  "use strict";

  function OpcuaEndpointInstance(config) {
    RED.nodes.createNode(this, config);

    node.on("close", async () => {});
  }
  RED.nodes.registerType("Opcua-Endpoint-Instance", OpcuaEndpointInstance);
};
