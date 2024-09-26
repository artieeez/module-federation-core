import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { it, expect, describe } from "vitest";
import path from "path";
import { patchMFConfig, patchBundlerConfig, getIPV4 } from "./utils";
var mfConfig = {
  name: "host",
  filename: "remoteEntry.js",
  remotes: {
    remote: "http://localhost:3000/remoteEntry.js"
  },
  shared: {
    react: {
      singleton: true,
      eager: true
    },
    "react-dom": {
      singleton: true,
      eager: true
    }
  }
};
describe("patchMFConfig", /* @__PURE__ */ _async_to_generator(function() {
  return _ts_generator(this, function(_state) {
    it("patchMFConfig: server", /* @__PURE__ */ _async_to_generator(function() {
      var patchedConfig, ipv4;
      return _ts_generator(this, function(_state2) {
        patchedConfig = JSON.parse(JSON.stringify(mfConfig));
        patchMFConfig(patchedConfig, true);
        ipv4 = getIPV4();
        expect(patchedConfig).toStrictEqual({
          dev: false,
          dts: false,
          filename: "remoteEntry.js",
          library: {
            name: "host",
            type: "commonjs-module"
          },
          name: "host",
          remotes: {
            remote: "http://".concat(ipv4, ":3000/remoteEntry.js")
          },
          remoteType: "script",
          runtimePlugins: [
            path.resolve(__dirname, "./mfRuntimePlugins/shared-strategy.js"),
            require.resolve("@module-federation/node/runtimePlugin"),
            path.resolve(__dirname, "./mfRuntimePlugins/inject-node-fetch.js")
          ],
          shared: {
            react: {
              eager: true,
              singleton: true
            },
            "react-dom": {
              eager: true,
              singleton: true
            }
          }
        });
        return [
          2
        ];
      });
    }));
    it("patchMFConfig: client", /* @__PURE__ */ _async_to_generator(function() {
      var patchedConfig, ipv4;
      return _ts_generator(this, function(_state2) {
        patchedConfig = JSON.parse(JSON.stringify(mfConfig));
        patchMFConfig(patchedConfig, false);
        ipv4 = getIPV4();
        expect(patchedConfig).toStrictEqual({
          filename: "remoteEntry.js",
          name: "host",
          remotes: {
            remote: "http://".concat(ipv4, ":3000/remoteEntry.js")
          },
          remoteType: "script",
          runtimePlugins: [
            path.resolve(__dirname, "./mfRuntimePlugins/shared-strategy.js")
          ],
          shared: {
            react: {
              eager: true,
              singleton: true
            },
            "react-dom": {
              eager: true,
              singleton: true
            }
          },
          dts: {
            consumeTypes: {
              runtimePkgs: [
                "@modern-js/runtime/mf"
              ]
            }
          }
        });
        return [
          2
        ];
      });
    }));
    return [
      2
    ];
  });
}));
describe("patchBundlerConfig", /* @__PURE__ */ _async_to_generator(function() {
  return _ts_generator(this, function(_state) {
    it("patchBundlerConfig: server", /* @__PURE__ */ _async_to_generator(function() {
      var bundlerConfig, expectedConfig;
      return _ts_generator(this, function(_state2) {
        bundlerConfig = {
          output: {
            publicPath: "auto"
          }
        };
        patchBundlerConfig({
          bundlerType: "webpack",
          bundlerConfig,
          isServer: true,
          modernjsConfig: {
            server: {
              ssr: {
                mode: "stream"
              }
            }
          },
          mfConfig
        });
        expectedConfig = {
          output: {
            chunkLoadingGlobal: "chunk_host",
            publicPath: "auto",
            uniqueName: "host"
          },
          watchOptions: {
            ignored: [
              "**/@mf-types/**"
            ]
          }
        };
        bundlerConfig === null || bundlerConfig === void 0 ? true : delete bundlerConfig.ignoreWarnings;
        expect(bundlerConfig).toStrictEqual(expectedConfig);
        return [
          2
        ];
      });
    }));
    it("patchBundlerConfig: client", /* @__PURE__ */ _async_to_generator(function() {
      var bundlerConfig, expectedConfig;
      return _ts_generator(this, function(_state2) {
        bundlerConfig = {
          output: {
            publicPath: "auto"
          }
        };
        patchBundlerConfig({
          bundlerType: "webpack",
          bundlerConfig,
          isServer: false,
          modernjsConfig: {
            server: {
              ssr: {
                mode: "stream"
              }
            }
          },
          mfConfig
        });
        expectedConfig = {
          output: {
            chunkLoadingGlobal: "chunk_host",
            publicPath: "auto",
            uniqueName: "host"
          },
          watchOptions: {
            ignored: [
              "**/@mf-types/**"
            ]
          }
        };
        bundlerConfig === null || bundlerConfig === void 0 ? true : delete bundlerConfig.ignoreWarnings;
        expect(bundlerConfig).toStrictEqual(expectedConfig);
        return [
          2
        ];
      });
    }));
    return [
      2
    ];
  });
}));
