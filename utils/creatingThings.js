const opcua = require("node-opcua");

const createClient = async (node) => {
  if (node.opcuaEndpoint) {
    node.status({ fill: "blue", shape: "dot", text: "Connecting..." });
    node.client = opcua.OPCUAClient.create({
      connectionStrategy: {
        maxRetry: 1, // max try number to connect server
        initialDelay: 5000, // 5s
        maxDelay: 30000, // 30s,
      },
      securityPolicy: opcua.SecurityPolicy[node.opcuaEndpoint.secpolicy] || opcua.SecurityPolicy.None,
      securityMode: opcua.MessageSecurityMode[node.opcuaEndpoint.secmode] || opcua.MessageSecurityMode.None,
      keepSessionAlive: true,
    });
    await node.client.connect(node.opcuaEndpoint.endpoint);
    node.session = await node.client.createSession({ userName: node.opcuaEndpoint.user, password: node.opcuaEndpoint.password });
  } else {
    node.status({ fill: "yellow", shape: "dot", text: "Please fill opcua endpoint..." });
  }
};

const createSubscription = async (node) => {
  const subscription = opcua.ClientSubscription.create(node.session, {
    requestedPublishingInterval: 1000,
    defaultSecureTokenLifetime: 100000 * 5,
    requestedSessionTimeout: 300 * 1000,
    requestedLifetimeCount: 100,
    requestedMaxKeepAliveCount: 10,
    maxNotificationsPerPublish: 100,
    publishingEnabled: true,
    priority: 10,
  });
  const monitoredItems = [];
  for (const item of node.checkedItems) {
    const monitoredItem = opcua.ClientMonitoredItem.create(
      subscription,
      {
        nodeId: item.nodeId || item.topic,
        attributeId: opcua.AttributeIds.Value,
      },
      { samplingInterval: node.interval, discardOldest: true, queueSize: 10 },
      opcua.TimestampsToReturn.Both
    );
    monitoredItem.on("changed", (dataValue) => {
      node.send({
        payload: dataValue.value.value,
        name: item.name,
      });
    });
    monitoredItems.push(monitoredItem);
  }
  if (monitoredItems.length === 0) {
    node.status({
      fill: "green",
      shape: "dot",
      text: "Check items to subscribe.",
    });
  } else {
    node.status({
      fill: "green",
      shape: "dot",
      text: "Subscribed to variables.",
    });
  }
};

module.exports = {
  createClient,
  createSubscription,
};
