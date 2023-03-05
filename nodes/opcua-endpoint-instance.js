module.exports = function (RED) {
  "use strict";

  function OpcuaEndpointInstance(config) {
    RED.nodes.createNode(this, config);
    this.endpoint = config.endpoint;
    this.secpolicy = config.secpolicy;
    this.secmode = config.secmode;
    this.user = config.user;
    this.password = config.password;
  }
  RED.nodes.registerType("Opcua-Endpoint-Instance", OpcuaEndpointInstance);
};
