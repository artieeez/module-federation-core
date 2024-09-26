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
var configPlugin_exports = {};
__export(configPlugin_exports, {
  default: () => configPlugin_default,
  modifyBundlerConfig: () => modifyBundlerConfig,
  moduleFederationConfigPlugin: () => moduleFederationConfigPlugin,
  setEnv: () => setEnv
});
module.exports = __toCommonJS(configPlugin_exports);
var import_path = __toESM(require("path"));
var import_utils = require("./utils");
function setEnv(enableSSR) {
  if (enableSSR) {
    process.env["MF_DISABLE_EMIT_STATS"] = "true";
    process.env["MF_SSR_PRJ"] = "true";
  }
}
function modifyBundlerConfig(options) {
  const { mfConfig, config, isServer, modernjsConfig, remoteIpStrategy = "ipv4", bundlerType } = options;
  (0, import_utils.patchMFConfig)(mfConfig, isServer, remoteIpStrategy);
  (0, import_utils.patchBundlerConfig)({
    bundlerType,
    bundlerConfig: config,
    isServer,
    modernjsConfig,
    mfConfig
  });
}
const moduleFederationConfigPlugin = (userConfig) => ({
  name: "@modern-js/plugin-module-federation-config",
  pre: [
    "@modern-js/plugin-initialize"
  ],
  post: [
    "@modern-js/plugin-module-federation"
  ],
  setup: async ({ useConfigContext, useAppContext }) => {
    const modernjsConfig = useConfigContext();
    const mfConfig = await (0, import_utils.getMFConfig)(userConfig.originPluginOptions);
    const csrConfig = userConfig.csrConfig || JSON.parse(JSON.stringify(mfConfig));
    const ssrConfig = userConfig.ssrConfig || JSON.parse(JSON.stringify(mfConfig));
    userConfig.ssrConfig = ssrConfig;
    userConfig.csrConfig = csrConfig;
    return {
      config: async () => {
        var _modernjsConfig_server, _modernjsConfig_source, _modernjsConfig_source1, _modernjsConfig_dev;
        const bundlerType = useAppContext().bundlerType === "rspack" ? "rspack" : "webpack";
        const ipv4 = (0, import_utils.getIPV4)();
        const enableSSR = Boolean(modernjsConfig === null || modernjsConfig === void 0 ? void 0 : (_modernjsConfig_server = modernjsConfig.server) === null || _modernjsConfig_server === void 0 ? void 0 : _modernjsConfig_server.ssr);
        if (userConfig.remoteIpStrategy === void 0) {
          if (!enableSSR) {
            userConfig.remoteIpStrategy = "inherit";
          } else {
            userConfig.remoteIpStrategy = "ipv4";
          }
        }
        var _modernjsConfig_source_enableAsyncEntry;
        return {
          tools: {
            rspack(config, { isServer }) {
              var _config_output;
              modifyBundlerConfig({
                bundlerType,
                mfConfig: isServer ? ssrConfig : csrConfig,
                config,
                isServer,
                modernjsConfig,
                remoteIpStrategy: userConfig.remoteIpStrategy
              });
              userConfig.distOutputDir = ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || import_path.default.resolve(process.cwd(), "dist");
            },
            webpack(config, { isServer }) {
              var _config_output;
              modifyBundlerConfig({
                bundlerType,
                mfConfig: isServer ? ssrConfig : csrConfig,
                config,
                isServer,
                modernjsConfig,
                remoteIpStrategy: userConfig.remoteIpStrategy
              });
              userConfig.distOutputDir = ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || import_path.default.resolve(process.cwd(), "dist");
            },
            devServer: {
              headers: {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
                "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
              }
            }
          },
          source: {
            alias: {
              "@modern-js/runtime/mf": require.resolve("@module-federation/modern-js/runtime")
            },
            define: {
              FEDERATION_IPV4: JSON.stringify(ipv4),
              REMOTE_IP_STRATEGY: JSON.stringify(userConfig.remoteIpStrategy)
            },
            enableAsyncEntry: bundlerType === "rspack" ? (_modernjsConfig_source_enableAsyncEntry = (_modernjsConfig_source = modernjsConfig.source) === null || _modernjsConfig_source === void 0 ? void 0 : _modernjsConfig_source.enableAsyncEntry) !== null && _modernjsConfig_source_enableAsyncEntry !== void 0 ? _modernjsConfig_source_enableAsyncEntry : true : (_modernjsConfig_source1 = modernjsConfig.source) === null || _modernjsConfig_source1 === void 0 ? void 0 : _modernjsConfig_source1.enableAsyncEntry
          },
          dev: {
            assetPrefix: (modernjsConfig === null || modernjsConfig === void 0 ? void 0 : (_modernjsConfig_dev = modernjsConfig.dev) === null || _modernjsConfig_dev === void 0 ? void 0 : _modernjsConfig_dev.assetPrefix) ? modernjsConfig.dev.assetPrefix : true
          }
        };
      }
    };
  }
});
var configPlugin_default = moduleFederationConfigPlugin;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  modifyBundlerConfig,
  moduleFederationConfigPlugin,
  setEnv
});
