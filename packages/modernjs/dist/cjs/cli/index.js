"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var cli_exports = {};
__export(cli_exports, {
  createModuleFederationConfig: () => import_enhanced2.createModuleFederationConfig,
  default: () => cli_default,
  moduleFederationPlugin: () => moduleFederationPlugin
});
module.exports = __toCommonJS(cli_exports);
var import_enhanced = require("@module-federation/enhanced");
var import_rspack = require("@module-federation/enhanced/rspack");
var import_configPlugin = require("./configPlugin");
var import_ssrPlugin = require("./ssrPlugin");
var import_enhanced2 = require("@module-federation/enhanced");
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
                  internalModernPluginOptions.browserPlugin = new import_rspack.ModuleFederationPlugin(browserPluginOptions);
                  (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(internalModernPluginOptions.browserPlugin);
                }
              },
              webpack(config, { isServer }) {
                var _modernjsConfig_source;
                const browserPluginOptions = internalModernPluginOptions.csrConfig;
                if (!isServer) {
                  var _config_plugins;
                  internalModernPluginOptions.browserPlugin = new import_enhanced.ModuleFederationPlugin(browserPluginOptions);
                  (_config_plugins = config.plugins) === null || _config_plugins === void 0 ? void 0 : _config_plugins.push(internalModernPluginOptions.browserPlugin);
                }
                const enableAsyncEntry = (_modernjsConfig_source = modernjsConfig.source) === null || _modernjsConfig_source === void 0 ? void 0 : _modernjsConfig_source.enableAsyncEntry;
                if (!enableAsyncEntry && browserPluginOptions.async !== false) {
                  var _config_plugins1;
                  const asyncBoundaryPluginOptions = typeof browserPluginOptions.async === "object" ? browserPluginOptions.async : {
                    eager: (module2) => module2 && /\.federation/.test((module2 === null || module2 === void 0 ? void 0 : module2.request) || ""),
                    excludeChunk: (chunk) => chunk.name === browserPluginOptions.name
                  };
                  (_config_plugins1 = config.plugins) === null || _config_plugins1 === void 0 ? void 0 : _config_plugins1.push(new import_enhanced.AsyncBoundaryPlugin(asyncBoundaryPluginOptions));
                }
              }
            }
          };
        }
      };
    },
    usePlugins: [
      (0, import_configPlugin.moduleFederationConfigPlugin)(internalModernPluginOptions),
      (0, import_ssrPlugin.moduleFederationSSRPlugin)(internalModernPluginOptions)
    ]
  };
};
var cli_default = moduleFederationPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  createModuleFederationConfig,
  moduleFederationPlugin
});
