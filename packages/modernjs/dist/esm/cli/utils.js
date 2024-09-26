import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { encodeName } from "@module-federation/sdk";
import path from "path";
import os from "os";
import { bundle } from "@modern-js/node-bundle-require";
import { LOCALHOST, PLUGIN_IDENTIFIER } from "../constant";
var defaultPath = path.resolve(process.cwd(), "module-federation.config.ts");
var isDev = process.env.NODE_ENV === "development";
var getMFConfig = function() {
  var _ref = _async_to_generator(function(userConfig) {
    var config, configPath, mfConfigPath, preBundlePath, mfConfig;
    return _ts_generator(this, function(_state) {
      switch (_state.label) {
        case 0:
          config = userConfig.config, configPath = userConfig.configPath;
          if (config) {
            return [
              2,
              config
            ];
          }
          mfConfigPath = configPath ? configPath : defaultPath;
          return [
            4,
            bundle(mfConfigPath)
          ];
        case 1:
          preBundlePath = _state.sent();
          return [
            4,
            import(preBundlePath)
          ];
        case 2:
          mfConfig = _state.sent().default;
          return [
            2,
            mfConfig
          ];
      }
    });
  });
  return function getMFConfig2(userConfig) {
    return _ref.apply(this, arguments);
  };
}();
var injectRuntimePlugins = function(runtimePlugin, runtimePlugins) {
  if (!runtimePlugins.includes(runtimePlugin)) {
    runtimePlugins.push(runtimePlugin);
  }
};
var replaceRemoteUrl = function(mfConfig, remoteIpStrategy) {
  if (remoteIpStrategy && remoteIpStrategy === "inherit") {
    return;
  }
  if (!mfConfig.remotes) {
    return;
  }
  var ipv4 = getIPV4();
  var handleRemoteObject = function(remoteObject) {
    Object.keys(remoteObject).forEach(function(remoteKey) {
      var remote = remoteObject[remoteKey];
      if (Array.isArray(remote)) {
        return;
      }
      if (typeof remote === "string" && remote.includes(LOCALHOST)) {
        remoteObject[remoteKey] = remote.replace(LOCALHOST, ipv4);
      }
      if (typeof remote === "object" && !Array.isArray(remote.external) && remote.external.includes(LOCALHOST)) {
        remote.external = remote.external.replace(LOCALHOST, ipv4);
      }
    });
  };
  if (Array.isArray(mfConfig.remotes)) {
    mfConfig.remotes.forEach(function(remoteObject) {
      if (typeof remoteObject === "string") {
        return;
      }
      handleRemoteObject(remoteObject);
    });
  } else if (typeof mfConfig.remotes !== "string") {
    handleRemoteObject(mfConfig.remotes);
  }
};
var patchDTSConfig = function(mfConfig, isServer) {
  if (isServer) {
    return;
  }
  var ModernJSRuntime = "@modern-js/runtime/mf";
  if (mfConfig.dts !== false) {
    var _mfConfig_dts, _mfConfig_dts1;
    if (typeof mfConfig.dts === "boolean" || mfConfig.dts === void 0) {
      mfConfig.dts = {
        consumeTypes: {
          runtimePkgs: [
            ModernJSRuntime
          ]
        }
      };
    } else if (((_mfConfig_dts = mfConfig.dts) === null || _mfConfig_dts === void 0 ? void 0 : _mfConfig_dts.consumeTypes) || ((_mfConfig_dts1 = mfConfig.dts) === null || _mfConfig_dts1 === void 0 ? void 0 : _mfConfig_dts1.consumeTypes) === void 0) {
      var _mfConfig_dts2;
      if (typeof mfConfig.dts.consumeTypes === "boolean" || ((_mfConfig_dts2 = mfConfig.dts) === null || _mfConfig_dts2 === void 0 ? void 0 : _mfConfig_dts2.consumeTypes) === void 0) {
        mfConfig.dts.consumeTypes = {
          runtimePkgs: [
            ModernJSRuntime
          ]
        };
      } else {
        mfConfig.dts.consumeTypes.runtimePkgs = mfConfig.dts.consumeTypes.runtimePkgs || [];
        if (!mfConfig.dts.consumeTypes.runtimePkgs.includes(ModernJSRuntime)) {
          mfConfig.dts.consumeTypes.runtimePkgs.push(ModernJSRuntime);
        }
      }
    }
  }
};
var patchMFConfig = function(mfConfig, isServer, remoteIpStrategy) {
  replaceRemoteUrl(mfConfig, remoteIpStrategy);
  if (mfConfig.remoteType === void 0) {
    mfConfig.remoteType = "script";
  }
  if (!mfConfig.name) {
    throw new Error("".concat(PLUGIN_IDENTIFIER, " mfConfig.name can not be empty!"));
  }
  var runtimePlugins = _to_consumable_array(mfConfig.runtimePlugins || []);
  patchDTSConfig(mfConfig, isServer);
  injectRuntimePlugins(path.resolve(__dirname, "./mfRuntimePlugins/shared-strategy.js"), runtimePlugins);
  if (isDev) {
    injectRuntimePlugins(path.resolve(__dirname, "./mfRuntimePlugins/resolve-entry-ipv4.js"), runtimePlugins);
  }
  if (isServer) {
    injectRuntimePlugins(require.resolve("@module-federation/node/runtimePlugin"), runtimePlugins);
    if (isDev) {
      injectRuntimePlugins(require.resolve("@module-federation/node/record-dynamic-remote-entry-hash-plugin"), runtimePlugins);
    }
    injectRuntimePlugins(path.resolve(__dirname, "./mfRuntimePlugins/inject-node-fetch.js"), runtimePlugins);
    if (!mfConfig.library) {
      mfConfig.library = {
        type: "commonjs-module",
        name: mfConfig.name
      };
    } else {
      if (!mfConfig.library.type) {
        mfConfig.library.type = "commonjs-module";
      }
      if (!mfConfig.library.name) {
        mfConfig.library.name = mfConfig.name;
      }
    }
  }
  mfConfig.runtimePlugins = runtimePlugins;
  if (!isServer) {
    var _mfConfig_library;
    if (((_mfConfig_library = mfConfig.library) === null || _mfConfig_library === void 0 ? void 0 : _mfConfig_library.type) === "commonjs-module") {
      mfConfig.library.type = "global";
    }
    return mfConfig;
  }
  mfConfig.dts = false;
  mfConfig.dev = false;
  return mfConfig;
};
function patchIgnoreWarning(bundlerConfig) {
  bundlerConfig.ignoreWarnings = bundlerConfig.ignoreWarnings || [];
  var ignoredMsgs = [
    "external script",
    "process.env.WS_NO_BUFFER_UTIL",
    "Can't resolve 'utf-8-validate"
  ];
  bundlerConfig.ignoreWarnings.push(function(warning) {
    if (ignoredMsgs.some(function(msg) {
      return warning.message.includes(msg);
    })) {
      return true;
    }
    return false;
  });
}
function patchBundlerConfig(options) {
  var _modernjsConfig_server, _bundlerConfig_optimization, _bundlerConfig_optimization1, _bundlerConfig_output, _modernjsConfig_deploy;
  var bundlerConfig = options.bundlerConfig, modernjsConfig = options.modernjsConfig, isServer = options.isServer, mfConfig = options.mfConfig, bundlerType = options.bundlerType;
  var enableSSR = Boolean((_modernjsConfig_server = modernjsConfig.server) === null || _modernjsConfig_server === void 0 ? void 0 : _modernjsConfig_server.ssr);
  (_bundlerConfig_optimization = bundlerConfig.optimization) === null || _bundlerConfig_optimization === void 0 ? true : delete _bundlerConfig_optimization.runtimeChunk;
  patchIgnoreWarning(bundlerConfig);
  if (bundlerType === "webpack") {
    bundlerConfig.watchOptions = bundlerConfig.watchOptions || {};
    if (!Array.isArray(bundlerConfig.watchOptions.ignored)) {
      if (bundlerConfig.watchOptions.ignored) {
        bundlerConfig.watchOptions.ignored = [
          bundlerConfig.watchOptions.ignored
        ];
      } else {
        bundlerConfig.watchOptions.ignored = [];
      }
    }
    if (mfConfig.dts !== false) {
      if (typeof mfConfig.dts === "object" && typeof mfConfig.dts.consumeTypes === "object" && mfConfig.dts.consumeTypes.remoteTypesFolder) {
        bundlerConfig.watchOptions.ignored.push("**/".concat(mfConfig.dts.consumeTypes.remoteTypesFolder, "/**"));
      } else {
        bundlerConfig.watchOptions.ignored.push("**/@mf-types/**");
      }
    } else {
      bundlerConfig.watchOptions.ignored.push("**/@mf-types/**");
    }
  }
  if (bundlerConfig.output) {
    var _bundlerConfig_output1, _bundlerConfig_output2;
    if (!((_bundlerConfig_output1 = bundlerConfig.output) === null || _bundlerConfig_output1 === void 0 ? void 0 : _bundlerConfig_output1.chunkLoadingGlobal)) {
      bundlerConfig.output.chunkLoadingGlobal = "chunk_".concat(mfConfig.name);
    }
    if (!((_bundlerConfig_output2 = bundlerConfig.output) === null || _bundlerConfig_output2 === void 0 ? void 0 : _bundlerConfig_output2.uniqueName)) {
      bundlerConfig.output.uniqueName = mfConfig.name;
    }
  }
  if (!isServer) {
    autoDeleteSplitChunkCacheGroups(mfConfig, bundlerConfig);
  }
  if (!isServer && enableSSR && typeof ((_bundlerConfig_optimization1 = bundlerConfig.optimization) === null || _bundlerConfig_optimization1 === void 0 ? void 0 : _bundlerConfig_optimization1.splitChunks) === "object" && bundlerConfig.optimization.splitChunks.cacheGroups) {
    bundlerConfig.optimization.splitChunks.chunks = "async";
    console.warn("".concat(PLUGIN_IDENTIFIER, ' splitChunks.chunks = async is not allowed with stream SSR mode, it will auto changed to "async"'));
  }
  if (isDev && ((_bundlerConfig_output = bundlerConfig.output) === null || _bundlerConfig_output === void 0 ? void 0 : _bundlerConfig_output.publicPath) === "auto") {
    var _modernjsConfig_dev, _modernjsConfig_server1;
    var port = ((_modernjsConfig_dev = modernjsConfig.dev) === null || _modernjsConfig_dev === void 0 ? void 0 : _modernjsConfig_dev.port) || ((_modernjsConfig_server1 = modernjsConfig.server) === null || _modernjsConfig_server1 === void 0 ? void 0 : _modernjsConfig_server1.port) || 8080;
    var publicPath = "http://localhost:".concat(port, "/");
    bundlerConfig.output.publicPath = publicPath;
  }
  if (isServer && enableSSR) {
    var output = bundlerConfig.output;
    var uniqueName = mfConfig.name || (output === null || output === void 0 ? void 0 : output.uniqueName);
    var chunkFileName = output === null || output === void 0 ? void 0 : output.chunkFilename;
    if (output && typeof chunkFileName === "string" && uniqueName && !chunkFileName.includes(uniqueName)) {
      var suffix = "".concat(encodeName(uniqueName), "-[chunkhash].js");
      output.chunkFilename = chunkFileName.replace(".js", suffix);
    }
  }
  if (isDev && enableSSR && !isServer) {
    bundlerConfig.resolve.fallback = _object_spread_props(_object_spread({}, bundlerConfig.resolve.fallback), {
      crypto: false,
      stream: false,
      vm: false
    });
  }
  if (((_modernjsConfig_deploy = modernjsConfig.deploy) === null || _modernjsConfig_deploy === void 0 ? void 0 : _modernjsConfig_deploy.microFrontend) && Object.keys(mfConfig.exposes || {}).length) {
    if (!bundlerConfig.optimization) {
      bundlerConfig.optimization = {};
    }
    bundlerConfig.optimization.usedExports = false;
  }
}
var localIpv4 = "127.0.0.1";
var getIpv4Interfaces = function() {
  try {
    var interfaces = os.networkInterfaces();
    var ipv4Interfaces = [];
    Object.values(interfaces).forEach(function(detail) {
      detail === null || detail === void 0 ? void 0 : detail.forEach(function(detail2) {
        var familyV4Value = typeof detail2.family === "string" ? "IPv4" : 4;
        if (detail2.family === familyV4Value && detail2.address !== localIpv4) {
          ipv4Interfaces.push(detail2);
        }
      });
    });
    return ipv4Interfaces;
  } catch (_err) {
    return [];
  }
};
var getIPV4 = function() {
  var ipv4Interfaces = getIpv4Interfaces();
  var ipv4Interface = ipv4Interfaces[0] || {
    address: localIpv4
  };
  return ipv4Interface.address;
};
var SPLIT_CHUNK_MAP = {
  REACT: "react",
  ROUTER: "router",
  LODASH: "lib-lodash",
  ANTD: "lib-antd",
  ARCO: "lib-arco",
  SEMI: "lib-semi",
  AXIOS: "lib-axios"
};
var SHARED_SPLIT_CHUNK_MAP = {
  react: SPLIT_CHUNK_MAP.REACT,
  "react-dom": SPLIT_CHUNK_MAP.REACT,
  "react-router": SPLIT_CHUNK_MAP.ROUTER,
  "react-router-dom": SPLIT_CHUNK_MAP.ROUTER,
  "@remix-run/router": SPLIT_CHUNK_MAP.ROUTER,
  lodash: SPLIT_CHUNK_MAP.LODASH,
  "lodash-es": SPLIT_CHUNK_MAP.LODASH,
  antd: SPLIT_CHUNK_MAP.ANTD,
  "@arco-design/web-react": SPLIT_CHUNK_MAP.ARCO,
  "@douyinfe/semi-ui": SPLIT_CHUNK_MAP.SEMI,
  axios: SPLIT_CHUNK_MAP.AXIOS
};
function autoDeleteSplitChunkCacheGroups(mfConfig, bundlerConfig) {
  var _bundlerConfig_optimization;
  if (!mfConfig.shared) {
    return;
  }
  if (!((_bundlerConfig_optimization = bundlerConfig.optimization) === null || _bundlerConfig_optimization === void 0 ? void 0 : _bundlerConfig_optimization.splitChunks) || !bundlerConfig.optimization.splitChunks.cacheGroups) {
    return;
  }
  var arrayShared = Array.isArray(mfConfig.shared) ? mfConfig.shared : Object.keys(mfConfig.shared);
  var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = void 0;
  try {
    for (var _iterator = arrayShared[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var shared = _step.value;
      var splitChunkKey = SHARED_SPLIT_CHUNK_MAP[shared];
      if (!splitChunkKey) {
        continue;
      }
      if (bundlerConfig.optimization.splitChunks.cacheGroups[splitChunkKey]) {
        delete bundlerConfig.optimization.splitChunks.cacheGroups[splitChunkKey];
      }
    }
  } catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
  } finally {
    try {
      if (!_iteratorNormalCompletion && _iterator.return != null) {
        _iterator.return();
      }
    } finally {
      if (_didIteratorError) {
        throw _iteratorError;
      }
    }
  }
}
export {
  getIPV4,
  getMFConfig,
  patchBundlerConfig,
  patchIgnoreWarning,
  patchMFConfig
};
