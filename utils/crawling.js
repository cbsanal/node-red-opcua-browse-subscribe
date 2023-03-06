const NodeCrawler = require("node-opcua-client-crawler").NodeCrawler;

const startCrawling = async (node) => {
  const crawler = new NodeCrawler(node.session);
  node.status({
    fill: "blue",
    shape: "dot",
    text: "Browsing variables...",
  });
  node.items = [];
  node.loading = true;
  const items = [];
  crawler.on("browsed", function (element) {
    items.push({
      nodeId: element.nodeId,
      name: element.displayName.text,
      dataType: opcua.DataTypeIds[element.dataType.value] || "Unknown",
    });
  });
  await crawler.read(node.topic);
  node.items = [...items.slice(items.length - 200, items.length)];
  node.loading = false;
  node.status({
    fill: "green",
    shape: "dot",
    text: "Found all variables.",
  });
  crawler.dispose();
};

module.exports = {
  startCrawling,
};
