import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { ModuleFederationPlugin as WebpackModuleFederationPlugin, AsyncBoundaryPlugin } from "@module-federation/enhanced";
import { ModuleFederationPlugin as RspackModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { moduleFederationConfigPlugin } from "./configPlugin";
import { moduleFederationSSRPlugin } from "./ssrPlugin";
var moduleFederationPlugin = function() {
  var userConfig = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
  var internalModernPluginOptions = {
    csrConfig: void 0,
    ssrConfig: void 0,
    browserPlugin: void 0,
    nodePlugin: void 0,
    distOutputDir: "",
    originPluginOptions: userConfig,
    remoteIpStrategy: userConfig === null || userConfig === void 0 ? void 0 : userConfig.remoteIpStrategy
  };
  return {
    name: "@modern-js/plugin-module-federation",
    setup: function() {
      var _ref = _async_to_generator(function(param) {
        var useConfigContext, modernjsConfig;
        return _ts_generator(this, function(_state) {
          useConfigContext = param.useConfigContext;
          modernjsConfig = useConfigContext();
          return [
            2,
            {
              config: /* @__PURE__ */ _async_to_generator(function() {
                return _ts_generator(this, function(_state2) {
                  return [
                    2,
                    {
                      tools: {
                        rspack: function rspack(config, param2) {
                          var isServer = param2.isServer;
                          var browserPluginOptions = internalModernPluginOptions.csrConfig;
                          if (!isServer) {
                            var _config_plugins;
                            internalModernPluginOptions.browserPlugin = new RspackModuleFederationPlugin(browserPluginOptions);
                            (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(internalModernPluginOptions.browserPlugin);
                          }
                        },
                        webpack: function webpack(config, param2) {
                          var isServer = param2.isServer;
                          var _modernjsConfig_source;
                          var browserPluginOptions = internalModernPluginOptions.csrConfig;
                          if (!isServer) {
                            var _config_plugins;
                            internalModernPluginOptions.browserPlugin = new WebpackModuleFederationPlugin(browserPluginOptions);
                            (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(internalModernPluginOptions.browserPlugin);
                          }
                          var enableAsyncEntry = (_modernjsConfig_source = modernjsConfig.source) === null || _modernjsConfig_source === void 0 ? void 0 : _modernjsConfig_source.enableAsyncEntry;
                          if (!enableAsyncEntry && browserPluginOptions.async !== false) {
                            var _config_plugins1;
                            var asyncBoundaryPluginOptions = typeof browserPluginOptions.async === "object" ? browserPluginOptions.async : {
                              eager: function(module) {
                                return module && /\.federation/.test((module === null || module === void 0 ? void 0 : module.request) || "");
                              },
                              excludeChunk: function(chunk) {
                                return chunk.name === browserPluginOptions.name;
                              }
                            };
                            (_config_plugins1 = config.plugins) === null || _config_plugins1 === void 0 ? void 0 : _config_plugins1.push(new AsyncBoundaryPlugin(asyncBoundaryPluginOptions));
                          }
                        }
                      }
                    }
                  ];
                });
              })
            }
          ];
        });
      });
      return function(_) {
        return _ref.apply(this, arguments);
      };
    }(),
    usePlugins: [
      moduleFederationConfigPlugin(internalModernPluginOptions),
      moduleFederationSSRPlugin(internalModernPluginOptions)
    ]
  };
};
var cli_default = moduleFederationPlugin;
import { createModuleFederationConfig } from "@module-federation/enhanced";
export {
  createModuleFederationConfig,
  cli_default as default,
  moduleFederationPlugin
};
