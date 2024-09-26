"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var ssrPlugin_exports = {};
__export(ssrPlugin_exports, {
  default: () => ssrPlugin_default,
  moduleFederationSSRPlugin: () => moduleFederationSSRPlugin,
  setEnv: () => setEnv
});
module.exports = __toCommonJS(ssrPlugin_exports);
var import_path = __toESM(require("path"));
var import_utils = require("@modern-js/utils");
var import_webpack = require("@module-federation/enhanced/webpack");
var import_rspack = require("@module-federation/enhanced/rspack");
var import_universe_entry_chunk_tracker_plugin = __toESM(require("@module-federation/node/universe-entry-chunk-tracker-plugin"));
var import_manifest = require("./manifest");
var import_constant = require("./constant");
function setEnv() {
  process.env["MF_DISABLE_EMIT_STATS"] = "true";
  process.env["MF_SSR_PRJ"] = "true";
}
const moduleFederationSSRPlugin = (userConfig) => ({
  name: "@modern-js/plugin-module-federation-ssr",
  pre: [
    "@modern-js/plugin-module-federation-config",
    "@modern-js/plugin-module-federation"
  ],
  setup: async ({ useConfigContext, useAppContext }) => {
    var _modernjsConfig_server;
    const modernjsConfig = useConfigContext();
    const enableSSR = Boolean(modernjsConfig === null || modernjsConfig === void 0 ? void 0 : (_modernjsConfig_server = modernjsConfig.server) === null || _modernjsConfig_server === void 0 ? void 0 : _modernjsConfig_server.ssr);
    if (!enableSSR) {
      return {};
    }
    setEnv();
    return {
      _internalRuntimePlugins: ({ entrypoint, plugins }) => {
        if (!import_constant.isDev) {
          return {
            entrypoint,
            plugins
          };
        }
        plugins.push({
          name: "mfSSR",
          path: "@module-federation/modern-js/ssr-runtime",
          config: {}
        });
        return {
          entrypoint,
          plugins
        };
      },
      config: async () => {
        return {
          tools: {
            rspack(config, { isServer }) {
              if (isServer) {
                if (!userConfig.nodePlugin) {
                  var _config_plugins;
                  userConfig.nodePlugin = new import_rspack.ModuleFederationPlugin(userConfig.ssrConfig);
                  (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(userConfig.nodePlugin);
                }
              } else {
                var _config_output;
                userConfig.distOutputDir = userConfig.distOutputDir || ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || import_path.default.resolve(process.cwd(), "dist");
              }
            },
            webpack(config, { isServer }) {
              if (isServer) {
                if (!userConfig.nodePlugin) {
                  var _config_plugins;
                  userConfig.nodePlugin = new import_webpack.ModuleFederationPlugin(userConfig.ssrConfig);
                  (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(userConfig.nodePlugin);
                }
              } else {
                var _config_output;
                userConfig.distOutputDir = userConfig.distOutputDir || ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || import_path.default.resolve(process.cwd(), "dist");
              }
            },
            devServer: {
              before: [
                (req, res, next) => {
                  if (!enableSSR) {
                    next();
                    return;
                  }
                  try {
                    var _req_url, _req_url1;
                    if (((_req_url = req.url) === null || _req_url === void 0 ? void 0 : _req_url.includes(".json")) && !((_req_url1 = req.url) === null || _req_url1 === void 0 ? void 0 : _req_url1.includes("hot-update"))) {
                      const filepath = import_path.default.join(process.cwd(), `dist${req.url}`);
                      import_utils.fs.statSync(filepath);
                      res.setHeader("Access-Control-Allow-Origin", "*");
                      res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
                      res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
                      import_utils.fs.createReadStream(filepath).pipe(res);
                    } else {
                      next();
                    }
                  } catch (err) {
                    if (process.env.FEDERATION_DEBUG) {
                      console.error(err);
                    }
                    next();
                  }
                }
              ]
            },
            bundlerChain(chain, { isServer }) {
              if (isServer) {
                chain.target("async-node");
                if (import_constant.isDev) {
                  chain.plugin("UniverseEntryChunkTrackerPlugin").use(import_universe_entry_chunk_tracker_plugin.default);
                }
              }
              if (import_constant.isDev && !isServer) {
                chain.externals({
                  "@module-federation/node/utils": "NOT_USED_IN_BROWSER"
                });
              }
            }
          }
        };
      },
      afterBuild: () => {
        const { nodePlugin, browserPlugin, distOutputDir } = userConfig;
        (0, import_manifest.updateStatsAndManifest)(nodePlugin, browserPlugin, distOutputDir);
      },
      afterDev: () => {
        const { nodePlugin, browserPlugin, distOutputDir } = userConfig;
        (0, import_manifest.updateStatsAndManifest)(nodePlugin, browserPlugin, distOutputDir);
      }
    };
  }
});
var ssrPlugin_default = moduleFederationSSRPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  moduleFederationSSRPlugin,
  setEnv
});
