import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import path from "path";
import { fs } from "@modern-js/utils";
import { ModuleFederationPlugin } from "@module-federation/enhanced/webpack";
import { ModuleFederationPlugin as RspackModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import UniverseEntryChunkTrackerPlugin from "@module-federation/node/universe-entry-chunk-tracker-plugin";
import { updateStatsAndManifest } from "./manifest";
import { isDev } from "./constant";
function setEnv() {
  process.env["MF_DISABLE_EMIT_STATS"] = "true";
  process.env["MF_SSR_PRJ"] = "true";
}
var moduleFederationSSRPlugin = function(userConfig) {
  return {
    name: "@modern-js/plugin-module-federation-ssr",
    pre: [
      "@modern-js/plugin-module-federation-config",
      "@modern-js/plugin-module-federation"
    ],
    setup: function() {
      var _ref = _async_to_generator(function(param) {
        var useConfigContext, useAppContext, _modernjsConfig_server, modernjsConfig, enableSSR;
        return _ts_generator(this, function(_state) {
          useConfigContext = param.useConfigContext, useAppContext = param.useAppContext;
          modernjsConfig = useConfigContext();
          enableSSR = Boolean(modernjsConfig === null || modernjsConfig === void 0 ? void 0 : (_modernjsConfig_server = modernjsConfig.server) === null || _modernjsConfig_server === void 0 ? void 0 : _modernjsConfig_server.ssr);
          if (!enableSSR) {
            return [
              2,
              {}
            ];
          }
          setEnv();
          return [
            2,
            {
              _internalRuntimePlugins: function(param2) {
                var entrypoint = param2.entrypoint, plugins = param2.plugins;
                if (!isDev) {
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
              config: /* @__PURE__ */ _async_to_generator(function() {
                return _ts_generator(this, function(_state2) {
                  return [
                    2,
                    {
                      tools: {
                        rspack: function rspack(config, param2) {
                          var isServer = param2.isServer;
                          if (isServer) {
                            if (!userConfig.nodePlugin) {
                              var _config_plugins;
                              userConfig.nodePlugin = new RspackModuleFederationPlugin(userConfig.ssrConfig);
                              (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(userConfig.nodePlugin);
                            }
                          } else {
                            var _config_output;
                            userConfig.distOutputDir = userConfig.distOutputDir || ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || path.resolve(process.cwd(), "dist");
                          }
                        },
                        webpack: function webpack(config, param2) {
                          var isServer = param2.isServer;
                          if (isServer) {
                            if (!userConfig.nodePlugin) {
                              var _config_plugins;
                              userConfig.nodePlugin = new ModuleFederationPlugin(userConfig.ssrConfig);
                              (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(userConfig.nodePlugin);
                            }
                          } else {
                            var _config_output;
                            userConfig.distOutputDir = userConfig.distOutputDir || ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || path.resolve(process.cwd(), "dist");
                          }
                        },
                        devServer: {
                          before: [
                            function(req, res, next) {
                              if (!enableSSR) {
                                next();
                                return;
                              }
                              try {
                                var _req_url, _req_url1;
                                if (((_req_url = req.url) === null || _req_url === void 0 ? void 0 : _req_url.includes(".json")) && !((_req_url1 = req.url) === null || _req_url1 === void 0 ? void 0 : _req_url1.includes("hot-update"))) {
                                  var filepath = path.join(process.cwd(), "dist".concat(req.url));
                                  fs.statSync(filepath);
                                  res.setHeader("Access-Control-Allow-Origin", "*");
                                  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
                                  res.setHeader("Access-Control-Allow-Headers", "X-Requested-With, content-type, Authorization");
                                  fs.createReadStream(filepath).pipe(res);
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
                        bundlerChain: function bundlerChain(chain, param2) {
                          var isServer = param2.isServer;
                          if (isServer) {
                            chain.target("async-node");
                            if (isDev) {
                              chain.plugin("UniverseEntryChunkTrackerPlugin").use(UniverseEntryChunkTrackerPlugin);
                            }
                          }
                          if (isDev && !isServer) {
                            chain.externals({
                              "@module-federation/node/utils": "NOT_USED_IN_BROWSER"
                            });
                          }
                        }
                      }
                    }
                  ];
                });
              }),
              afterBuild: function() {
                var nodePlugin = userConfig.nodePlugin, browserPlugin = userConfig.browserPlugin, distOutputDir = userConfig.distOutputDir;
                updateStatsAndManifest(nodePlugin, browserPlugin, distOutputDir);
              },
              afterDev: function() {
                var nodePlugin = userConfig.nodePlugin, browserPlugin = userConfig.browserPlugin, distOutputDir = userConfig.distOutputDir;
                updateStatsAndManifest(nodePlugin, browserPlugin, distOutputDir);
              }
            }
          ];
        });
      });
      return function(_) {
        return _ref.apply(this, arguments);
      };
    }()
  };
};
var ssrPlugin_default = moduleFederationSSRPlugin;
export {
  ssrPlugin_default as default,
  moduleFederationSSRPlugin,
  setEnv
};
