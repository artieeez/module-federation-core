import {
  consumeTypes,
  generateTypesInChildProcess,
  rpc_exports
} from "./chunk-VJKKCGU4.js";
import {
  cloneDeepOptions,
  generateTypes,
  isTSProject,
  retrieveTypesAssetsInfo,
  validateOptions
} from "./chunk-FVLVCOUE.js";
import {
  getIPV4
} from "./chunk-MY3H5SQO.js";
import {
  WEB_CLIENT_OPTIONS_IDENTIFIER,
  __async,
  __name,
  __publicField,
  __spreadProps,
  __spreadValues
} from "./chunk-4CSLH7II.js";

// packages/dts-plugin/src/plugins/DevPlugin.ts
import fs from "fs-extra";
import chalk from "chalk";

// packages/dts-plugin/src/dev-worker/createDevWorker.ts
import * as path2 from "path";
import * as fse from "fs-extra";

// packages/dts-plugin/src/dev-worker/DevWorker.ts
import path from "path";
var _DevWorker = class _DevWorker {
  constructor(options) {
    __publicField(this, "_rpcWorker");
    __publicField(this, "_options");
    __publicField(this, "_res");
    this._options = cloneDeepOptions(options);
    this.removeUnSerializationOptions();
    this._rpcWorker = rpc_exports.createRpcWorker(path.resolve(__dirname, "./fork-dev-worker.js"), {}, void 0, false);
    this._res = this._rpcWorker.connect(this._options);
  }
  // moduleFederationConfig.manifest may have un serialization options
  removeUnSerializationOptions() {
    var _a2, _b, _c, _d;
    (_b = (_a2 = this._options.host) == null ? void 0 : _a2.moduleFederationConfig) == null ? true : delete _b.manifest;
    (_d = (_c = this._options.remote) == null ? void 0 : _c.moduleFederationConfig) == null ? true : delete _d.manifest;
  }
  get controlledPromise() {
    return this._res;
  }
  update() {
    var _a2, _b;
    (_b = (_a2 = this._rpcWorker.process) == null ? void 0 : _a2.send) == null ? void 0 : _b.call(_a2, {
      type: rpc_exports.RpcGMCallTypes.CALL,
      id: this._rpcWorker.id,
      args: [
        void 0,
        "update"
      ]
    });
  }
  exit() {
    var _a2;
    (_a2 = this._rpcWorker) == null ? void 0 : _a2.terminate();
  }
};
__name(_DevWorker, "DevWorker");
var DevWorker = _DevWorker;

// packages/dts-plugin/src/dev-worker/createDevWorker.ts
function removeLogFile() {
  return __async(this, null, function* () {
    try {
      const logDir = path2.resolve(process.cwd(), ".mf/typesGenerate.log");
      yield fse.remove(logDir);
    } catch (err) {
      console.error("removeLogFile error", "forkDevWorker", err);
    }
  });
}
__name(removeLogFile, "removeLogFile");
function createDevWorker(options) {
  removeLogFile();
  return new DevWorker(__spreadValues({}, options));
}
__name(createDevWorker, "createDevWorker");

// packages/dts-plugin/src/plugins/DevPlugin.ts
import { normalizeOptions, TEMP_DIR as BasicTempDir } from "@module-federation/sdk";
import path3 from "path";

// packages/dts-plugin/src/plugins/utils.ts
function isDev() {
  return process.env["NODE_ENV"] === "development";
}
__name(isDev, "isDev");

