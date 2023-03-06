const delay = async (time) => {
  await new Promise((resolve) => setTimeout(resolve, time));
};

const clearSubscription = async () => {
  if (node.subscription) {
    node.status({
      fill: "blue",
      shape: "dot",
      text: "Clearing previous session...",
    });
  }
  if (node.monitoredItems.length > 0) {
    for (const item of node.monitoredItems) {
      await item.terminate();
      await delay(80);
    }
  }
  if (node.subscription) {
    await delay(100);
    await node.subscription.terminate();
  }
};

const clearEverything = async () => {
  await clearSubscription(node);
  await delay(250);
  if (node.session) {
    await node.session.close();
    await delay(250);
  }
  if (node.client) {
    await node.client.disconnect();
    await delay(250);
  }
};

module.exports = {
  clearEverything,
  clearSubscription,
};
