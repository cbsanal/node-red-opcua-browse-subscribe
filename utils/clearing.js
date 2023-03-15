const delay = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

const clearEverything = async (node) => {
  try {
    for (const item of node.monitoredItems) {
      await item.terminate();
      await delay(80);
    }
    if (node.subscription) {
      await node.subscription.terminate();
      await delay(100);
    }
    if (node.session) {
      await node.session.close();
      await delay(100);
    }
    if (node.client) {
      await node.client.disconnect();
      await delay(100);
    }
  } catch (error) {
    throw "Error happened on cleaning!";
  }
};

module.exports = {
  clearEverything,
};