// packages/dts-plugin/src/plugins/DevPlugin.ts
var PROCESS_EXIT_CODE;
(function(PROCESS_EXIT_CODE2) {
  PROCESS_EXIT_CODE2[PROCESS_EXIT_CODE2["SUCCESS"] = 0] = "SUCCESS";
  PROCESS_EXIT_CODE2[PROCESS_EXIT_CODE2["FAILURE"] = 1] = "FAILURE";
})(PROCESS_EXIT_CODE || (PROCESS_EXIT_CODE = {}));
function ensureTempDir(filePath) {
  try {
    const dir = path3.dirname(filePath);
    fs.ensureDirSync(dir);
  } catch (_err) {
  }
}
__name(ensureTempDir, "ensureTempDir");
var _DevPlugin = class _DevPlugin {
  constructor(options) {
    __publicField(this, "name", "MFDevPlugin");
    __publicField(this, "_options");
    __publicField(this, "_devWorker");
    this._options = options;
  }
  static ensureLiveReloadEntry(options, filePath) {
    ensureTempDir(filePath);
    const liveReloadEntry = fs.readFileSync(path3.join(__dirname, "./iife/launch-web-client.js")).toString("utf-8");
    const liveReloadEntryWithOptions = liveReloadEntry.replace(WEB_CLIENT_OPTIONS_IDENTIFIER, JSON.stringify(options));
    fs.writeFileSync(filePath, liveReloadEntryWithOptions);
  }
  _stopWhenSIGTERMOrSIGINT() {
    process.on("SIGTERM", () => {
      console.log(chalk`{cyan ${this._options.name} Process(${process.pid}) SIGTERM, mf server will exit...}`);
      this._exit(0);
    });
    process.on("SIGINT", () => {
      console.log(chalk`{cyan ${this._options.name} Process(${process.pid}) SIGINT, mf server will exit...}`);
      this._exit(0);
    });
  }
  _handleUnexpectedExit() {
    process.on("unhandledRejection", (error) => {
      console.error("Unhandled Rejection Error: ", error);
      console.log(chalk`{cyan ${this._options.name} Process(${process.pid}) unhandledRejection, mf server will exit...}`);
      this._exit(1);
    });
    process.on("uncaughtException", (error) => {
      console.error("Unhandled Rejection Error: ", error);
      console.log(chalk`{cyan ${this._options.name} Process(${process.pid}) uncaughtException, mf server will exit...}`);
      this._exit(1);
    });
  }
  _exit(exitCode = 0) {
    var _a2;
    (_a2 = this._devWorker) == null ? void 0 : _a2.exit();
    process.exit(exitCode);
  }
  _afterEmit() {
    var _a2;
    (_a2 = this._devWorker) == null ? void 0 : _a2.update();
  }
  apply(compiler) {
    const { _options: { name, dev, dts } } = this;
    new compiler.webpack.DefinePlugin({
      FEDERATION_IPV4: JSON.stringify(getIPV4())
    }).apply(compiler);
    const normalizedDev = normalizeOptions(true, {
      disableLiveReload: true,
      disableHotTypesReload: false,
      disableDynamicRemoteTypeHints: false
    }, "mfOptions.dev")(dev);
    if (!isDev() || normalizedDev === false) {
      return;
    }
    if (normalizedDev.disableHotTypesReload && normalizedDev.disableLiveReload && normalizedDev.disableDynamicRemoteTypeHints) {
      return;
    }
    if (!name) {
      throw new Error("name is required if you want to enable dev server!");
    }
    if (!normalizedDev.disableDynamicRemoteTypeHints) {
      if (!this._options.runtimePlugins) {
        this._options.runtimePlugins = [];
      }
      this._options.runtimePlugins.push(path3.resolve(__dirname, "dynamic-remote-type-hints-plugin.js"));
    }
    if (!normalizedDev.disableLiveReload) {
      const TEMP_DIR = path3.join(`${process.cwd()}/node_modules`, BasicTempDir);
      const filepath = path3.join(TEMP_DIR, `live-reload.js`);
      if (typeof compiler.options.entry === "object") {
        _DevPlugin.ensureLiveReloadEntry({
          name
        }, filepath);
        Object.keys(compiler.options.entry).forEach((entry) => {
          const normalizedEntry = compiler.options.entry[entry];
          if (typeof normalizedEntry === "object" && Array.isArray(normalizedEntry.import)) {
            normalizedEntry.import.unshift(filepath);
          }
        });
      }
    }
    const defaultGenerateTypes = {
      compileInChildProcess: true
    };
    const defaultConsumeTypes = {
      consumeAPITypes: true
    };
    const normalizedDtsOptions = normalizeOptions(isTSProject(dts, compiler.context), {
      //  remote types dist(.dev-server) not be used currently, so no need to set extractThirdParty etc
      generateTypes: defaultGenerateTypes,
      consumeTypes: defaultConsumeTypes,
      extraOptions: {}
    }, "mfOptions.dts")(dts);
    const normalizedGenerateTypes = normalizeOptions(Boolean(normalizedDtsOptions), defaultGenerateTypes, "mfOptions.dts.generateTypes")(normalizedDtsOptions === false ? void 0 : normalizedDtsOptions.generateTypes);
    const remote = normalizedGenerateTypes === false ? void 0 : __spreadProps(__spreadValues({
      implementation: normalizedDtsOptions === false ? void 0 : normalizedDtsOptions.implementation,
      context: compiler.context,
      moduleFederationConfig: __spreadValues({}, this._options),
      hostRemoteTypesFolder: normalizedGenerateTypes.typesFolder || "@mf-types"
    }, normalizedGenerateTypes), {
      typesFolder: `.dev-server`
    });
    const normalizedConsumeTypes = normalizeOptions(Boolean(normalizedDtsOptions), defaultConsumeTypes, "mfOptions.dts.consumeTypes")(normalizedDtsOptions === false ? void 0 : normalizedDtsOptions.consumeTypes);
    const host = normalizedConsumeTypes === false ? void 0 : __spreadValues({
      implementation: normalizedDtsOptions === false ? void 0 : normalizedDtsOptions.implementation,
      context: compiler.context,
      moduleFederationConfig: this._options,
      typesFolder: normalizedConsumeTypes.typesFolder || "@mf-types",
      abortOnError: false
    }, normalizedConsumeTypes);
    const extraOptions = normalizedDtsOptions ? normalizedDtsOptions.extraOptions || {} : {};
    if (!remote && !host && normalizedDev.disableLiveReload) {
      return;
    }
    if (remote && !(remote == null ? void 0 : remote.tsConfigPath) && typeof normalizedDtsOptions === "object" && normalizedDtsOptions.tsConfigPath) {
      remote.tsConfigPath = normalizedDtsOptions.tsConfigPath;
    }
    this._devWorker = createDevWorker({
      name,
      remote,
      host,
      extraOptions,
      disableLiveReload: normalizedDev.disableHotTypesReload,
      disableHotTypesReload: normalizedDev.disableHotTypesReload
    });
    this._stopWhenSIGTERMOrSIGINT();
    this._handleUnexpectedExit();
    compiler.hooks.afterEmit.tap(this.name, this._afterEmit.bind(this));
  }
};
__name(_DevPlugin, "DevPlugin");
var DevPlugin = _DevPlugin;

