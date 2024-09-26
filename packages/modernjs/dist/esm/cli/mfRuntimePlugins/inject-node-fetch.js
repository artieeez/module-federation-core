import nodeFetch from "node-fetch";
var injectNodeFetchPlugin = function() {
  return {
    name: "inject-node-fetch-plugin",
    beforeInit: function beforeInit(args) {
      if (!globalThis.fetch) {
        globalThis.fetch = nodeFetch;
      }
      return args;
    }
  };
};
var inject_node_fetch_default = injectNodeFetchPlugin;
export {
  inject_node_fetch_default as default
};
