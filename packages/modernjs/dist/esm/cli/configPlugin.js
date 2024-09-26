import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import path from "path";
import { patchBundlerConfig, getIPV4, getMFConfig, patchMFConfig } from "./utils";
function setEnv(enableSSR) {
  if (enableSSR) {
    process.env["MF_DISABLE_EMIT_STATS"] = "true";
    process.env["MF_SSR_PRJ"] = "true";
  }
}
function modifyBundlerConfig(options) {
  var mfConfig = options.mfConfig, config = options.config, isServer = options.isServer, modernjsConfig = options.modernjsConfig, _options_remoteIpStrategy = options.remoteIpStrategy, remoteIpStrategy = _options_remoteIpStrategy === void 0 ? "ipv4" : _options_remoteIpStrategy, bundlerType = options.bundlerType;
  patchMFConfig(mfConfig, isServer, remoteIpStrategy);
  patchBundlerConfig({
    bundlerType,
    bundlerConfig: config,
    isServer,
    modernjsConfig,
    mfConfig
  });
}
var moduleFederationConfigPlugin = function(userConfig) {
  return {
    name: "@modern-js/plugin-module-federation-config",
    pre: [
      "@modern-js/plugin-initialize"
    ],
    post: [
      "@modern-js/plugin-module-federation"
    ],
    setup: function() {
      var _ref = _async_to_generator(function(param) {
        var useConfigContext, useAppContext, modernjsConfig, mfConfig, csrConfig, ssrConfig;
        return _ts_generator(this, function(_state) {
          switch (_state.label) {
            case 0:
              useConfigContext = param.useConfigContext, useAppContext = param.useAppContext;
              modernjsConfig = useConfigContext();
              return [
                4,
                getMFConfig(userConfig.originPluginOptions)
              ];
            case 1:
              mfConfig = _state.sent();
              csrConfig = userConfig.csrConfig || JSON.parse(JSON.stringify(mfConfig));
              ssrConfig = userConfig.ssrConfig || JSON.parse(JSON.stringify(mfConfig));
              userConfig.ssrConfig = ssrConfig;
              userConfig.csrConfig = csrConfig;
              return [
                2,
                {
                  config: /* @__PURE__ */ _async_to_generator(function() {
                    var _modernjsConfig_server, _modernjsConfig_source, _modernjsConfig_source1, _modernjsConfig_dev, bundlerType, ipv4, enableSSR, _modernjsConfig_source_enableAsyncEntry;
                    return _ts_generator(this, function(_state2) {
                      bundlerType = useAppContext().bundlerType === "rspack" ? "rspack" : "webpack";
                      ipv4 = getIPV4();
                      enableSSR = Boolean(modernjsConfig === null || modernjsConfig === void 0 ? void 0 : (_modernjsConfig_server = modernjsConfig.server) === null || _modernjsConfig_server === void 0 ? void 0 : _modernjsConfig_server.ssr);
                      if (userConfig.remoteIpStrategy === void 0) {
                        if (!enableSSR) {
                          userConfig.remoteIpStrategy = "inherit";
                        } else {
                          userConfig.remoteIpStrategy = "ipv4";
                        }
                      }
                      return [
                        2,
                        {
                          tools: {
                            rspack: function rspack(config, param2) {
                              var isServer = param2.isServer;
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
                            webpack: function webpack(config, param2) {
                              var isServer = param2.isServer;
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
                        }
                      ];
                    });
                  })
                }
              ];
          }
        });
      });
      return function(_) {
        return _ref.apply(this, arguments);
      };
    }()
  };
};
var configPlugin_default = moduleFederationConfigPlugin;
export {
  configPlugin_default as default,
  modifyBundlerConfig,
  moduleFederationConfigPlugin,
  setEnv
};
