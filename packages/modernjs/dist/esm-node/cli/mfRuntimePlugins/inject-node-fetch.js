import nodeFetch from "node-fetch";
const injectNodeFetchPlugin = () => ({
  name: "inject-node-fetch-plugin",
  beforeInit(args) {
    if (!globalThis.fetch) {
      globalThis.fetch = nodeFetch;
    }
    return args;
  }
});
var inject_node_fetch_default = injectNodeFetchPlugin;
export {
  inject_node_fetch_default as default
};
