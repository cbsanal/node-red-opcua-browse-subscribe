const { delay } = require("./general");

const clearEverything = async (node) => {
  try {
    for (const item of node.monitoredItems) {
      await item.terminate();
      await delay(60);
    }
    if (node.subscription) {
      await node.subscription.terminate();
      await delay(80);
    }
    if (node.session) {
      await node.session.close();
      await delay(80);
    }
    if (node.client) {
      await node.client.disconnect();
      await delay(80);
    }
  } catch (error) {
    throw "Error happened on cleaning!";
  }
};

module.exports = {
  clearEverything,
};
