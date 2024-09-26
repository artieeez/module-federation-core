import { ModuleFederationPlugin as WebpackModuleFederationPlugin, AsyncBoundaryPlugin } from "@module-federation/enhanced";
import { ModuleFederationPlugin as RspackModuleFederationPlugin } from "@module-federation/enhanced/rspack";
import { moduleFederationConfigPlugin } from "./configPlugin";
import { moduleFederationSSRPlugin } from "./ssrPlugin";
const moduleFederationPlugin = (userConfig = {}) => {
  const internalModernPluginOptions = {
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
    setup: async ({ useConfigContext }) => {
      const modernjsConfig = useConfigContext();
      return {
        config: async () => {
          return {
            tools: {
              rspack(config, { isServer }) {
                const browserPluginOptions = internalModernPluginOptions.csrConfig;
                if (!isServer) {
                  var _config_plugins;
                  internalModernPluginOptions.browserPlugin = new RspackModuleFederationPlugin(browserPluginOptions);
                  (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(internalModernPluginOptions.browserPlugin);
                }
              },
              webpack(config, { isServer }) {
                var _modernjsConfig_source;
                const browserPluginOptions = internalModernPluginOptions.csrConfig;
                if (!isServer) {
                  var _config_plugins;
                  internalModernPluginOptions.browserPlugin = new WebpackModuleFederationPlugin(browserPluginOptions);
                  (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(internalModernPluginOptions.browserPlugin);
                }
                const enableAsyncEntry = (_modernjsConfig_source = modernjsConfig.source) === null || _modernjsConfig_source === void 0 ? void 0 : _modernjsConfig_source.enableAsyncEntry;
                if (!enableAsyncEntry && browserPluginOptions.async !== false) {
                  var _config_plugins1;
                  const asyncBoundaryPluginOptions = typeof browserPluginOptions.async === "object" ? browserPluginOptions.async : {
                    eager: (module) => module && /\.federation/.test((module === null || module === void 0 ? void 0 : module.request) || ""),
                    excludeChunk: (chunk) => chunk.name === browserPluginOptions.name
                  };
                  (_config_plugins1 = config.plugins) === null || _config_plugins1 === void 0 ? void 0 : _config_plugins1.push(new AsyncBoundaryPlugin(asyncBoundaryPluginOptions));
                }
              }
            }
          };
        }
      };
    },
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
