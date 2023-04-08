const NodeCrawler = require("node-opcua-client-crawler").NodeCrawler;
const opcua = require("node-opcua");
const { delay } = require("./general");

const startCrawling = async (node) => {
  try {
    const crawler = new NodeCrawler(node.session);
    node.status({ fill: "blue", shape: "dot", text: "Browsing variables..." });
    const items = [];
    crawler.on("browsed", function (element) {
      if (node.nodeClass === "All" && node.dataType === "All") {
        items.push({
          nodeId: element.nodeId || "Unknown",
          name: element.displayName?.text || "Unknown",
          dataType: opcua.DataTypeIds[element.dataType?.value] || "Unknown",
        });
      } else if (node.nodeClass === "All" && node.dataType !== "All") {
        if (node.dataType === element.dataType?.value) {
          items.push({
            nodeId: element.nodeId || "Unknown",
            name: element.displayName?.text || "Unknown",
            dataType: opcua.DataTypeIds[element.dataType?.value] || "Unknown",
          });
        }
      } else if (node.nodeClass !== "All" && node.dataType === "All") {
        if (node.nodeClass === element.nodeClass) {
          items.push({
            nodeId: element.nodeId || "Unknown",
            name: element.displayName?.text || "Unknown",
            dataType: opcua.DataTypeIds[element.dataType?.value] || "Unknown",
          });
        }
      } else {
        if (node.nodeClass === element.nodeClass && node.dataType === element.dataType?.value) {
          items.push({
            nodeId: element.nodeId || "Unknown",
            name: element.displayName?.text || "Unknown",
            dataType: opcua.DataTypeIds[element.dataType?.value] || "Unknown",
          });
        }
      }
    });
    await crawler.read(node.topic);
    crawler.dispose();
    return [...items.slice(0, 100)];
  } catch (error) {
    console.log(error);
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
          nodeId: item.nodeId,
          attributeId: opcua.AttributeIds.Value,
        },
        { samplingInterval: node.interval, discardOldest: true, queueSize: 10 },
        opcua.TimestampsToReturn.Both
      );
      monitoredItem.on("changed", (dataValue) => {
        node.send({
          payload: dataValue.value.value,
          name: item.name,
          nodeId: item.nodeId,
        });
      });
      monitoredItems.push(monitoredItem);
      await delay(20);
    }
    return monitoredItems;
  } catch (error) {
    console.log(error);
    throw "Can not subscribe items!";
  }
};

module.exports = {
  subscribeToItems,
  startCrawling,
};
