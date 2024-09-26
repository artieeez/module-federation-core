import { encodeName } from "@module-federation/sdk";
import path from "path";
import os from "os";
import { bundle } from "@modern-js/node-bundle-require";
import { LOCALHOST, PLUGIN_IDENTIFIER } from "../constant";
const defaultPath = path.resolve(process.cwd(), "module-federation.config.ts");
const isDev = process.env.NODE_ENV === "development";
const getMFConfig = async (userConfig) => {
  const { config, configPath } = userConfig;
  if (config) {
    return config;
  }
  const mfConfigPath = configPath ? configPath : defaultPath;
  const preBundlePath = await bundle(mfConfigPath);
  const mfConfig = (await import(preBundlePath)).default;
  return mfConfig;
};
const injectRuntimePlugins = (runtimePlugin, runtimePlugins) => {
  if (!runtimePlugins.includes(runtimePlugin)) {
    runtimePlugins.push(runtimePlugin);
  }
};
const replaceRemoteUrl = (mfConfig, remoteIpStrategy) => {
  if (remoteIpStrategy && remoteIpStrategy === "inherit") {
    return;
  }
  if (!mfConfig.remotes) {
    return;
  }
  const ipv4 = getIPV4();
  const handleRemoteObject = (remoteObject) => {
    Object.keys(remoteObject).forEach((remoteKey) => {
      const remote = remoteObject[remoteKey];
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
    mfConfig.remotes.forEach((remoteObject) => {
      if (typeof remoteObject === "string") {
        return;
      }
      handleRemoteObject(remoteObject);
    });
  } else if (typeof mfConfig.remotes !== "string") {
    handleRemoteObject(mfConfig.remotes);
  }
};
const patchDTSConfig = (mfConfig, isServer) => {
  if (isServer) {
    return;
  }
  const ModernJSRuntime = "@modern-js/runtime/mf";
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
const patchMFConfig = (mfConfig, isServer, remoteIpStrategy) => {
  replaceRemoteUrl(mfConfig, remoteIpStrategy);
  if (mfConfig.remoteType === void 0) {
    mfConfig.remoteType = "script";
  }
  if (!mfConfig.name) {
    throw new Error(`${PLUGIN_IDENTIFIER} mfConfig.name can not be empty!`);
  }
  const runtimePlugins = [
    ...mfConfig.runtimePlugins || []
  ];
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
  const ignoredMsgs = [
    "external script",
    "process.env.WS_NO_BUFFER_UTIL",
    `Can't resolve 'utf-8-validate`
  ];
  bundlerConfig.ignoreWarnings.push((warning) => {
    if (ignoredMsgs.some((msg) => warning.message.includes(msg))) {
      return true;
    }
    return false;
  });
}
function patchBundlerConfig(options) {
  var _modernjsConfig_server, _bundlerConfig_optimization, _bundlerConfig_optimization1, _bundlerConfig_output, _modernjsConfig_deploy;
  const { bundlerConfig, modernjsConfig, isServer, mfConfig, bundlerType } = options;
  const enableSSR = Boolean((_modernjsConfig_server = modernjsConfig.server) === null || _modernjsConfig_server === void 0 ? void 0 : _modernjsConfig_server.ssr);
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
        bundlerConfig.watchOptions.ignored.push(`**/${mfConfig.dts.consumeTypes.remoteTypesFolder}/**`);
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
      bundlerConfig.output.chunkLoadingGlobal = `chunk_${mfConfig.name}`;
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
    console.warn(`${PLUGIN_IDENTIFIER} splitChunks.chunks = async is not allowed with stream SSR mode, it will auto changed to "async"`);
  }
  if (isDev && ((_bundlerConfig_output = bundlerConfig.output) === null || _bundlerConfig_output === void 0 ? void 0 : _bundlerConfig_output.publicPath) === "auto") {
    var _modernjsConfig_dev, _modernjsConfig_server1;
    const port = ((_modernjsConfig_dev = modernjsConfig.dev) === null || _modernjsConfig_dev === void 0 ? void 0 : _modernjsConfig_dev.port) || ((_modernjsConfig_server1 = modernjsConfig.server) === null || _modernjsConfig_server1 === void 0 ? void 0 : _modernjsConfig_server1.port) || 8080;
    const publicPath = `http://localhost:${port}/`;
    bundlerConfig.output.publicPath = publicPath;
  }
  if (isServer && enableSSR) {
    const { output } = bundlerConfig;
    const uniqueName = mfConfig.name || (output === null || output === void 0 ? void 0 : output.uniqueName);
    const chunkFileName = output === null || output === void 0 ? void 0 : output.chunkFilename;
    if (output && typeof chunkFileName === "string" && uniqueName && !chunkFileName.includes(uniqueName)) {
      const suffix = `${encodeName(uniqueName)}-[chunkhash].js`;
      output.chunkFilename = chunkFileName.replace(".js", suffix);
    }
  }
  if (isDev && enableSSR && !isServer) {
    bundlerConfig.resolve.fallback = {
      ...bundlerConfig.resolve.fallback,
      crypto: false,
      stream: false,
      vm: false
    };
  }
  if (((_modernjsConfig_deploy = modernjsConfig.deploy) === null || _modernjsConfig_deploy === void 0 ? void 0 : _modernjsConfig_deploy.microFrontend) && Object.keys(mfConfig.exposes || {}).length) {
    if (!bundlerConfig.optimization) {
      bundlerConfig.optimization = {};
    }
    bundlerConfig.optimization.usedExports = false;
  }
}
const localIpv4 = "127.0.0.1";
const getIpv4Interfaces = () => {
  try {
    const interfaces = os.networkInterfaces();
    const ipv4Interfaces = [];
    Object.values(interfaces).forEach((detail) => {
      detail === null || detail === void 0 ? void 0 : detail.forEach((detail2) => {
        const familyV4Value = typeof detail2.family === "string" ? "IPv4" : 4;
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
const getIPV4 = () => {
  const ipv4Interfaces = getIpv4Interfaces();
  const ipv4Interface = ipv4Interfaces[0] || {
    address: localIpv4
  };
  return ipv4Interface.address;
};
const SPLIT_CHUNK_MAP = {
  REACT: "react",
  ROUTER: "router",
  LODASH: "lib-lodash",
  ANTD: "lib-antd",
  ARCO: "lib-arco",
  SEMI: "lib-semi",
  AXIOS: "lib-axios"
};
const SHARED_SPLIT_CHUNK_MAP = {
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
  const arrayShared = Array.isArray(mfConfig.shared) ? mfConfig.shared : Object.keys(mfConfig.shared);
  for (const shared of arrayShared) {
    const splitChunkKey = SHARED_SPLIT_CHUNK_MAP[shared];
    if (!splitChunkKey) {
      continue;
    }
    if (bundlerConfig.optimization.splitChunks.cacheGroups[splitChunkKey]) {
      delete bundlerConfig.optimization.splitChunks.cacheGroups[splitChunkKey];
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