// packages/dts-plugin/src/plugins/TypesPlugin.ts
import { normalizeOptions as normalizeOptions4 } from "@module-federation/sdk";

// packages/dts-plugin/src/plugins/ConsumeTypesPlugin.ts
import { normalizeOptions as normalizeOptions2 } from "@module-federation/sdk";
var _ConsumeTypesPlugin = class _ConsumeTypesPlugin {
  constructor(pluginOptions, dtsOptions, defaultOptions) {
    __publicField(this, "pluginOptions");
    __publicField(this, "dtsOptions");
    __publicField(this, "defaultOptions");
    this.pluginOptions = pluginOptions;
    this.dtsOptions = dtsOptions;
    this.defaultOptions = defaultOptions;
  }
  apply(compiler) {
    const { dtsOptions, defaultOptions, pluginOptions } = this;
    const normalizedConsumeTypes = normalizeOptions2(true, defaultOptions, "mfOptions.dts.consumeTypes")(dtsOptions.consumeTypes);
    if (!normalizedConsumeTypes) {
      return;
    }
    const finalOptions = {
      host: __spreadValues({
        implementation: dtsOptions.implementation,
        context: compiler.context,
        moduleFederationConfig: pluginOptions
      }, normalizedConsumeTypes),
      extraOptions: dtsOptions.extraOptions || {}
    };
    validateOptions(finalOptions.host);
    consumeTypes(finalOptions);
  }
};
__name(_ConsumeTypesPlugin, "ConsumeTypesPlugin");
var ConsumeTypesPlugin = _ConsumeTypesPlugin;

