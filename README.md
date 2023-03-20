# node-red-opcua-browse-subscribe

A simple node that allows you to browse all child nodes under the topic you enter and subscribe the checked ones.

## Install

Run the following command in your Node-RED user directory - typically `~/.node-red`

    npm install @cbsanal/node-red-opcua-browse-subscribe

## Dependencies

This node depends on following libraries:

- node-opcua
- node-opcua-client
- node-opcua-client-crawler

## Usage

- Click add new endpoint instance.
- Fill necessary areas for connecting your PLC.
- Enter the topic you want to search (default is ns=0;i=85).
- After pressing deploy, it will show all nodes under the topic you entered.
- Check the items you want to subscribe and press deploy.
- Output value will be like this:

```
{
    payload: checked item value,
    name: checked item name,
    nodeId: checked item nodeId
}
```

## New Features

- Pagination will be added, right now max 100 items can be rendered in table.
- Filtering system will be added (e.g show only float type nodes).
- I'm open to any pull request or issue report.
