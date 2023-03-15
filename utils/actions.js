const NodeCrawler = require("node-opcua-client-crawler").NodeCrawler;
const opcua = require("node-opcua");

const startCrawling = async (node) => {
  try {
    const crawler = new NodeCrawler(node.session);
    node.status({ fill: "blue", shape: "dot", text: "Browsing variables..." });
    const items = [];
    crawler.on("browsed", function (element) {
      items.push({
        nodeId: element.nodeId || "Unknown",
        name: element.displayName?.text || "Unknown",
        dataType: opcua.DataTypeIds[element.dataType?.value] || "Unknown",
      });
    });
    await crawler.read(node.topic);
    crawler.dispose();
    return [...items.slice(0, 100)];
  } catch (error) {
    throw "Can not crawl!";
  }
};

const subscribeToItems = async (node) => {
  try {
    const monitoredItems = [];
    for (const item of node.checkedItems) {
      const monitoredItem = opcua.ClientMonitoredItem.create(
        node.subscription,
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
    return monitoredItems;
  } catch (error) {
    throw "Can not subscribe items!";
  }
};

module.exports = {
  subscribeToItems,
  startCrawling,
};