// packages/dts-plugin/src/plugins/GenerateTypesPlugin.ts
import fs2 from "fs";
import { normalizeOptions as normalizeOptions3 } from "@module-federation/sdk";
import path4 from "path";
var _GenerateTypesPlugin = class _GenerateTypesPlugin {
  constructor(pluginOptions, dtsOptions, defaultOptions) {
    __publicField(this, "pluginOptions");
    __publicField(this, "dtsOptions");
    __publicField(this, "defaultOptions");
    this.pluginOptions = pluginOptions;
    this.dtsOptions = dtsOptions;
    this.defaultOptions = defaultOptions;
  }
  apply(compiler) {
    const { dtsOptions, defaultOptions, pluginOptions } = this;
    const normalizedGenerateTypes = normalizeOptions3(true, defaultOptions, "mfOptions.dts.generateTypes")(dtsOptions.generateTypes);
    if (!normalizedGenerateTypes) {
      return;
    }
    const finalOptions = {
      remote: __spreadValues({
        implementation: dtsOptions.implementation,
        context: compiler.context,
        moduleFederationConfig: pluginOptions
      }, normalizedGenerateTypes),
      extraOptions: dtsOptions.extraOptions || {}
    };
    if (dtsOptions.tsConfigPath && !finalOptions.remote.tsConfigPath) {
      finalOptions.remote.tsConfigPath = dtsOptions.tsConfigPath;
    }
    validateOptions(finalOptions.remote);
    const isProd = !isDev();
    const getGenerateTypesFn = /* @__PURE__ */ __name(() => {
      let fn = generateTypes;
      let res;
      if (finalOptions.remote.compileInChildProcess) {
        fn = generateTypesInChildProcess;
      }
      if (isProd) {
        res = fn(finalOptions);
        return () => res;
      }
      return fn;
    }, "getGenerateTypesFn");
    const generateTypesFn = getGenerateTypesFn();
    compiler.hooks.thisCompilation.tap("mf:generateTypes", (compilation) => {
      compilation.hooks.processAssets.tapPromise({
        name: "mf:generateTypes",
        stage: (
          // @ts-expect-error use runtime variable in case peer dep not installed
          compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER
        )
      }, () => __async(this, null, function* () {
        try {
          const { zipTypesPath, apiTypesPath, zipName, apiFileName } = retrieveTypesAssetsInfo(finalOptions.remote);
          if (zipName && compilation.getAsset(zipName)) {
            return;
          }
          yield generateTypesFn(finalOptions);
          const config = finalOptions.remote.moduleFederationConfig;
          let zipPrefix = "";
          if (typeof config.manifest === "object" && config.manifest.filePath) {
            zipPrefix = config.manifest.filePath;
          } else if (typeof config.manifest === "object" && config.manifest.fileName) {
            zipPrefix = path4.dirname(config.manifest.fileName);
          } else if (config.filename) {
            zipPrefix = path4.dirname(config.filename);
          }
          if (zipTypesPath) {
            compilation.emitAsset(path4.join(zipPrefix, zipName), new compiler.webpack.sources.RawSource(fs2.readFileSync(zipTypesPath), false));
          }
          if (apiTypesPath) {
            compilation.emitAsset(path4.join(zipPrefix, apiFileName), new compiler.webpack.sources.RawSource(fs2.readFileSync(apiTypesPath), false));
          }
        } catch (err) {
          console.error(err);
        }
      }));
    });
  }
};
__name(_GenerateTypesPlugin, "GenerateTypesPlugin");
var GenerateTypesPlugin = _GenerateTypesPlugin;

// packages/dts-plugin/src/plugins/TypesPlugin.ts
var _a;
var TypesPlugin = (_a = class {
  constructor(options) {
    __publicField(this, "options");
    this.options = options;
  }
  apply(compiler) {
    const { options } = this;
    const defaultGenerateTypes = {
      generateAPITypes: true,
      compileInChildProcess: true,
      abortOnError: false,
      extractThirdParty: true,
      extractRemoteTypes: true
    };
    const defaultConsumeTypes = {
      abortOnError: false,
      consumeAPITypes: true
    };
    const normalizedDtsOptions = normalizeOptions4(isTSProject(options.dts, compiler.context), {
      generateTypes: defaultGenerateTypes,
      consumeTypes: defaultConsumeTypes,
      extraOptions: {}
    }, "mfOptions.dts")(options.dts);
    if (typeof normalizedDtsOptions !== "object") {
      return;
    }
    new GenerateTypesPlugin(options, normalizedDtsOptions, defaultGenerateTypes).apply(compiler);
    new ConsumeTypesPlugin(options, normalizedDtsOptions, defaultConsumeTypes).apply(compiler);
  }
}, __name(_a, "TypesPlugin"), _a);

// packages/dts-plugin/src/plugins/DtsPlugin.ts
var _DtsPlugin = class _DtsPlugin {
  constructor(options) {
    __publicField(this, "options");
    this.options = options;
  }
  apply(compiler) {
    const { options } = this;
    new DevPlugin(options).apply(compiler);
    new TypesPlugin(options).apply(compiler);
  }
};
__name(_DtsPlugin, "DtsPlugin");
var DtsPlugin = _DtsPlugin;
export {
  DtsPlugin
};
