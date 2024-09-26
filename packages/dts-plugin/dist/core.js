var __create = Object.create;
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
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
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
var __async = (__this, __arguments, generator) => {
  return new Promise((resolve4, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve4(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// packages/dts-plugin/src/core/index.ts
var core_exports = {};
__export(core_exports, {
  DTSManager: () => DTSManager,
  DtsWorker: () => DtsWorker,
  HOST_API_TYPES_FILE_NAME: () => HOST_API_TYPES_FILE_NAME,
  REMOTE_ALIAS_IDENTIFIER: () => REMOTE_ALIAS_IDENTIFIER,
  REMOTE_API_TYPES_FILE_NAME: () => REMOTE_API_TYPES_FILE_NAME,
  consumeTypes: () => consumeTypes,
  generateTypes: () => generateTypes,
  generateTypesInChildProcess: () => generateTypesInChildProcess,
  getDTSManagerConstructor: () => getDTSManagerConstructor,
  isTSProject: () => isTSProject,
  retrieveHostConfig: () => retrieveHostConfig,
  retrieveMfTypesPath: () => retrieveMfTypesPath,
  retrieveOriginalOutDir: () => retrieveOriginalOutDir,
  retrieveRemoteConfig: () => retrieveRemoteConfig,
  retrieveTypesAssetsInfo: () => retrieveTypesAssetsInfo,
  retrieveTypesZipPath: () => retrieveTypesZipPath,
  rpc: () => rpc_exports,
  validateOptions: () => validateOptions
});
module.exports = __toCommonJS(core_exports);

// packages/dts-plugin/src/core/configurations/remotePlugin.ts
var import_fs3 = require("fs");
var import_path5 = require("path");
var import_managers2 = require("@module-federation/managers");
var import_typescript = __toESM(require("typescript"));

// packages/dts-plugin/src/core/lib/utils.ts
var import_fs2 = __toESM(require("fs"));
var import_path4 = __toESM(require("path"));
var import_axios = __toESM(require("axios"));
var import_http2 = __toESM(require("http"));
var import_https = __toESM(require("https"));
var import_ansi_colors2 = __toESM(require("ansi-colors"));

// packages/dts-plugin/src/core/lib/DTSManager.ts
var import_ansi_colors = __toESM(require("ansi-colors"));
var import_path3 = __toESM(require("path"));
var import_promises3 = require("fs/promises");
var import_fs = __toESM(require("fs"));
var import_sdk5 = require("@module-federation/sdk");
var import_third_party_dts_extractor2 = require("@module-federation/third-party-dts-extractor");

// packages/dts-plugin/src/core/lib/archiveHandler.ts
var import_adm_zip = __toESM(require("adm-zip"));
var import_path2 = require("path");
var import_promises2 = require("fs/promises");

// packages/dts-plugin/src/core/lib/typeScriptCompiler.ts
var import_fs_extra = require("fs-extra");
var import_crypto = __toESM(require("crypto"));
var import_promises = require("fs/promises");
var import_path = require("path");
var import_third_party_dts_extractor = require("@module-federation/third-party-dts-extractor");
var import_child_process = require("child_process");
var import_util = __toESM(require("util"));
var import_sdk = require("@module-federation/sdk");
var STARTS_WITH_SLASH = /^\//;
var DEFINITION_FILE_EXTENSION = ".d.ts";
var retrieveMfTypesPath = /* @__PURE__ */ __name((tsConfig, remoteOptions) => (0, import_path.normalize)(tsConfig.compilerOptions.outDir.replace(remoteOptions.compiledTypesFolder, "")), "retrieveMfTypesPath");
var retrieveOriginalOutDir = /* @__PURE__ */ __name((tsConfig, remoteOptions) => (0, import_path.normalize)(tsConfig.compilerOptions.outDir.replace(remoteOptions.compiledTypesFolder, "").replace(remoteOptions.typesFolder, "")), "retrieveOriginalOutDir");
var retrieveMfAPITypesPath = /* @__PURE__ */ __name((tsConfig, remoteOptions) => (0, import_path.join)(retrieveOriginalOutDir(tsConfig, remoteOptions), `${remoteOptions.typesFolder}.d.ts`), "retrieveMfAPITypesPath");
function writeTempTsConfig(tsConfig, context, name) {
  const createHash = /* @__PURE__ */ __name((contents) => {
    return import_crypto.default.createHash("md5").update(contents).digest("hex");
  }, "createHash");
  const hash = createHash(`${JSON.stringify(tsConfig)}${name}`);
  const tempTsConfigJsonPath = (0, import_path.resolve)(context, "node_modules", import_sdk.TEMP_DIR, `tsconfig.${hash}.json`);
  (0, import_fs_extra.ensureDirSync)((0, import_path.dirname)(tempTsConfigJsonPath));
  (0, import_fs_extra.writeFileSync)(tempTsConfigJsonPath, JSON.stringify(tsConfig, null, 2));
  return tempTsConfigJsonPath;
}
__name(writeTempTsConfig, "writeTempTsConfig");
var removeExt = /* @__PURE__ */ __name((f) => {
  const ext = (0, import_path.extname)(f);
  const regexPattern = new RegExp(`\\${ext}$`);
  return f.replace(regexPattern, "");
}, "removeExt");
function getExposeKey(options) {
  const { filePath, rootDir, outDir, mapExposeToEntry } = options;
  const relativeFilePath = (0, import_path.relative)(outDir, filePath.replace(new RegExp(`\\.d.ts$`), ""));
  return mapExposeToEntry[relativeFilePath];
}
__name(getExposeKey, "getExposeKey");
var processTypesFile = /* @__PURE__ */ __name((options) => __async(void 0, null, function* () {
  const { outDir, filePath, rootDir, cb, mapExposeToEntry, mfTypePath } = options;
  if (!(0, import_fs_extra.existsSync)(filePath)) {
    return;
  }
  const stats = yield (0, import_promises.stat)(filePath);
  if (stats.isDirectory()) {
    const files = yield (0, import_promises.readdir)(filePath);
    yield Promise.all(files.map((file) => processTypesFile(__spreadProps(__spreadValues({}, options), {
      filePath: (0, import_path.join)(filePath, file)
    }))));
  } else if (filePath.endsWith(".d.ts")) {
    const exposeKey = getExposeKey({
      filePath,
      rootDir,
      outDir,
      mapExposeToEntry
    });
    if (exposeKey) {
      const sourceEntry = exposeKey === "." ? "index" : exposeKey;
      const mfeTypeEntry = (0, import_path.join)(mfTypePath, `${sourceEntry}${DEFINITION_FILE_EXTENSION}`);
      const mfeTypeEntryDirectory = (0, import_path.dirname)(mfeTypeEntry);
      const relativePathToOutput = (0, import_path.relative)(mfeTypeEntryDirectory, filePath).replace(DEFINITION_FILE_EXTENSION, "").replace(STARTS_WITH_SLASH, "").split(import_path.sep).join("/");
      (0, import_fs_extra.ensureDirSync)(mfeTypeEntryDirectory);
      yield (0, import_promises.writeFile)(mfeTypeEntry, `export * from './${relativePathToOutput}';
export { default } from './${relativePathToOutput}';`);
    }
    const content = yield (0, import_promises.readFile)(filePath, "utf8");
    cb(content);
  }
}), "processTypesFile");
var compileTs = /* @__PURE__ */ __name((mapComponentsToExpose, tsConfig, remoteOptions) => __async(void 0, null, function* () {
  if (!Object.keys(mapComponentsToExpose).length) {
    return;
  }
  const { compilerOptions } = tsConfig;
  const tempTsConfigJsonPath = writeTempTsConfig(tsConfig, remoteOptions.context, remoteOptions.moduleFederationConfig.name || "mf");
  try {
    const mfTypePath = retrieveMfTypesPath(tsConfig, remoteOptions);
    const thirdPartyExtractor = new import_third_party_dts_extractor.ThirdPartyExtractor((0, import_path.resolve)(mfTypePath, "node_modules"), remoteOptions.context);
    const execPromise = import_util.default.promisify(import_child_process.exec);
    const cmd = `npx ${remoteOptions.compilerInstance} --project ${tempTsConfigJsonPath}`;
    try {
      yield execPromise(cmd);
    } catch (err) {
      throw new Error(`compile TS failed, the original command is '${cmd}'`);
    }
    const mapExposeToEntry = Object.fromEntries(Object.entries(mapComponentsToExpose).map(([exposed, filename]) => {
      const normalizedFileName = (0, import_path.normalize)(filename);
      let relativeFileName = "";
      if ((0, import_path.isAbsolute)(normalizedFileName)) {
        relativeFileName = (0, import_path.relative)(tsConfig.compilerOptions.rootDir, normalizedFileName);
      } else {
        relativeFileName = (0, import_path.relative)(tsConfig.compilerOptions.rootDir, (0, import_path.resolve)(remoteOptions.context, normalizedFileName));
      }
      return [
        removeExt(relativeFileName),
        exposed
      ];
    }));
    const cb = remoteOptions.extractThirdParty ? thirdPartyExtractor.collectPkgs.bind(thirdPartyExtractor) : () => void 0;
    yield processTypesFile({
      outDir: compilerOptions.outDir,
      filePath: compilerOptions.outDir,
      rootDir: compilerOptions.rootDir,
      mfTypePath,
      cb,
      mapExposeToEntry
    });
    if (remoteOptions.extractThirdParty) {
      yield thirdPartyExtractor.copyDts();
    }
    yield (0, import_promises.rm)(tempTsConfigJsonPath);
  } catch (err) {
    throw err;
  }
}), "compileTs");

// packages/dts-plugin/src/server/message/Message.ts
var _Message = class _Message {
  constructor(type, kind) {
    __publicField(this, "type");
    __publicField(this, "kind");
    __publicField(this, "time");
    this.type = type;
    this.kind = kind;
    this.time = Date.now();
  }
};
__name(_Message, "Message");
var Message = _Message;

// packages/dts-plugin/src/server/message/API/API.ts
var APIKind;
(function(APIKind2) {
  APIKind2["UPDATE_SUBSCRIBER"] = "UPDATE_SUBSCRIBER";
  APIKind2["RELOAD_WEB_CLIENT"] = "RELOAD_WEB_CLIENT";
  APIKind2["FETCH_TYPES"] = "FETCH_TYPES";
})(APIKind || (APIKind = {}));
var _API = class _API extends Message {
  constructor(content, kind) {
    super("API", kind);
    __publicField(this, "code");
    __publicField(this, "payload");
    const { code, payload } = content;
    this.code = code;
    this.payload = payload;
  }
};
__name(_API, "API");
var API = _API;

// packages/dts-plugin/src/server/message/API/UpdateSubscriber.ts
var _UpdateSubscriberAPI = class _UpdateSubscriberAPI extends API {
  constructor(payload) {
    super({
      code: 0,
      payload
    }, APIKind.UPDATE_SUBSCRIBER);
  }
};
__name(_UpdateSubscriberAPI, "UpdateSubscriberAPI");
var UpdateSubscriberAPI = _UpdateSubscriberAPI;

// packages/dts-plugin/src/server/message/API/ReloadWebClient.ts
var _ReloadWebClientAPI = class _ReloadWebClientAPI extends API {
  constructor(payload) {
    super({
      code: 0,
      payload
    }, APIKind.RELOAD_WEB_CLIENT);
  }
};
__name(_ReloadWebClientAPI, "ReloadWebClientAPI");
var ReloadWebClientAPI = _ReloadWebClientAPI;

// packages/dts-plugin/src/server/message/API/FetchTypes.ts
var _FetchTypesAPI = class _FetchTypesAPI extends API {
  constructor(payload) {
    super({
      code: 0,
      payload
    }, APIKind.FETCH_TYPES);
  }
};
__name(_FetchTypesAPI, "FetchTypesAPI");
var FetchTypesAPI = _FetchTypesAPI;

// packages/dts-plugin/src/server/utils/index.ts
var import_sdk3 = require("@module-federation/sdk");

// packages/dts-plugin/src/server/utils/logTransform.ts
var import_chalk = __toESM(require("chalk"));

// packages/dts-plugin/src/server/message/Log/Log.ts
var LogLevel;
(function(LogLevel2) {
  LogLevel2["LOG"] = "LOG";
  LogLevel2["WARN"] = "WARN";
  LogLevel2["ERROR"] = "ERROR";
})(LogLevel || (LogLevel = {}));
var LogKind;
(function(LogKind2) {
  LogKind2["BrokerExitLog"] = "BrokerExitLog";
  LogKind2["PublisherRegisteredLog"] = "PublisherRegisteredLog";
})(LogKind || (LogKind = {}));
var _Log = class _Log extends Message {
  constructor(level, kind, ignoreVerbose = false) {
    super("Log", kind);
    __publicField(this, "level");
    __publicField(this, "ignoreVerbose", false);
    this.level = level;
    this.ignoreVerbose = ignoreVerbose;
  }
};
__name(_Log, "Log");
var Log = _Log;

// packages/dts-plugin/src/server/message/Log/BrokerExitLog.ts
var _BrokerExitLog = class _BrokerExitLog extends Log {
  constructor() {
    super(LogLevel.LOG, LogKind.BrokerExitLog);
  }
};
__name(_BrokerExitLog, "BrokerExitLog");
var BrokerExitLog = _BrokerExitLog;

// packages/dts-plugin/src/server/utils/log.ts
var import_sdk2 = require("@module-federation/sdk");
var log4js = __toESM(require("log4js"));
var import_chalk2 = __toESM(require("chalk"));

// packages/dts-plugin/src/server/constant.ts
var DEFAULT_WEB_SOCKET_PORT = 16322;
var WEB_SOCKET_CONNECT_MAGIC_ID = "1hpzW-zo2z-o8io-gfmV1-2cb1d82";
var UpdateMode;
(function(UpdateMode2) {
  UpdateMode2["POSITIVE"] = "POSITIVE";
  UpdateMode2["PASSIVE"] = "PASSIVE";
})(UpdateMode || (UpdateMode = {}));

// packages/dts-plugin/src/server/utils/log.ts
function fileLog(msg, module2, level) {
  var _a3, _b;
  if (!((_a3 = process == null ? void 0 : process.env) == null ? void 0 : _a3["FEDERATION_DEBUG"])) {
    return;
  }
  log4js.configure({
    appenders: {
      [module2]: {
        type: "file",
        filename: ".mf/typesGenerate.log"
      },
      default: {
        type: "file",
        filename: ".mf/typesGenerate.log"
      }
    },
    categories: {
      [module2]: {
        appenders: [
          module2
        ],
        level: "error"
      },
      default: {
        appenders: [
          "default"
        ],
        level: "trace"
      }
    }
  });
  const logger4 = log4js.getLogger(module2);
  logger4.level = "debug";
  (_b = logger4[level]) == null ? void 0 : _b.call(logger4, msg);
}
__name(fileLog, "fileLog");
function error(error2, action, from) {
  const err = error2 instanceof Error ? error2 : new Error(`${action} error`);
  fileLog(`[${action}] error: ${err}`, from, "fatal");
  return err.toString();
}
__name(error, "error");

// packages/dts-plugin/src/server/utils/index.ts
function getIdentifier(options) {
  const { ip, name } = options;
  return `mf ${import_sdk3.SEPARATOR}${name}${ip ? `${import_sdk3.SEPARATOR}${ip}` : ""}`;
}
__name(getIdentifier, "getIdentifier");

// packages/dts-plugin/src/server/Publisher.ts
var _Publisher = class _Publisher {
  constructor(ctx) {
    __publicField(this, "_ip");
    __publicField(this, "_name");
    __publicField(this, "_remoteTypeTarPath");
    __publicField(this, "_subscribers");
    __publicField(this, "_ws");
    __publicField(this, "dynamicRemoteMap");
    this._name = ctx.name;
    this._ip = ctx.ip;
    this._remoteTypeTarPath = ctx.remoteTypeTarPath;
    this._subscribers = /* @__PURE__ */ new Map();
    this._ws = ctx.ws;
    this.dynamicRemoteMap = /* @__PURE__ */ new Map();
  }
  get identifier() {
    return getIdentifier({
      name: this._name,
      ip: this._ip
    });
  }
  get name() {
    return this._name;
  }
  get ip() {
    return this._ip;
  }
  get remoteTypeTarPath() {
    return this._remoteTypeTarPath;
  }
  get hasSubscribes() {
    return Boolean(this._subscribers.size);
  }
  get subscribers() {
    return this._subscribers;
  }
  addSubscriber(identifier, subscriber) {
    fileLog(`${this.name} set subscriber: ${identifier}`, "Publisher", "info");
    this._subscribers.set(identifier, subscriber);
  }
  removeSubscriber(identifier) {
    if (this._subscribers.has(identifier)) {
      fileLog(`${this.name} removeSubscriber: ${identifier}`, "Publisher", "warn");
      this._subscribers.delete(identifier);
    }
  }
  notifySubscriber(subscriberIdentifier, options) {
    const subscriber = this._subscribers.get(subscriberIdentifier);
    if (!subscriber) {
      fileLog(`[notifySubscriber] ${this.name} notifySubscriber: ${subscriberIdentifier}, does not exits`, "Publisher", "error");
      return;
    }
    const api = new UpdateSubscriberAPI(options);
    subscriber.send(JSON.stringify(api));
    fileLog(`[notifySubscriber] ${this.name} notifySubscriber: ${JSON.stringify(subscriberIdentifier)}, message: ${JSON.stringify(api)}`, "Publisher", "info");
  }
  fetchRemoteTypes(options) {
    fileLog(`[fetchRemoteTypes] ${this.name} fetchRemoteTypes, options: ${JSON.stringify(options)}, ws: ${Boolean(this._ws)}`, "Publisher", "info");
    if (!this._ws) {
      return;
    }
    const api = new FetchTypesAPI(options);
    this._ws.send(JSON.stringify(api));
  }
  notifySubscribers(options) {
    const api = new UpdateSubscriberAPI(options);
    this.broadcast(api);
  }
  broadcast(message) {
    if (this.hasSubscribes) {
      this._subscribers.forEach((subscriber, key) => {
        fileLog(`[BroadCast] ${this.name} notifySubscriber: ${key}, PID: ${process.pid}, message: ${JSON.stringify(message)}`, "Publisher", "info");
        subscriber.send(JSON.stringify(message));
      });
    } else {
      fileLog(`[BroadCast] ${this.name}'s subscribe is empty`, "Publisher", "warn");
    }
  }
  close() {
    this._ws = void 0;
    this._subscribers.forEach((_subscriber, identifier) => {
      fileLog(`[BroadCast] close ${this.name} remove: ${identifier}`, "Publisher", "warn");
      this.removeSubscriber(identifier);
    });
  }
};
__name(_Publisher, "Publisher");
var Publisher = _Publisher;

// packages/dts-plugin/src/server/DevServer.ts
var import_isomorphic_ws2 = __toESM(require("isomorphic-ws"));

// packages/dts-plugin/src/server/broker/Broker.ts
var import_http = require("http");
var import_isomorphic_ws = __toESM(require("isomorphic-ws"));
var import_node_schedule = __toESM(require("node-schedule"));
var import_url = require("url");

// packages/dts-plugin/src/server/message/Action/Action.ts
var ActionKind;
(function(ActionKind2) {
  ActionKind2["ADD_SUBSCRIBER"] = "ADD_SUBSCRIBER";
  ActionKind2["EXIT_SUBSCRIBER"] = "EXIT_SUBSCRIBER";
  ActionKind2["ADD_PUBLISHER"] = "ADD_PUBLISHER";
  ActionKind2["UPDATE_PUBLISHER"] = "UPDATE_PUBLISHER";
  ActionKind2["NOTIFY_SUBSCRIBER"] = "NOTIFY_SUBSCRIBER";
  ActionKind2["EXIT_PUBLISHER"] = "EXIT_PUBLISHER";
  ActionKind2["ADD_WEB_CLIENT"] = "ADD_WEB_CLIENT";
  ActionKind2["NOTIFY_WEB_CLIENT"] = "NOTIFY_WEB_CLIENT";
  ActionKind2["FETCH_TYPES"] = "FETCH_TYPES";
  ActionKind2["ADD_DYNAMIC_REMOTE"] = "ADD_DYNAMIC_REMOTE";
})(ActionKind || (ActionKind = {}));

// packages/dts-plugin/src/server/message/Action/Update.ts
var UpdateKind;
(function(UpdateKind2) {
  UpdateKind2["UPDATE_TYPE"] = "UPDATE_TYPE";
  UpdateKind2["RELOAD_PAGE"] = "RELOAD_PAGE";
})(UpdateKind || (UpdateKind = {}));

// packages/dts-plugin/src/server/broker/Broker.ts
var _Broker = class _Broker {
  constructor() {
    __publicField(this, "_publisherMap", /* @__PURE__ */ new Map());
    __publicField(this, "_webClientMap", /* @__PURE__ */ new Map());
    __publicField(this, "_webSocketServer");
    __publicField(this, "_secureWebSocketServer");
    __publicField(this, "_tmpSubscriberShelter", /* @__PURE__ */ new Map());
    __publicField(this, "_scheduleJob", null);
    this._setSchedule();
    this._startWsServer();
    this._stopWhenSIGTERMOrSIGINT();
    this._handleUnexpectedExit();
  }
  get hasPublishers() {
    return Boolean(this._publisherMap.size);
  }
  _startWsServer() {
    return __async(this, null, function* () {
      const wsHandler = /* @__PURE__ */ __name((ws, req) => {
        const { url: reqUrl = "" } = req;
        const { query } = (0, import_url.parse)(reqUrl, true);
        const { WEB_SOCKET_CONNECT_MAGIC_ID: WEB_SOCKET_CONNECT_MAGIC_ID2 } = query;
        if (WEB_SOCKET_CONNECT_MAGIC_ID2 === _Broker.WEB_SOCKET_CONNECT_MAGIC_ID) {
          ws.on("message", (message) => {
            try {
              const text = message.toString();
              const action = JSON.parse(text);
              fileLog(`${action == null ? void 0 : action.kind} action received `, "Broker", "info");
              this._takeAction(action, ws);
            } catch (error2) {
              fileLog(`parse action message error: ${error2}`, "Broker", "error");
            }
          });
          ws.on("error", (e) => {
            fileLog(`parse action message error: ${e}`, "Broker", "error");
          });
        } else {
          ws.send("Invalid CONNECT ID.");
          fileLog("Invalid CONNECT ID.", "Broker", "warn");
          ws.close();
        }
      }, "wsHandler");
      const server = (0, import_http.createServer)();
      this._webSocketServer = new import_isomorphic_ws.default.Server({
        noServer: true
      });
      this._webSocketServer.on("error", (err) => {
        fileLog(`ws error: 
${err.message}
 ${err.stack}`, "Broker", "error");
      });
      this._webSocketServer.on("listening", () => {
        fileLog(`WebSocket server is listening on port ${_Broker.DEFAULT_WEB_SOCKET_PORT}`, "Broker", "info");
      });
      this._webSocketServer.on("connection", wsHandler);
      this._webSocketServer.on("close", (code) => {
        fileLog(`WebSocket Server Close with Code ${code}`, "Broker", "warn");
        this._webSocketServer && this._webSocketServer.close();
        this._webSocketServer = void 0;
      });
      server.on("upgrade", (req, socket, head) => {
        var _a3;
        if (req.url) {
          const { pathname } = (0, import_url.parse)(req.url);
          if (pathname === "/") {
            (_a3 = this._webSocketServer) == null ? void 0 : _a3.handleUpgrade(req, socket, head, (ws) => {
              var _a4;
              (_a4 = this._webSocketServer) == null ? void 0 : _a4.emit("connection", ws, req);
            });
          }
        }
      });
      server.listen(_Broker.DEFAULT_WEB_SOCKET_PORT);
    });
  }
  _takeAction(action, client) {
    return __async(this, null, function* () {
      const { kind, payload } = action;
      if (kind === ActionKind.ADD_PUBLISHER) {
        yield this._addPublisher(payload, client);
      }
      if (kind === ActionKind.UPDATE_PUBLISHER) {
        yield this._updatePublisher(payload, client);
      }
      if (kind === ActionKind.ADD_SUBSCRIBER) {
        yield this._addSubscriber(payload, client);
      }
      if (kind === ActionKind.EXIT_SUBSCRIBER) {
        yield this._removeSubscriber(payload, client);
      }
      if (kind === ActionKind.EXIT_PUBLISHER) {
        yield this._removePublisher(payload, client);
      }
      if (kind === ActionKind.ADD_WEB_CLIENT) {
        yield this._addWebClient(payload, client);
      }
      if (kind === ActionKind.NOTIFY_WEB_CLIENT) {
        yield this._notifyWebClient(payload, client);
      }
      if (kind === ActionKind.FETCH_TYPES) {
        yield this._fetchTypes(payload, client);
      }
      if (kind === ActionKind.ADD_DYNAMIC_REMOTE) {
        this._addDynamicRemote(payload);
      }
    });
  }
  _addPublisher(context, client) {
    return __async(this, null, function* () {
      const { name, ip, remoteTypeTarPath } = context != null ? context : {};
      const identifier = getIdentifier({
        name,
        ip
      });
      if (this._publisherMap.has(identifier)) {
        fileLog(`[${ActionKind.ADD_PUBLISHER}] ${identifier} has been added, this action will be ignored`, "Broker", "warn");
        return;
      }
      try {
        const publisher = new Publisher({
          name,
          ip,
          remoteTypeTarPath,
          ws: client
        });
        this._publisherMap.set(identifier, publisher);
        fileLog(`[${ActionKind.ADD_PUBLISHER}] ${identifier} Adding Publisher Succeed`, "Broker", "info");
        const tmpSubScribers = this._getTmpSubScribers(identifier);
        if (tmpSubScribers) {
          fileLog(`[${ActionKind.ADD_PUBLISHER}] consumeTmpSubscriber set ${publisher.name}\u2019s subscribers `, "Broker", "info");
          this._consumeTmpSubScribers(publisher, tmpSubScribers);
          this._clearTmpSubScriberRelation(identifier);
        }
      } catch (err) {
        const msg = error(err, ActionKind.ADD_PUBLISHER, "Broker");
        client.send(msg);
        client.close();
      }
    });
  }
  _updatePublisher(context, client) {
    return __async(this, null, function* () {
      const { name, updateMode, updateKind, updateSourcePaths, remoteTypeTarPath, ip } = context != null ? context : {};
      const identifier = getIdentifier({
        name,
        ip
      });
      if (!this._publisherMap.has(identifier)) {
        fileLog(`[${ActionKind.UPDATE_PUBLISHER}] ${identifier} has not been started, this action will be ignored
        this._publisherMap: ${JSON.stringify(this._publisherMap.entries())}
        `, "Broker", "warn");
        return;
      }
      try {
        const publisher = this._publisherMap.get(identifier);
        fileLog(
          // eslint-disable-next-line max-len
          `[${ActionKind.UPDATE_PUBLISHER}] ${identifier} update, and notify subscribers to update`,
          "Broker",
          "info"
        );
        if (publisher) {
          publisher.notifySubscribers({
            remoteTypeTarPath,
            name,
            updateMode,
            updateKind,
            updateSourcePaths: updateSourcePaths || []
          });
          this._publisherMap.forEach((p) => {
            if (p.name === publisher.name) {
              return;
            }
            const dynamicRemoteInfo = p.dynamicRemoteMap.get(identifier);
            if (dynamicRemoteInfo) {
              fileLog(
                // eslint-disable-next-line max-len
                `dynamicRemoteInfo: ${JSON.stringify(dynamicRemoteInfo)}, identifier:${identifier} publish: ${p.name}`,
                "Broker",
                "info"
              );
              p.fetchRemoteTypes({
                remoteInfo: dynamicRemoteInfo,
                once: false
              });
            }
          });
        }
      } catch (err) {
        const msg = error(err, ActionKind.UPDATE_PUBLISHER, "Broker");
        client.send(msg);
        client.close();
      }
    });
  }
  _fetchTypes(context, _client) {
    return __async(this, null, function* () {
      const { name, ip, remoteInfo } = context != null ? context : {};
      const identifier = getIdentifier({
        name,
        ip
      });
      try {
        const publisher = this._publisherMap.get(identifier);
        fileLog(`[${ActionKind.FETCH_TYPES}] ${identifier} fetch types`, "Broker", "info");
        if (publisher) {
          publisher.fetchRemoteTypes({
            remoteInfo,
            once: true
          });
        }
      } catch (err) {
        fileLog(`[${ActionKind.FETCH_TYPES}] ${identifier} fetch types fail , error info: ${err}`, "Broker", "error");
      }
    });
  }
  _addDynamicRemote(context) {
    const { name, ip, remoteInfo, remoteIp } = context != null ? context : {};
    const identifier = getIdentifier({
      name,
      ip
    });
    const publisher = this._publisherMap.get(identifier);
    const remoteId = getIdentifier({
      name: remoteInfo.name,
      ip: remoteIp
    });
    fileLog(`[${ActionKind.ADD_DYNAMIC_REMOTE}] identifier:${identifier},publisher: ${publisher.name}, remoteId:${remoteId}`, "Broker", "error");
    if (!publisher || publisher.dynamicRemoteMap.has(remoteId)) {
      return;
    }
    publisher.dynamicRemoteMap.set(remoteId, remoteInfo);
  }
  //  app1 consumes provider1,provider2. Dependencies at this time: publishers: [provider1, provider2], subscriberName: app1
  // provider1 is app1's remote
  _addSubscriber(context, client) {
    return __async(this, null, function* () {
      const { publishers, name: subscriberName } = context != null ? context : {};
      publishers.forEach((publisher) => {
        const { name, ip } = publisher;
        const identifier = getIdentifier({
          name,
          ip
        });
        if (!this._publisherMap.has(identifier)) {
          fileLog(`[${ActionKind.ADD_SUBSCRIBER}]: ${identifier} has not been started, ${subscriberName} will add the relation to tmp shelter`, "Broker", "warn");
          this._addTmpSubScriberRelation({
            name: getIdentifier({
              name: context.name,
              ip: context.ip
            }),
            client
          }, publisher);
          return;
        }
        try {
          const registeredPublisher = this._publisherMap.get(identifier);
          if (registeredPublisher) {
            registeredPublisher.addSubscriber(getIdentifier({
              name: subscriberName,
              ip: context.ip
            }), client);
            fileLog(
              // eslint-disable-next-line @ies/eden/max-calls-in-template
              `[${ActionKind.ADD_SUBSCRIBER}]: ${identifier} has been started, Adding Subscriber ${subscriberName} Succeed, this.__publisherMap are: ${JSON.stringify(Array.from(this._publisherMap.entries()))}`,
              "Broker",
              "info"
            );
            registeredPublisher.notifySubscriber(getIdentifier({
              name: subscriberName,
              ip: context.ip
            }), {
              updateKind: UpdateKind.UPDATE_TYPE,
              updateMode: UpdateMode.PASSIVE,
              updateSourcePaths: [
                registeredPublisher.name
              ],
              remoteTypeTarPath: registeredPublisher.remoteTypeTarPath,
              name: registeredPublisher.name
            });
            fileLog(
              // eslint-disable-next-line @ies/eden/max-calls-in-template
              `[${ActionKind.ADD_SUBSCRIBER}]: notifySubscriber Subscriber ${subscriberName}, updateMode: "PASSIVE",  updateSourcePaths: ${registeredPublisher.name}`,
              "Broker",
              "info"
            );
          }
        } catch (err) {
          const msg = error(err, ActionKind.ADD_SUBSCRIBER, "Broker");
          client.send(msg);
          client.close();
        }
      });
    });
  }
  // Trigger while consumer exit
  _removeSubscriber(context, client) {
    return __async(this, null, function* () {
      const { publishers } = context != null ? context : {};
      const subscriberIdentifier = getIdentifier({
        name: context == null ? void 0 : context.name,
        ip: context == null ? void 0 : context.ip
      });
      publishers.forEach((publisher) => {
        const { name, ip } = publisher;
        const identifier = getIdentifier({
          name,
          ip
        });
        const registeredPublisher = this._publisherMap.get(identifier);
        if (!registeredPublisher) {
          fileLog(`[${ActionKind.EXIT_SUBSCRIBER}], ${identifier} does not exit `, "Broker", "warn");
          return;
        }
        try {
          fileLog(`[${ActionKind.EXIT_SUBSCRIBER}], ${identifier} will exit `, "Broker", "INFO");
          registeredPublisher.removeSubscriber(subscriberIdentifier);
          this._clearTmpSubScriberRelation(identifier);
          if (!registeredPublisher.hasSubscribes) {
            this._publisherMap.delete(identifier);
          }
          if (!this.hasPublishers) {
            this.exit();
          }
        } catch (err) {
          const msg = error(err, ActionKind.EXIT_SUBSCRIBER, "Broker");
          client.send(msg);
          client.close();
        }
      });
    });
  }
  _removePublisher(context, client) {
    return __async(this, null, function* () {
      const { name, ip } = context != null ? context : {};
      const identifier = getIdentifier({
        name,
        ip
      });
      const publisher = this._publisherMap.get(identifier);
      if (!publisher) {
        fileLog(`[${ActionKind.EXIT_PUBLISHER}]: ${identifier}} has not been added, this action will be ingored`, "Broker", "warn");
        return;
      }
      try {
        const { subscribers } = publisher;
        subscribers.forEach((subscriber, subscriberIdentifier) => {
          this._addTmpSubScriberRelation({
            name: subscriberIdentifier,
            client: subscriber
          }, {
            name: publisher.name,
            ip: publisher.ip
          });
          fileLog(
            // eslint-disable-next-line max-len
            `[${ActionKind.EXIT_PUBLISHER}]: ${identifier} is removing , subscriber: ${subscriberIdentifier} will be add  tmpSubScriberRelation`,
            "Broker",
            "info"
          );
        });
        this._publisherMap.delete(identifier);
        fileLog(`[${ActionKind.EXIT_PUBLISHER}]: ${identifier} is removed `, "Broker", "info");
        if (!this.hasPublishers) {
          fileLog(`[${ActionKind.EXIT_PUBLISHER}]: _publisherMap is empty, all server will exit `, "Broker", "warn");
          this.exit();
        }
      } catch (err) {
        const msg = error(err, ActionKind.EXIT_PUBLISHER, "Broker");
        client.send(msg);
        client.close();
      }
    });
  }
  _addWebClient(context, client) {
    return __async(this, null, function* () {
      const { name } = context != null ? context : {};
      const identifier = getIdentifier({
        name
      });
      if (this._webClientMap.has(identifier)) {
        fileLog(`${identifier}} has been added, this action will override prev WebClient`, "Broker", "warn");
      }
      try {
        this._webClientMap.set(identifier, client);
        fileLog(`${identifier} adding WebClient Succeed`, "Broker", "info");
      } catch (err) {
        const msg = error(err, ActionKind.ADD_WEB_CLIENT, "Broker");
        client.send(msg);
        client.close();
      }
    });
  }
  _notifyWebClient(context, client) {
    return __async(this, null, function* () {
      const { name, updateMode } = context != null ? context : {};
      const identifier = getIdentifier({
        name
      });
      const webClient = this._webClientMap.get(identifier);
      if (!webClient) {
        fileLog(`[${ActionKind.NOTIFY_WEB_CLIENT}] ${identifier} has not been added, this action will be ignored`, "Broker", "warn");
        return;
      }
      try {
        const api = new ReloadWebClientAPI({
          name,
          updateMode
        });
        webClient.send(JSON.stringify(api));
        fileLog(`[${ActionKind.NOTIFY_WEB_CLIENT}] Notify ${name} WebClient Succeed`, "Broker", "info");
      } catch (err) {
        const msg = error(err, ActionKind.NOTIFY_WEB_CLIENT, "Broker");
        client.send(msg);
        client.close();
      }
    });
  }
  // app1 consumes provider1, and provider1 not launch. this._tmpSubscriberShelter at this time: {provider1: Map{subscribers: Map{app1: app1+ip+client'}, timestamp: 'xx'} }
  _addTmpSubScriberRelation(subscriber, publisher) {
    const publisherIdentifier = getIdentifier({
      name: publisher.name,
      ip: publisher.ip
    });
    const subscriberIdentifier = subscriber.name;
    const shelter = this._tmpSubscriberShelter.get(publisherIdentifier);
    if (!shelter) {
      const map = /* @__PURE__ */ new Map();
      map.set(subscriberIdentifier, subscriber);
      this._tmpSubscriberShelter.set(publisherIdentifier, {
        subscribers: map,
        timestamp: Date.now()
      });
      fileLog(`[AddTmpSubscriberRelation] ${publisherIdentifier}'s subscriber has ${subscriberIdentifier} `, "Broker", "info");
      return;
    }
    const tmpSubScriberShelterSubscriber = shelter.subscribers.get(subscriberIdentifier);
    if (tmpSubScriberShelterSubscriber) {
      fileLog(`[AddTmpSubscriberRelation] ${publisherIdentifier} and ${subscriberIdentifier} relation has been added`, "Broker", "warn");
      shelter.subscribers.set(subscriberIdentifier, subscriber);
      shelter.timestamp = Date.now();
    } else {
      fileLog(
        // eslint-disable-next-line max-len
        `AddTmpSubscriberLog ${publisherIdentifier}'s shelter has been added, update shelter.subscribers ${subscriberIdentifier}`,
        "Broker",
        "warn"
      );
      shelter.subscribers.set(subscriberIdentifier, subscriber);
    }
  }
  _getTmpSubScribers(publisherIdentifier) {
    var _a3;
    return (_a3 = this._tmpSubscriberShelter.get(publisherIdentifier)) == null ? void 0 : _a3.subscribers;
  }
  // after adding publisher, it will change the temp subscriber to regular subscriber
  _consumeTmpSubScribers(publisher, tmpSubScribers) {
    tmpSubScribers.forEach((tmpSubScriber, identifier) => {
      fileLog(`notifyTmpSubScribers ${publisher.name} will be add a subscriber: ${identifier} `, "Broker", "warn");
      publisher.addSubscriber(identifier, tmpSubScriber.client);
      publisher.notifySubscriber(identifier, {
        updateKind: UpdateKind.UPDATE_TYPE,
        updateMode: UpdateMode.PASSIVE,
        updateSourcePaths: [
          publisher.name
        ],
        remoteTypeTarPath: publisher.remoteTypeTarPath,
        name: publisher.name
      });
    });
  }
  _clearTmpSubScriberRelation(identifier) {
    this._tmpSubscriberShelter.delete(identifier);
  }
  _clearTmpSubScriberRelations() {
    this._tmpSubscriberShelter.clear();
  }
  _disconnect() {
    this._publisherMap.forEach((publisher) => {
      publisher.close();
    });
  }
  // Every day on 0/6/9/12/15//18, Publishers that have not been connected within 1.5 hours will be cleared regularly.
  // If process.env.FEDERATION_SERVER_TEST is set, it will be read at a specified time.
  _setSchedule() {
    const rule = new import_node_schedule.default.RecurrenceRule();
    if (Number(process.env["FEDERATION_SERVER_TEST"])) {
      const interval = Number(process.env["FEDERATION_SERVER_TEST"]) / 1e3;
      const second = [];
      for (let i = 0; i < 60; i = i + interval) {
        second.push(i);
      }
      rule.second = second;
    } else {
      rule.second = 0;
      rule.hour = [
        0,
        3,
        6,
        9,
        12,
        15,
        18
      ];
      rule.minute = 0;
    }
    const serverTest = Number(process.env["FEDERATION_SERVER_TEST"]);
    this._scheduleJob = import_node_schedule.default.scheduleJob(rule, () => {
      this._tmpSubscriberShelter.forEach((tmpSubscriber, identifier) => {
        fileLog(` _clearTmpSubScriberRelation ${identifier},  ${Date.now() - tmpSubscriber.timestamp >= (process.env["GARFISH_MODULE_SERVER_TEST"] ? serverTest : _Broker.DEFAULT_WAITING_TIME)}`, "Broker", "info");
        if (Date.now() - tmpSubscriber.timestamp >= (process.env["FEDERATION_SERVER_TEST"] ? serverTest : _Broker.DEFAULT_WAITING_TIME)) {
          this._clearTmpSubScriberRelation(identifier);
        }
      });
    });
  }
  _clearSchedule() {
    if (!this._scheduleJob) {
      return;
    }
    this._scheduleJob.cancel();
    this._scheduleJob = null;
  }
  _stopWhenSIGTERMOrSIGINT() {
    process.on("SIGTERM", () => {
      this.exit();
    });
    process.on("SIGINT", () => {
      this.exit();
    });
  }
  _handleUnexpectedExit() {
    process.on("unhandledRejection", (error2) => {
      console.error("Unhandled Rejection Error: ", error2);
      fileLog(`Unhandled Rejection Error: ${error2}`, "Broker", "fatal");
      process.exit(1);
    });
    process.on("uncaughtException", (error2) => {
      console.error("Unhandled Exception Error: ", error2);
      fileLog(`Unhandled Rejection Error: ${error2}`, "Broker", "fatal");
      process.exit(1);
    });
  }
  start() {
    return __async(this, null, function* () {
    });
  }
  exit() {
    const brokerExitLog = new BrokerExitLog();
    this.broadcast(JSON.stringify(brokerExitLog));
    this._disconnect();
    this._clearSchedule();
    this._clearTmpSubScriberRelations();
    this._webSocketServer && this._webSocketServer.close();
    this._secureWebSocketServer && this._secureWebSocketServer.close();
    process.exit(0);
  }
  broadcast(message) {
    var _a3, _b;
    fileLog(`[broadcast] exit info : ${JSON.stringify(message)}`, "Broker", "warn");
    (_a3 = this._webSocketServer) == null ? void 0 : _a3.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
    (_b = this._secureWebSocketServer) == null ? void 0 : _b.clients.forEach((client) => {
      client.send(JSON.stringify(message));
    });
  }
};
__name(_Broker, "Broker");
__publicField(_Broker, "WEB_SOCKET_CONNECT_MAGIC_ID", WEB_SOCKET_CONNECT_MAGIC_ID);
__publicField(_Broker, "DEFAULT_WEB_SOCKET_PORT", DEFAULT_WEB_SOCKET_PORT);
__publicField(_Broker, "DEFAULT_SECURE_WEB_SOCKET_PORT", 16324);
__publicField(_Broker, "DEFAULT_WAITING_TIME", 1.5 * 60 * 60 * 1e3);
var Broker = _Broker;

// packages/dts-plugin/src/server/createKoaServer.ts
var import_fs_extra2 = __toESM(require("fs-extra"));
var import_koa = __toESM(require("koa"));

// packages/dts-plugin/src/core/lib/archiveHandler.ts
var retrieveTypesZipPath = /* @__PURE__ */ __name((mfTypesPath, remoteOptions) => (0, import_path2.join)(mfTypesPath.replace(remoteOptions.typesFolder, ""), `${remoteOptions.typesFolder}.zip`), "retrieveTypesZipPath");
var createTypesArchive = /* @__PURE__ */ __name((tsConfig, remoteOptions) => __async(void 0, null, function* () {
  const mfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions);
  const zip = new import_adm_zip.default();
  zip.addLocalFolder(mfTypesPath);
  return zip.writeZipPromise(retrieveTypesZipPath(mfTypesPath, remoteOptions));
}), "createTypesArchive");
var downloadErrorLogger = /* @__PURE__ */ __name((destinationFolder, fileToDownload) => (reason) => {
  throw __spreadProps(__spreadValues({}, reason), {
    message: `Network error: Unable to download federated mocks for '${destinationFolder}' from '${fileToDownload}' because '${reason.message}'`
  });
}, "downloadErrorLogger");
var retrieveTypesArchiveDestinationPath = /* @__PURE__ */ __name((hostOptions, destinationFolder) => {
  return (0, import_path2.resolve)(hostOptions.context, hostOptions.typesFolder, destinationFolder);
}, "retrieveTypesArchiveDestinationPath");
var downloadTypesArchive = /* @__PURE__ */ __name((hostOptions) => {
  let retries = 0;
  return (_0) => __async(void 0, [_0], function* ([destinationFolder, fileToDownload]) {
    const destinationPath = retrieveTypesArchiveDestinationPath(hostOptions, destinationFolder);
    while (retries++ < hostOptions.maxRetries) {
      try {
        const url = fileToDownload;
        const response = yield axiosGet(url, {
          responseType: "arraybuffer"
        }).catch(downloadErrorLogger(destinationFolder, url));
        try {
          if (hostOptions.deleteTypesFolder) {
            yield (0, import_promises2.rm)(destinationPath, {
              recursive: true,
              force: true
            });
          }
        } catch (error2) {
          fileLog(`Unable to remove types folder, ${error2}`, "downloadTypesArchive", "error");
        }
        const zip = new import_adm_zip.default(Buffer.from(response.data));
        zip.extractAllTo(destinationPath, true);
        return [
          destinationFolder,
          destinationPath
        ];
      } catch (error2) {
        fileLog(`Error during types archive download: ${(error2 == null ? void 0 : error2.message) || "unknown error"}`, "downloadTypesArchive", "error");
        if (retries >= hostOptions.maxRetries) {
          if (hostOptions.abortOnError !== false) {
            throw error2;
          }
          return void 0;
        }
      }
    }
  });
}, "downloadTypesArchive");

// packages/dts-plugin/src/core/configurations/hostPlugin.ts
var import_sdk4 = require("@module-federation/sdk");
var import_managers = require("@module-federation/managers");
var defaultOptions = {
  typesFolder: "@mf-types",
  remoteTypesFolder: "@mf-types",
  deleteTypesFolder: true,
  maxRetries: 3,
  implementation: "",
  context: process.cwd(),
  abortOnError: true,
  consumeAPITypes: false,
  runtimePkgs: []
};
var buildZipUrl = /* @__PURE__ */ __name((hostOptions, url) => {
  const remoteUrl = new URL(url, "file:");
  const pathnameWithoutEntry = remoteUrl.pathname.split("/").slice(0, -1).join("/");
  remoteUrl.pathname = `${pathnameWithoutEntry}/${hostOptions.remoteTypesFolder}.zip`;
  return remoteUrl.protocol === "file:" ? remoteUrl.pathname : remoteUrl.href;
}, "buildZipUrl");
var buildApiTypeUrl = /* @__PURE__ */ __name((zipUrl) => {
  if (!zipUrl) {
    return void 0;
  }
  return zipUrl.replace(".zip", ".d.ts");
}, "buildApiTypeUrl");
var retrieveRemoteInfo = /* @__PURE__ */ __name((options) => {
  const { hostOptions, remoteAlias, remote } = options;
  let decodedRemote = remote;
  if (decodedRemote.startsWith(import_sdk4.ENCODE_NAME_PREFIX)) {
    decodedRemote = (0, import_sdk4.decodeName)(decodedRemote, import_sdk4.ENCODE_NAME_PREFIX);
  }
  const parsedInfo = (0, import_sdk4.parseEntry)(decodedRemote, void 0, "@");
  const url = "entry" in parsedInfo ? parsedInfo.entry : parsedInfo.name === decodedRemote ? decodedRemote : "";
  const zipUrl = url ? buildZipUrl(hostOptions, url) : "";
  return {
    name: parsedInfo.name || remoteAlias,
    url,
    zipUrl,
    apiTypeUrl: buildApiTypeUrl(zipUrl),
    alias: remoteAlias
  };
}, "retrieveRemoteInfo");
var resolveRemotes = /* @__PURE__ */ __name((hostOptions) => {
  const parsedOptions = import_managers.utils.parseOptions(hostOptions.moduleFederationConfig.remotes || {}, (item, key) => ({
    remote: Array.isArray(item) ? item[0] : item,
    key
  }), (item, key) => ({
    remote: Array.isArray(item.external) ? item.external[0] : item.external,
    key
  }));
  return parsedOptions.reduce((accumulator, item) => {
    const { key, remote } = item[1];
    accumulator[key] = retrieveRemoteInfo({
      hostOptions,
      remoteAlias: key,
      remote
    });
    return accumulator;
  }, {});
}, "resolveRemotes");
var retrieveHostConfig = /* @__PURE__ */ __name((options) => {
  validateOptions(options);
  const hostOptions = __spreadValues(__spreadValues({}, defaultOptions), options);
  const mapRemotesToDownload = resolveRemotes(hostOptions);
  return {
    hostOptions,
    mapRemotesToDownload
  };
}, "retrieveHostConfig");

// packages/dts-plugin/src/core/constant.ts
var REMOTE_ALIAS_IDENTIFIER = "REMOTE_ALIAS_IDENTIFIER";
var REMOTE_API_TYPES_FILE_NAME = "apis.d.ts";
var HOST_API_TYPES_FILE_NAME = "index.d.ts";

// packages/dts-plugin/src/core/lib/DTSManager.ts
var _a;
var DTSManager = (_a = class {
  constructor(options) {
    __publicField(this, "options");
    __publicField(this, "runtimePkgs");
    __publicField(this, "remoteAliasMap");
    __publicField(this, "loadedRemoteAPIAlias");
    __publicField(this, "extraOptions");
    __publicField(this, "updatedRemoteInfos");
    this.options = cloneDeepOptions(options);
    this.runtimePkgs = [
      "@module-federation/runtime",
      "@module-federation/enhanced/runtime",
      "@module-federation/runtime-tools"
    ];
    this.loadedRemoteAPIAlias = /* @__PURE__ */ new Set();
    this.remoteAliasMap = {};
    this.extraOptions = (options == null ? void 0 : options.extraOptions) || {};
    this.updatedRemoteInfos = {};
  }
  generateAPITypes(mapComponentsToExpose) {
    const exposePaths = /* @__PURE__ */ new Set();
    const packageType = Object.keys(mapComponentsToExpose).reduce((sum, exposeKey) => {
      const exposePath = import_path3.default.join(REMOTE_ALIAS_IDENTIFIER, exposeKey).split(import_path3.default.sep).join("/");
      exposePaths.add(`'${exposePath}'`);
      const curType = `T extends '${exposePath}' ? typeof import('${exposePath}') :`;
      sum = curType + sum;
      return sum;
    }, "any;");
    const exposePathKeys = [
      ...exposePaths
    ].join(" | ");
    return `
    export type RemoteKeys = ${exposePathKeys};
    type PackageType<T> = ${packageType}`;
  }
  extractRemoteTypes(options) {
    return __async(this, null, function* () {
      const { remoteOptions, tsConfig } = options;
      if (!remoteOptions.extractRemoteTypes) {
        return;
      }
      let hasRemotes = false;
      const remotes = remoteOptions.moduleFederationConfig.remotes;
      if (remotes) {
        if (Array.isArray(remotes)) {
          hasRemotes = Boolean(remotes.length);
        } else if (typeof remotes === "object") {
          hasRemotes = Boolean(Object.keys(remotes).length);
        }
      }
      const mfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions);
      if (hasRemotes) {
        const tempHostOptions = {
          moduleFederationConfig: remoteOptions.moduleFederationConfig,
          typesFolder: import_path3.default.join(mfTypesPath, "node_modules"),
          remoteTypesFolder: (remoteOptions == null ? void 0 : remoteOptions.hostRemoteTypesFolder) || remoteOptions.typesFolder,
          deleteTypesFolder: true,
          context: remoteOptions.context,
          implementation: remoteOptions.implementation,
          abortOnError: false
        };
        yield this.consumeArchiveTypes(tempHostOptions);
      }
    });
  }
  generateTypes() {
    return __async(this, null, function* () {
      var _a3;
      try {
        const { options } = this;
        if (!options.remote) {
          throw new Error("options.remote is required if you want to generateTypes");
        }
        const { remoteOptions, tsConfig, mapComponentsToExpose } = retrieveRemoteConfig(options.remote);
        if (!Object.keys(mapComponentsToExpose).length) {
          return;
        }
        yield this.extractRemoteTypes({
          remoteOptions,
          tsConfig,
          mapComponentsToExpose
        });
        yield compileTs(mapComponentsToExpose, tsConfig, remoteOptions);
        yield createTypesArchive(tsConfig, remoteOptions);
        let apiTypesPath = "";
        if (remoteOptions.generateAPITypes) {
          const apiTypes = this.generateAPITypes(mapComponentsToExpose);
          apiTypesPath = retrieveMfAPITypesPath(tsConfig, remoteOptions);
          import_fs.default.writeFileSync(apiTypesPath, apiTypes);
        }
        try {
          if (remoteOptions.deleteTypesFolder) {
            yield (0, import_promises3.rm)(retrieveMfTypesPath(tsConfig, remoteOptions), {
              recursive: true,
              force: true
            });
          }
        } catch (err) {
          if (isDebugMode()) {
            console.error(err);
          }
        }
        console.log(import_ansi_colors.default.green("Federated types created correctly"));
      } catch (error2) {
        if (((_a3 = this.options.remote) == null ? void 0 : _a3.abortOnError) === false) {
          console.error(import_ansi_colors.default.red(`Unable to compile federated types, ${error2}`));
        } else {
          throw error2;
        }
      }
    });
  }
  requestRemoteManifest(remoteInfo) {
    return __async(this, null, function* () {
      try {
        if (!remoteInfo.url.includes(import_sdk5.MANIFEST_EXT)) {
          return remoteInfo;
        }
        const url = remoteInfo.url;
        const res = yield axiosGet(url);
        const manifestJson = res.data;
        if (!manifestJson.metaData.types.zip) {
          throw new Error(`Can not get ${remoteInfo.name}'s types archive url!`);
        }
        const addProtocol = /* @__PURE__ */ __name((u) => {
          if (u.startsWith("//")) {
            return `https:${u}`;
          }
          return u;
        }, "addProtocol");
        let publicPath;
        if ("publicPath" in manifestJson.metaData) {
          publicPath = manifestJson.metaData.publicPath;
        } else {
          const getPublicPath = new Function(manifestJson.metaData.getPublicPath);
          if (manifestJson.metaData.getPublicPath.startsWith("function")) {
            publicPath = getPublicPath()();
          } else {
            publicPath = getPublicPath();
          }
        }
        if (publicPath === "auto") {
          publicPath = (0, import_sdk5.inferAutoPublicPath)(remoteInfo.url);
        }
        remoteInfo.zipUrl = new URL(import_path3.default.join(addProtocol(publicPath), manifestJson.metaData.types.zip)).href;
        if (!manifestJson.metaData.types.api) {
          console.warn(`Can not get ${remoteInfo.name}'s api types url!`);
          remoteInfo.apiTypeUrl = "";
          return remoteInfo;
        }
        remoteInfo.apiTypeUrl = new URL(import_path3.default.join(addProtocol(publicPath), manifestJson.metaData.types.api)).href;
        return remoteInfo;
      } catch (_err) {
        fileLog(`fetch manifest failed, ${_err}, ${remoteInfo.name} will be ignored`, "requestRemoteManifest", "error");
        return remoteInfo;
      }
    });
  }
  consumeTargetRemotes(hostOptions, remoteInfo) {
    return __async(this, null, function* () {
      if (!remoteInfo.zipUrl) {
        throw new Error(`Can not get ${remoteInfo.name}'s types archive url!`);
      }
      const typesDownloader = downloadTypesArchive(hostOptions);
      return typesDownloader([
        remoteInfo.alias,
        remoteInfo.zipUrl
      ]);
    });
  }
  downloadAPITypes(remoteInfo, destinationPath) {
    return __async(this, null, function* () {
      const { apiTypeUrl } = remoteInfo;
      if (!apiTypeUrl) {
        return;
      }
      try {
        const url = apiTypeUrl;
        const res = yield axiosGet(url);
        let apiTypeFile = res.data;
        apiTypeFile = apiTypeFile.replaceAll(REMOTE_ALIAS_IDENTIFIER, remoteInfo.alias);
        const filePath = import_path3.default.join(destinationPath, REMOTE_API_TYPES_FILE_NAME);
        import_fs.default.writeFileSync(filePath, apiTypeFile);
        this.loadedRemoteAPIAlias.add(remoteInfo.alias);
      } catch (err) {
        fileLog(`Unable to download "${remoteInfo.name}" api types, ${err}`, "consumeTargetRemotes", "error");
      }
    });
  }
  consumeAPITypes(hostOptions) {
    const apiTypeFileName = import_path3.default.join(hostOptions.context, hostOptions.typesFolder, HOST_API_TYPES_FILE_NAME);
    try {
      const existedFile = import_fs.default.readFileSync(apiTypeFileName, "utf-8");
      const existedImports = new import_third_party_dts_extractor2.ThirdPartyExtractor("").collectTypeImports(existedFile);
      existedImports.forEach((existedImport) => {
        const alias = existedImport.split("./").slice(1).join("./").replace("/apis.d.ts", "");
        this.loadedRemoteAPIAlias.add(alias);
      });
    } catch (err) {
    }
    if (!this.loadedRemoteAPIAlias.size) {
      return;
    }
    const packageTypes = [];
    const remoteKeys = [];
    const importTypeStr = [
      ...this.loadedRemoteAPIAlias
    ].sort().map((alias, index) => {
      const remoteKey = `RemoteKeys_${index}`;
      const packageType = `PackageType_${index}`;
      packageTypes.push(`T extends ${remoteKey} ? ${packageType}<T>`);
      remoteKeys.push(remoteKey);
      return `import type { PackageType as ${packageType},RemoteKeys as ${remoteKey} } from './${alias}/apis.d.ts';`;
    }).join("\n");
    const remoteKeysStr = `type RemoteKeys = ${remoteKeys.join(" | ")};`;
    const packageTypesStr = `type PackageType<T, Y=any> = ${[
      ...packageTypes,
      "Y"
    ].join(" :\n")} ;`;
    const runtimePkgs = /* @__PURE__ */ new Set();
    [
      ...this.runtimePkgs,
      ...hostOptions.runtimePkgs
    ].forEach((pkg) => {
      runtimePkgs.add(pkg);
    });
    const pkgsDeclareStr = [
      ...runtimePkgs
    ].map((pkg) => {
      return `declare module "${pkg}" {
      ${remoteKeysStr}
      ${packageTypesStr}
      export function loadRemote<T extends RemoteKeys,Y>(packageName: T): Promise<PackageType<T, Y>>;
      export function loadRemote<T extends string,Y>(packageName: T): Promise<PackageType<T, Y>>;
    }`;
    }).join("\n");
    const fileStr = `${importTypeStr}
    ${pkgsDeclareStr}
    `;
    import_fs.default.writeFileSync(import_path3.default.join(hostOptions.context, hostOptions.typesFolder, HOST_API_TYPES_FILE_NAME), fileStr);
  }
  consumeArchiveTypes(options) {
    return __async(this, null, function* () {
      const { hostOptions, mapRemotesToDownload } = retrieveHostConfig(options);
      const downloadPromises = Object.entries(mapRemotesToDownload).map((item) => __async(this, null, function* () {
        const remoteInfo = item[1];
        if (!this.remoteAliasMap[remoteInfo.alias]) {
          const requiredRemoteInfo = yield this.requestRemoteManifest(remoteInfo);
          this.remoteAliasMap[remoteInfo.alias] = requiredRemoteInfo;
        }
        return this.consumeTargetRemotes(hostOptions, this.remoteAliasMap[remoteInfo.alias]);
      }));
      const downloadPromisesResult = yield Promise.allSettled(downloadPromises);
      return {
        hostOptions,
        downloadPromisesResult
      };
    });
  }
  consumeTypes() {
    return __async(this, null, function* () {
      var _a3;
      try {
        const { options } = this;
        if (!options.host) {
          throw new Error("options.host is required if you want to consumeTypes");
        }
        const { mapRemotesToDownload } = retrieveHostConfig(options.host);
        if (!Object.keys(mapRemotesToDownload).length) {
          return;
        }
        const { downloadPromisesResult, hostOptions } = yield this.consumeArchiveTypes(options.host);
        if (hostOptions.consumeAPITypes) {
          yield Promise.all(downloadPromisesResult.map((item) => __async(this, null, function* () {
            if (item.status === "rejected" || !item.value) {
              return;
            }
            const [alias, destinationPath] = item.value;
            const remoteInfo = this.remoteAliasMap[alias];
            if (!remoteInfo) {
              return;
            }
            yield this.downloadAPITypes(remoteInfo, destinationPath);
          })));
          this.consumeAPITypes(hostOptions);
        }
        console.log(import_ansi_colors.default.green("Federated types extraction completed"));
      } catch (err) {
        if (((_a3 = this.options.host) == null ? void 0 : _a3.abortOnError) === false) {
          fileLog(`Unable to consume federated types, ${err}`, "consumeTypes", "error");
        } else {
          throw err;
        }
      }
    });
  }
  updateTypes(options) {
    return __async(this, null, function* () {
      var _a3, _b, _c;
      try {
        const { remoteName, updateMode, remoteInfo: updatedRemoteInfo, once } = options;
        const hostName = (_c = (_b = (_a3 = this.options) == null ? void 0 : _a3.host) == null ? void 0 : _b.moduleFederationConfig) == null ? void 0 : _c.name;
        fileLog(`updateTypes options:, ${JSON.stringify(options, null, 2)}`, "consumeTypes", "info");
        if (updateMode === UpdateMode.POSITIVE && remoteName === hostName) {
          if (!this.options.remote) {
            return;
          }
          yield this.generateTypes();
        } else {
          const { remoteAliasMap } = this;
          if (!this.options.host) {
            return;
          }
          const { hostOptions, mapRemotesToDownload } = retrieveHostConfig(this.options.host);
          const loadedRemoteInfo = Object.values(remoteAliasMap).find((i) => i.name === remoteName);
          const consumeTypes2 = /* @__PURE__ */ __name((requiredRemoteInfo) => __async(this, null, function* () {
            const [_alias, destinationPath] = yield this.consumeTargetRemotes(hostOptions, requiredRemoteInfo);
            yield this.downloadAPITypes(requiredRemoteInfo, destinationPath);
          }), "consumeTypes");
          if (!loadedRemoteInfo) {
            const remoteInfo = Object.values(mapRemotesToDownload).find((item) => {
              return item.name === remoteName;
            });
            if (remoteInfo) {
              if (!this.remoteAliasMap[remoteInfo.alias]) {
                const requiredRemoteInfo = yield this.requestRemoteManifest(remoteInfo);
                this.remoteAliasMap[remoteInfo.alias] = requiredRemoteInfo;
              }
              yield consumeTypes2(this.remoteAliasMap[remoteInfo.alias]);
            } else if (updatedRemoteInfo) {
              const consumeDynamicRemoteTypes = /* @__PURE__ */ __name(() => __async(this, null, function* () {
                yield consumeTypes2(this.updatedRemoteInfos[updatedRemoteInfo.name]);
                this.consumeAPITypes(hostOptions);
              }), "consumeDynamicRemoteTypes");
              if (!this.updatedRemoteInfos[updatedRemoteInfo.name]) {
                const parsedRemoteInfo = retrieveRemoteInfo({
                  hostOptions,
                  remoteAlias: updatedRemoteInfo.alias || updatedRemoteInfo.name,
                  remote: updatedRemoteInfo.url
                });
                fileLog(`start request manifest`, "consumeTypes", "info");
                this.updatedRemoteInfos[updatedRemoteInfo.name] = yield this.requestRemoteManifest(parsedRemoteInfo);
                fileLog(`end request manifest, this.updatedRemoteInfos[updatedRemoteInfo.name]: ${JSON.stringify(this.updatedRemoteInfos[updatedRemoteInfo.name], null, 2)}`, "consumeTypes", "info");
                yield consumeDynamicRemoteTypes();
              }
              if (!once && this.updatedRemoteInfos[updatedRemoteInfo.name]) {
                yield consumeDynamicRemoteTypes();
              }
            }
          } else {
            yield consumeTypes2(loadedRemoteInfo);
          }
        }
      } catch (err) {
        fileLog(`updateTypes fail, ${err}`, "updateTypes", "error");
      }
    });
  }
}, __name(_a, "DTSManager"), _a);

// packages/dts-plugin/src/core/lib/utils.ts
var import_lodash = __toESM(require("lodash.clonedeepwith"));
function getDTSManagerConstructor(implementation) {
  if (implementation) {
    const NewConstructor = require(implementation);
    return NewConstructor.default ? NewConstructor.default : NewConstructor;
  }
  return DTSManager;
}
__name(getDTSManagerConstructor, "getDTSManagerConstructor");
var validateOptions = /* @__PURE__ */ __name((options) => {
  if (!options.moduleFederationConfig) {
    throw new Error("moduleFederationConfig is required");
  }
}, "validateOptions");
function retrieveTypesAssetsInfo(options) {
  const { moduleFederationConfig } = options;
  let apiTypesPath = "";
  let zipTypesPath = "";
  let zipPrefix = "";
  try {
    const { tsConfig, remoteOptions, mapComponentsToExpose } = retrieveRemoteConfig(options);
    if (!Object.keys(mapComponentsToExpose).length) {
      return {
        zipPrefix,
        apiTypesPath,
        zipTypesPath,
        zipName: "",
        apiFileName: ""
      };
    }
    const mfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions);
    zipTypesPath = retrieveTypesZipPath(mfTypesPath, remoteOptions);
    if (remoteOptions.generateAPITypes) {
      apiTypesPath = retrieveMfAPITypesPath(tsConfig, remoteOptions);
    }
    if (typeof moduleFederationConfig.manifest === "object" && moduleFederationConfig.manifest.filePath) {
      zipPrefix = moduleFederationConfig.manifest.filePath;
    } else if (typeof moduleFederationConfig.manifest === "object" && moduleFederationConfig.manifest.fileName) {
      zipPrefix = import_path4.default.dirname(moduleFederationConfig.manifest.fileName);
    } else if (moduleFederationConfig.filename) {
      zipPrefix = import_path4.default.dirname(moduleFederationConfig.filename);
    }
    return {
      zipPrefix,
      apiTypesPath,
      zipTypesPath,
      zipName: import_path4.default.basename(zipTypesPath),
      apiFileName: import_path4.default.basename(apiTypesPath)
    };
  } catch (err) {
    console.error(import_ansi_colors2.default.red(`Unable to compile federated types, ${err}`));
    return {
      zipPrefix,
      apiTypesPath: "",
      zipTypesPath: "",
      zipName: "",
      apiFileName: ""
    };
  }
}
__name(retrieveTypesAssetsInfo, "retrieveTypesAssetsInfo");
function isDebugMode() {
  return Boolean(process.env["FEDERATION_DEBUG"]) || process.env["NODE_ENV"] === "test";
}
__name(isDebugMode, "isDebugMode");
var isTSProject = /* @__PURE__ */ __name((dtsOptions, context = process.cwd()) => {
  if (dtsOptions === false) {
    return false;
  }
  try {
    let filepath = "";
    if (typeof dtsOptions === "object" && dtsOptions.tsConfigPath) {
      filepath = dtsOptions.tsConfigPath;
    } else {
      filepath = import_path4.default.resolve(context, "./tsconfig.json");
    }
    if (!import_path4.default.isAbsolute(filepath)) {
      filepath = import_path4.default.resolve(context, filepath);
    }
    return import_fs2.default.existsSync(filepath);
  } catch (err) {
    return false;
  }
}, "isTSProject");
function cloneDeepOptions(options) {
  const excludeKeys = [
    "manifest",
    "async"
  ];
  return (0, import_lodash.default)(options, (_value, key) => {
    if (typeof key === "string" && excludeKeys.includes(key)) {
      return false;
    }
  });
}
__name(cloneDeepOptions, "cloneDeepOptions");
function axiosGet(url, config) {
  return __async(this, null, function* () {
    const httpAgent = new import_http2.default.Agent({
      family: 4
    });
    const httpsAgent = new import_https.default.Agent({
      family: 4
    });
    return import_axios.default.get(url, __spreadValues({
      httpAgent,
      httpsAgent
    }, config));
  });
}
__name(axiosGet, "axiosGet");

// packages/dts-plugin/src/core/configurations/remotePlugin.ts
var defaultOptions2 = {
  tsConfigPath: "./tsconfig.json",
  typesFolder: "@mf-types",
  compiledTypesFolder: "compiled-types",
  hostRemoteTypesFolder: "@mf-types",
  deleteTypesFolder: true,
  additionalFilesToCompile: [],
  compilerInstance: "tsc",
  compileInChildProcess: false,
  implementation: "",
  generateAPITypes: false,
  context: process.cwd(),
  abortOnError: true,
  extractRemoteTypes: false,
  extractThirdParty: false
};
function getEffectiveRootDir(parsedCommandLine) {
  const compilerOptions = parsedCommandLine.options;
  if (compilerOptions.rootDir) {
    return compilerOptions.rootDir;
  }
  const files = parsedCommandLine.fileNames;
  if (files.length > 0) {
    const commonRoot = files.map((file) => (0, import_path5.dirname)(file)).reduce((commonPath, fileDir) => {
      while (!fileDir.startsWith(commonPath)) {
        commonPath = (0, import_path5.dirname)(commonPath);
      }
      return commonPath;
    }, files[0]);
    return commonRoot;
  }
  throw new Error("Can not get effective rootDir, please set compilerOptions.rootDir !");
}
__name(getEffectiveRootDir, "getEffectiveRootDir");
var readTsConfig = /* @__PURE__ */ __name(({ tsConfigPath, typesFolder, compiledTypesFolder, context, additionalFilesToCompile }, mapComponentsToExpose) => {
  const resolvedTsConfigPath = (0, import_path5.resolve)(context, tsConfigPath);
  const readResult = import_typescript.default.readConfigFile(resolvedTsConfigPath, import_typescript.default.sys.readFile);
  if (readResult.error) {
    throw new Error(readResult.error.messageText.toString());
  }
  const rawTsConfigJson = readResult.config;
  const configContent = import_typescript.default.parseJsonConfigFileContent(rawTsConfigJson, import_typescript.default.sys, (0, import_path5.dirname)(resolvedTsConfigPath));
  const rootDir = getEffectiveRootDir(configContent);
  const outDir = (0, import_path5.resolve)(context, configContent.options.outDir || "dist", typesFolder, compiledTypesFolder);
  const defaultCompilerOptions = {
    rootDir,
    emitDeclarationOnly: true,
    noEmit: false,
    declaration: true,
    outDir
  };
  rawTsConfigJson.compilerOptions = rawTsConfigJson.compilerOptions || {};
  rawTsConfigJson.compilerOptions = __spreadValues(__spreadValues({}, rawTsConfigJson.compilerOptions), defaultCompilerOptions);
  const _a3 = rawTsConfigJson.compilerOptions || {}, { paths, baseUrl } = _a3, restCompilerOptions = __objRest(_a3, ["paths", "baseUrl"]);
  rawTsConfigJson.compilerOptions = restCompilerOptions;
  const filesToCompile = [
    ...Object.values(mapComponentsToExpose),
    ...configContent.fileNames.filter((filename) => filename.endsWith(".d.ts")),
    ...additionalFilesToCompile
  ];
  rawTsConfigJson.include = [];
  rawTsConfigJson.files = filesToCompile;
  rawTsConfigJson.exclude = [];
  "references" in rawTsConfigJson && delete rawTsConfigJson.references;
  rawTsConfigJson.extends = resolvedTsConfigPath;
  return rawTsConfigJson;
}, "readTsConfig");
var TS_EXTENSIONS = [
  "ts",
  "tsx",
  "vue",
  "svelte"
];
var resolveWithExtension = /* @__PURE__ */ __name((exposedPath, context) => {
  if ((0, import_path5.extname)(exposedPath)) {
    return (0, import_path5.resolve)(context, exposedPath);
  }
  for (const extension of TS_EXTENSIONS) {
    const exposedPathWithExtension = (0, import_path5.resolve)(context, `${exposedPath}.${extension}`);
    if ((0, import_fs3.existsSync)(exposedPathWithExtension)) {
      return exposedPathWithExtension;
    }
  }
  return void 0;
}, "resolveWithExtension");
var resolveExposes = /* @__PURE__ */ __name((remoteOptions) => {
  const parsedOptions = import_managers2.utils.parseOptions(remoteOptions.moduleFederationConfig.exposes || {}, (item, key) => ({
    exposePath: Array.isArray(item) ? item[0] : item,
    key
  }), (item, key) => ({
    exposePath: Array.isArray(item.import) ? item.import[0] : item.import[0],
    key
  }));
  return parsedOptions.reduce((accumulator, item) => {
    const { exposePath, key } = item[1];
    accumulator[key] = resolveWithExtension(exposePath, remoteOptions.context) || resolveWithExtension((0, import_path5.join)(exposePath, "index"), remoteOptions.context) || exposePath;
    return accumulator;
  }, {});
}, "resolveExposes");
var retrieveRemoteConfig = /* @__PURE__ */ __name((options) => {
  validateOptions(options);
  const remoteOptions = __spreadValues(__spreadValues({}, defaultOptions2), options);
  const mapComponentsToExpose = resolveExposes(remoteOptions);
  const tsConfig = readTsConfig(remoteOptions, mapComponentsToExpose);
  return {
    tsConfig,
    mapComponentsToExpose,
    remoteOptions
  };
}, "retrieveRemoteConfig");

// packages/dts-plugin/src/core/lib/generateTypes.ts
function generateTypes(options) {
  return __async(this, null, function* () {
    var _a3;
    const DTSManagerConstructor = getDTSManagerConstructor((_a3 = options.remote) == null ? void 0 : _a3.implementation);
    const dtsManager = new DTSManagerConstructor(options);
    return dtsManager.generateTypes();
  });
}
__name(generateTypes, "generateTypes");

// packages/dts-plugin/src/core/lib/DtsWorker.ts
var import_path6 = __toESM(require("path"));

// packages/dts-plugin/src/core/rpc/index.ts
var rpc_exports = {};
__export(rpc_exports, {
  RpcExitError: () => RpcExitError,
  RpcGMCallTypes: () => RpcGMCallTypes,
  createRpcWorker: () => createRpcWorker,
  exposeRpc: () => exposeRpc,
  getRpcWorkerData: () => getRpcWorkerData,
  wrapRpc: () => wrapRpc
});

// packages/dts-plugin/src/core/rpc/expose-rpc.ts
var import_process = __toESM(require("process"));

// packages/dts-plugin/src/core/rpc/types.ts
var RpcGMCallTypes;
(function(RpcGMCallTypes2) {
  RpcGMCallTypes2["CALL"] = "mf_call";
  RpcGMCallTypes2["RESOLVE"] = "mf_resolve";
  RpcGMCallTypes2["REJECT"] = "mf_reject";
  RpcGMCallTypes2["EXIT"] = "mf_exit";
})(RpcGMCallTypes || (RpcGMCallTypes = {}));

// packages/dts-plugin/src/core/rpc/expose-rpc.ts
function exposeRpc(fn) {
  const sendMessage = /* @__PURE__ */ __name((message) => new Promise((resolve4, reject) => {
    if (!import_process.default.send) {
      reject(new Error(`Process ${import_process.default.pid} doesn't have IPC channels`));
    } else if (!import_process.default.connected) {
      reject(new Error(`Process ${import_process.default.pid} doesn't have open IPC channels`));
    } else {
      import_process.default.send(message, void 0, void 0, (error2) => {
        if (error2) {
          reject(error2);
        } else {
          resolve4(void 0);
        }
      });
    }
  }), "sendMessage");
  const handleMessage = /* @__PURE__ */ __name((message) => __async(this, null, function* () {
    if (message.type === RpcGMCallTypes.CALL) {
      if (!import_process.default.send) {
        return;
      }
      let value, error2;
      try {
        value = yield fn(...message.args);
      } catch (fnError) {
        error2 = fnError;
      }
      try {
        if (error2) {
          yield sendMessage({
            type: RpcGMCallTypes.REJECT,
            id: message.id,
            error: error2
          });
        } else {
          yield sendMessage({
            type: RpcGMCallTypes.RESOLVE,
            id: message.id,
            value
          });
        }
      } catch (sendError) {
        if (error2) {
          if (error2 instanceof Error) {
            console.error(error2);
          }
        }
        console.error(sendError);
      }
    }
  }), "handleMessage");
  import_process.default.on("message", handleMessage);
}
__name(exposeRpc, "exposeRpc");

// packages/dts-plugin/src/core/rpc/rpc-error.ts
var _a2;
var RpcExitError = (_a2 = class extends Error {
  constructor(message, code, signal) {
    super(message);
    __publicField(this, "code");
    __publicField(this, "signal");
    this.code = code;
    this.signal = signal;
    this.name = "RpcExitError";
  }
}, __name(_a2, "RpcExitError"), _a2);

// packages/dts-plugin/src/core/rpc/wrap-rpc.ts
function createControlledPromise() {
  let resolve4 = /* @__PURE__ */ __name(() => void 0, "resolve");
  let reject = /* @__PURE__ */ __name(() => void 0, "reject");
  const promise = new Promise((aResolve, aReject) => {
    resolve4 = aResolve;
    reject = aReject;
  });
  return {
    promise,
    resolve: resolve4,
    reject
  };
}
__name(createControlledPromise, "createControlledPromise");
function wrapRpc(childProcess, options) {
  return (...args) => __async(this, null, function* () {
    if (!childProcess.send) {
      throw new Error(`Process ${childProcess.pid} doesn't have IPC channels`);
    } else if (!childProcess.connected) {
      throw new Error(`Process ${childProcess.pid} doesn't have open IPC channels`);
    }
    const { id, once } = options;
    const { promise: resultPromise, resolve: resolveResult, reject: rejectResult } = createControlledPromise();
    const { promise: sendPromise, resolve: resolveSend, reject: rejectSend } = createControlledPromise();
    const handleMessage = /* @__PURE__ */ __name((message) => {
      if ((message == null ? void 0 : message.id) === id) {
        if (message.type === RpcGMCallTypes.RESOLVE) {
          resolveResult(message.value);
        } else if (message.type === RpcGMCallTypes.REJECT) {
          rejectResult(message.error);
        }
      }
      if (once && (childProcess == null ? void 0 : childProcess.kill)) {
        childProcess.kill("SIGTERM");
      }
    }, "handleMessage");
    const handleClose = /* @__PURE__ */ __name((code, signal) => {
      rejectResult(new RpcExitError(code ? `Process ${childProcess.pid} exited with code ${code}${signal ? ` [${signal}]` : ""}` : `Process ${childProcess.pid} exited${signal ? ` [${signal}]` : ""}`, code, signal));
      removeHandlers();
    }, "handleClose");
    const removeHandlers = /* @__PURE__ */ __name(() => {
      childProcess.off("message", handleMessage);
      childProcess.off("close", handleClose);
    }, "removeHandlers");
    if (once) {
      childProcess.once("message", handleMessage);
    } else {
      childProcess.on("message", handleMessage);
    }
    childProcess.on("close", handleClose);
    childProcess.send({
      type: RpcGMCallTypes.CALL,
      id,
      args
    }, (error2) => {
      if (error2) {
        rejectSend(error2);
        removeHandlers();
      } else {
        resolveSend(void 0);
      }
    });
    return sendPromise.then(() => resultPromise);
  });
}
__name(wrapRpc, "wrapRpc");

// packages/dts-plugin/src/core/rpc/rpc-worker.ts
var child_process = __toESM(require("child_process"));
var process3 = __toESM(require("process"));
var import_crypto2 = require("crypto");
var FEDERATION_WORKER_DATA_ENV_KEY = "VMOK_WORKER_DATA_ENV";
function createRpcWorker(modulePath, data, memoryLimit, once) {
  const options = {
    env: __spreadProps(__spreadValues({}, process3.env), {
      [FEDERATION_WORKER_DATA_ENV_KEY]: JSON.stringify(data || {})
    }),
    stdio: [
      "inherit",
      "inherit",
      "inherit",
      "ipc"
    ],
    serialization: "advanced"
  };
  if (memoryLimit) {
    options.execArgv = [
      `--max-old-space-size=${memoryLimit}`
    ];
  }
  let childProcess, remoteMethod;
  const id = (0, import_crypto2.randomUUID)();
  const worker = {
    connect(...args) {
      if (childProcess && !childProcess.connected) {
        childProcess.send({
          type: RpcGMCallTypes.EXIT,
          id
        });
        childProcess = void 0;
        remoteMethod = void 0;
      }
      if (!(childProcess == null ? void 0 : childProcess.connected)) {
        childProcess = child_process.fork(modulePath, options);
        remoteMethod = wrapRpc(childProcess, {
          id,
          once
        });
      }
      if (!remoteMethod) {
        return Promise.reject(new Error("Worker is not connected - cannot perform RPC."));
      }
      return remoteMethod(...args);
    },
    terminate() {
      try {
        if (childProcess.connected) {
          childProcess.send({
            type: RpcGMCallTypes.EXIT,
            id
          }, (err) => {
            if (err) {
              console.error("Error sending message:", err);
            }
          });
        }
      } catch (error2) {
        if (error2.code === "EPIPE") {
          console.error("Pipe closed before message could be sent:", error2);
        } else {
          console.error("Unexpected error:", error2);
        }
      }
      childProcess = void 0;
      remoteMethod = void 0;
    },
    get connected() {
      return Boolean(childProcess == null ? void 0 : childProcess.connected);
    },
    get process() {
      return childProcess;
    },
    get id() {
      return id;
    }
  };
  return worker;
}
__name(createRpcWorker, "createRpcWorker");
function getRpcWorkerData() {
  return JSON.parse(process3.env[FEDERATION_WORKER_DATA_ENV_KEY] || "{}");
}
__name(getRpcWorkerData, "getRpcWorkerData");

// packages/dts-plugin/src/core/lib/DtsWorker.ts
var _DtsWorker = class _DtsWorker {
  constructor(options) {
    __publicField(this, "rpcWorker");
    __publicField(this, "_options");
    __publicField(this, "_res");
    this._options = cloneDeepOptions(options);
    this.removeUnSerializationOptions();
    this.rpcWorker = createRpcWorker(import_path6.default.resolve(__dirname, "./fork-generate-dts.js"), {}, void 0, true);
    this._res = this.rpcWorker.connect(this._options);
  }
  removeUnSerializationOptions() {
    var _a3, _b, _c, _d, _e, _f, _g, _h;
    if ((_b = (_a3 = this._options.remote) == null ? void 0 : _a3.moduleFederationConfig) == null ? void 0 : _b.manifest) {
      (_d = (_c = this._options.remote) == null ? void 0 : _c.moduleFederationConfig) == null ? true : delete _d.manifest;
    }
    if ((_f = (_e = this._options.host) == null ? void 0 : _e.moduleFederationConfig) == null ? void 0 : _f.manifest) {
      (_h = (_g = this._options.host) == null ? void 0 : _g.moduleFederationConfig) == null ? true : delete _h.manifest;
    }
  }
  get controlledPromise() {
    const ensureChildProcessExit = /* @__PURE__ */ __name(() => {
      var _a3;
      try {
        const pid = (_a3 = this.rpcWorker.process) == null ? void 0 : _a3.pid;
        const rootPid = process.pid;
        if (pid && rootPid !== pid) {
          process.kill(pid, 0);
        }
      } catch (error2) {
        if (isDebugMode()) {
          console.error(error2);
        }
      }
    }, "ensureChildProcessExit");
    return Promise.resolve(this._res).then(() => {
      this.exit();
      ensureChildProcessExit();
    }).catch((err) => {
      if (isDebugMode()) {
        console.error(err);
      }
      ensureChildProcessExit();
    });
  }
  exit() {
    var _a3;
    try {
      (_a3 = this.rpcWorker) == null ? void 0 : _a3.terminate();
    } catch (err) {
      if (isDebugMode()) {
        console.error(err);
      }
    }
  }
};
__name(_DtsWorker, "DtsWorker");
var DtsWorker = _DtsWorker;

// packages/dts-plugin/src/core/lib/generateTypesInChildProcess.ts
function generateTypesInChildProcess(options) {
  return __async(this, null, function* () {
    const dtsWorker = new DtsWorker(options);
    return dtsWorker.controlledPromise;
  });
}
__name(generateTypesInChildProcess, "generateTypesInChildProcess");

// packages/dts-plugin/src/core/lib/consumeTypes.ts
function consumeTypes(options) {
  return __async(this, null, function* () {
    var _a3;
    const DTSManagerConstructor = getDTSManagerConstructor((_a3 = options.host) == null ? void 0 : _a3.implementation);
    const dtsManager = new DTSManagerConstructor(options);
    yield dtsManager.consumeTypes();
  });
}
__name(consumeTypes, "consumeTypes");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  DTSManager,
  DtsWorker,
  HOST_API_TYPES_FILE_NAME,
  REMOTE_ALIAS_IDENTIFIER,
  REMOTE_API_TYPES_FILE_NAME,
  consumeTypes,
  generateTypes,
  generateTypesInChildProcess,
  getDTSManagerConstructor,
  isTSProject,
  retrieveHostConfig,
  retrieveMfTypesPath,
  retrieveOriginalOutDir,
  retrieveRemoteConfig,
  retrieveTypesAssetsInfo,
  retrieveTypesZipPath,
  rpc,
  validateOptions
});
