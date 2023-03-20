module.exports = function (RED) {
  "use strict";
  const { createSession, createClient, createSubscription } = require("../utils/creating");
  const { clearEverything } = require("../utils/clearing");
  const { startCrawling, subscribeToItems } = require("../utils/actions");

  RED.httpAdmin.get("/node-list/:nodeId", function (req, res) {
    const nodeId = req.params.nodeId;
    const node = RED.nodes.getNode(nodeId);
    if (node) {
      if (node.loading) {
        res.json("Loading");
      } else {
        res.json({ items: node.items, checkedItems: node.checkedItems });
      }
    } else {
      res.status(404).send("Not found");
    }
  });

  function OpcuaBrowseSubscribe(config) {
    RED.nodes.createNode(this, config);
    this.opcuaEndpoint = RED.nodes.getNode(config.endpoint);
    this.topic = config.topic || "ns=0;i=85";
    this.items = config.items;
    this.loading = true;
    this.monitoredItems = [];
    this.time = config.time;
    this.timeUnit = config.timeUnit;
    this.checkedItems = config.checkedItems;
    this.interval = (() => {
      if (this.timeUnit === "ms") return this.time;
      else if (this.timeUnit === "s") return this.time * 1000;
      else if (this.timeUnit === "m") return this.time * 60000;
      else return this.time * 3600000;
    })();
    this.client = null;
    this.session = null;
    this.subscription = null;
    const node = this;

    (async () => {
      try {
        node.status({ fill: "blue", shape: "dot", text: "Connecting..." });
        node.client = createClient(node);
        await node.client.connect(node.opcuaEndpoint.endpoint);
        node.session = await createSession(node);
        node.items = await startCrawling(node);
        node.loading = false;
        node.status({ fill: "green", shape: "dot", text: "Found all variables." });
        node.subscription = createSubscription(node);
        node.monitoredItems = await subscribeToItems(node);
        if (node.monitoredItems.length === 0) {
          node.status({ fill: "green", shape: "dot", text: "Check items to subscribe." });
        } else {
          node.status({ fill: "green", shape: "dot", text: "Subscribed to variables." });
        }
      } catch (error) {
        node.status({ fill: "red", shape: "dot", text: error });
      }
    })();

    node.on("close", async (_, done) => {
      try {
        node.status({ fill: "blue", shape: "dot", text: "Clearing previous session..." });
        await clearEverything(node);
      } catch (error) {
        node.status({ fill: "red", shape: "dot", text: error });
      }
      done();
    });
  }

  RED.nodes.registerType("Opcua-Browse-Subscribe", OpcuaBrowseSubscribe);
};
