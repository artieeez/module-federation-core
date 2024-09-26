"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var import_vitest = require("vitest");
var import_path = __toESM(require("path"));
var import_utils = require("./utils");
const mfConfig = {
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
(0, import_vitest.describe)("patchMFConfig", async () => {
  (0, import_vitest.it)("patchMFConfig: server", async () => {
    const patchedConfig = JSON.parse(JSON.stringify(mfConfig));
    (0, import_utils.patchMFConfig)(patchedConfig, true);
    const ipv4 = (0, import_utils.getIPV4)();
    (0, import_vitest.expect)(patchedConfig).toStrictEqual({
      dev: false,
      dts: false,
      filename: "remoteEntry.js",
      library: {
        name: "host",
        type: "commonjs-module"
      },
      name: "host",
      remotes: {
        remote: `http://${ipv4}:3000/remoteEntry.js`
      },
      remoteType: "script",
      runtimePlugins: [
        import_path.default.resolve(__dirname, "./mfRuntimePlugins/shared-strategy.js"),
        require.resolve("@module-federation/node/runtimePlugin"),
        import_path.default.resolve(__dirname, "./mfRuntimePlugins/inject-node-fetch.js")
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
  });
  (0, import_vitest.it)("patchMFConfig: client", async () => {
    const patchedConfig = JSON.parse(JSON.stringify(mfConfig));
    (0, import_utils.patchMFConfig)(patchedConfig, false);
    const ipv4 = (0, import_utils.getIPV4)();
    (0, import_vitest.expect)(patchedConfig).toStrictEqual({
      filename: "remoteEntry.js",
      name: "host",
      remotes: {
        remote: `http://${ipv4}:3000/remoteEntry.js`
      },
      remoteType: "script",
      runtimePlugins: [
        import_path.default.resolve(__dirname, "./mfRuntimePlugins/shared-strategy.js")
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
  });
});
(0, import_vitest.describe)("patchBundlerConfig", async () => {
  (0, import_vitest.it)("patchBundlerConfig: server", async () => {
    const bundlerConfig = {
      output: {
        publicPath: "auto"
      }
    };
    (0, import_utils.patchBundlerConfig)({
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
    const expectedConfig = {
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
    (0, import_vitest.expect)(bundlerConfig).toStrictEqual(expectedConfig);
  });
  (0, import_vitest.it)("patchBundlerConfig: client", async () => {
    const bundlerConfig = {
      output: {
        publicPath: "auto"
      }
    };
    (0, import_utils.patchBundlerConfig)({
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
    const expectedConfig = {
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
    (0, import_vitest.expect)(bundlerConfig).toStrictEqual(expectedConfig);
  });
});
