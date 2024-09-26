import path from "path";
import { patchBundlerConfig, getIPV4, getMFConfig, patchMFConfig } from "./utils";
function setEnv(enableSSR) {
  if (enableSSR) {
    process.env["MF_DISABLE_EMIT_STATS"] = "true";
    process.env["MF_SSR_PRJ"] = "true";
  }
}
function modifyBundlerConfig(options) {
  const { mfConfig, config, isServer, modernjsConfig, remoteIpStrategy = "ipv4", bundlerType } = options;
  patchMFConfig(mfConfig, isServer, remoteIpStrategy);
  patchBundlerConfig({
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
    const mfConfig = await getMFConfig(userConfig.originPluginOptions);
    const csrConfig = userConfig.csrConfig || JSON.parse(JSON.stringify(mfConfig));
    const ssrConfig = userConfig.ssrConfig || JSON.parse(JSON.stringify(mfConfig));
    userConfig.ssrConfig = ssrConfig;
    userConfig.csrConfig = csrConfig;
    return {
      config: async () => {
        var _modernjsConfig_server, _modernjsConfig_source, _modernjsConfig_source1, _modernjsConfig_dev;
        const bundlerType = useAppContext().bundlerType === "rspack" ? "rspack" : "webpack";
        const ipv4 = getIPV4();
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
              userConfig.distOutputDir = ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || path.resolve(process.cwd(), "dist");
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
              userConfig.distOutputDir = ((_config_output = config.output) === null || _config_output === void 0 ? void 0 : _config_output.path) || path.resolve(process.cwd(), "dist");
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
export {
  configPlugin_default as default,
  modifyBundlerConfig,
  moduleFederationConfigPlugin,
  setEnv
};
