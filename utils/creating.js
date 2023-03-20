const opcua = require("node-opcua");

const createClient = (node) => {
  try {
    if (node.opcuaEndpoint) {
      return opcua.OPCUAClient.create({
        connectionStrategy: {
          maxRetry: 10, // max try number to connect server
          initialDelay: 5000, // 5s
          maxDelay: 30000, // 30s,
        },
        securityPolicy: opcua.SecurityPolicy[node.opcuaEndpoint.secpolicy] || opcua.SecurityPolicy.None,
        securityMode: opcua.MessageSecurityMode[node.opcuaEndpoint.secmode] || opcua.MessageSecurityMode.None,
        keepSessionAlive: true,
      });
    } else {
      throw "Please fill opcua endpoint...";
    }
  } catch (err) {
    throw "Can not create client!";
  }
};

const createSession = async (node) => {
  try {
    if (node.opcuaEndpoint.user && node.opcuaEndpoint.password) {
      return await node.client.createSession({ userName: node.opcuaEndpoint.user, password: node.opcuaEndpoint.password });
    } else {
      return await node.client.createSession({});
    }
  } catch (error) {
    throw "Can not create session!";
  }
};

const createSubscription = (node) => {
  try {
    return opcua.ClientSubscription.create(node.session, {
      requestedPublishingInterval: 1000,
      defaultSecureTokenLifetime: 100000 * 5,
      requestedSessionTimeout: 300 * 1000,
      requestedLifetimeCount: 100,
      requestedMaxKeepAliveCount: 10,
      maxNotificationsPerPublish: 100,
      publishingEnabled: true,
      priority: 10,
    });
  } catch (error) {
    throw "Can not create subscription!";
  }
};

module.exports = {
  createClient,
  createSession,
  createSubscription,
};
