module.exports = function (RED) {
  "use strict";
  const opcua = require("node-opcua");
  const uaclient = require("node-opcua-client");
  const NodeCrawler = require("node-opcua-client-crawler").NodeCrawler;

  RED.httpAdmin.get("/node-list/:nodeId", function (req, res) {
    const nodeId = req.params.nodeId;
    const node = RED.nodes.getNode(nodeId);
    if (node) {
      if (node.loading) {
        res.json("Loading");
      } else {
        res.json(node.items);
      }
    } else {
      res.status(404).send("Not found");
    }
  });

  function OpcuaBrowseSubscribe(config) {
    RED.nodes.createNode(this, config);
    this.topic = config.topic || "ns=0;i=85";
    this.items = config.items;
    this.loading = true;
    this.time = config.time;
    this.timeUnit = config.timeUnit;
    this.interval = (() => {
      if (this.timeUnit === "ms") return this.time;
      else if (this.timeUnit === "s") return this.time * 1000;
      else if (this.timeUnit === "m") return this.time * 60000;
      else return this.time * 3600000;
    })();
    const node = this;

    node.on("close", async () => {});
  }
  RED.nodes.registerType("Opcua-Browse-Subscribe", OpcuaBrowseSubscribe);
};
