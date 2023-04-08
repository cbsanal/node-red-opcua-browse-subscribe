const { delay } = require("./general");

const clearEverything = async (node) => {
  try {
    for (const item of node.monitoredItems) {
      await item.terminate();
      await delay(20);
    }
    if (node.subscription) {
      await node.subscription.terminate();
      await delay(30);
    }
    if (node.session) {
      await node.session.close();
      await delay(30);
    }
    if (node.client) {
      await node.client.disconnect();
      await delay(30);
    }
  } catch (error) {
    throw "Error happened on cleaning!";
  }
};

module.exports = {
  clearEverything,
};
