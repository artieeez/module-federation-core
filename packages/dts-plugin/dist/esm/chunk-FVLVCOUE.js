import {
  APIKind,
  Broker,
  LogKind,
  fib,
  fileLog,
  getFreePort,
  getIPV4,
  getIdentifier
} from "./chunk-MY3H5SQO.js";
import {
  AddPublisherAction,
  AddSubscriberAction,
  DEFAULT_TAR_NAME,
  ExitPublisherAction,
  ExitSubscriberAction,
  MF_SERVER_IDENTIFIER,
  NotifyWebClientAction,
  UpdateKind,
  UpdateMode,
  UpdatePublisherAction,
  __async,
  __name,
  __objRest,
  __publicField,
  __require,
  __spreadProps,
  __spreadValues
} from "./chunk-4CSLH7II.js";

// packages/dts-plugin/src/core/lib/typeScriptCompiler.ts
import { ensureDirSync, writeFileSync, existsSync } from "fs-extra";
import crypto from "crypto";
import { stat, readdir, writeFile, rm, readFile } from "fs/promises";
import { dirname, join, normalize, relative, resolve, sep, extname, isAbsolute } from "path";
import { ThirdPartyExtractor } from "@module-federation/third-party-dts-extractor";
import { exec } from "child_process";
import util from "util";
import { TEMP_DIR } from "@module-federation/sdk";
var STARTS_WITH_SLASH = /^\//;
var DEFINITION_FILE_EXTENSION = ".d.ts";
var retrieveMfTypesPath = /* @__PURE__ */ __name((tsConfig, remoteOptions) => normalize(tsConfig.compilerOptions.outDir.replace(remoteOptions.compiledTypesFolder, "")), "retrieveMfTypesPath");
var retrieveOriginalOutDir = /* @__PURE__ */ __name((tsConfig, remoteOptions) => normalize(tsConfig.compilerOptions.outDir.replace(remoteOptions.compiledTypesFolder, "").replace(remoteOptions.typesFolder, "")), "retrieveOriginalOutDir");
var retrieveMfAPITypesPath = /* @__PURE__ */ __name((tsConfig, remoteOptions) => join(retrieveOriginalOutDir(tsConfig, remoteOptions), `${remoteOptions.typesFolder}.d.ts`), "retrieveMfAPITypesPath");
function writeTempTsConfig(tsConfig, context, name) {
  const createHash = /* @__PURE__ */ __name((contents) => {
    return crypto.createHash("md5").update(contents).digest("hex");
  }, "createHash");
  const hash = createHash(`${JSON.stringify(tsConfig)}${name}`);
  const tempTsConfigJsonPath = resolve(context, "node_modules", TEMP_DIR, `tsconfig.${hash}.json`);
  ensureDirSync(dirname(tempTsConfigJsonPath));
  writeFileSync(tempTsConfigJsonPath, JSON.stringify(tsConfig, null, 2));
  return tempTsConfigJsonPath;
}
__name(writeTempTsConfig, "writeTempTsConfig");
var removeExt = /* @__PURE__ */ __name((f) => {
  const ext = extname(f);
  const regexPattern = new RegExp(`\\${ext}$`);
  return f.replace(regexPattern, "");
}, "removeExt");
function getExposeKey(options) {
  const { filePath, rootDir, outDir, mapExposeToEntry } = options;
  const relativeFilePath = relative(outDir, filePath.replace(new RegExp(`\\.d.ts$`), ""));
  return mapExposeToEntry[relativeFilePath];
}
__name(getExposeKey, "getExposeKey");
var processTypesFile = /* @__PURE__ */ __name((options) => __async(void 0, null, function* () {
  const { outDir, filePath, rootDir, cb, mapExposeToEntry, mfTypePath } = options;
  if (!existsSync(filePath)) {
    return;
  }
  const stats = yield stat(filePath);
  if (stats.isDirectory()) {
    const files = yield readdir(filePath);
    yield Promise.all(files.map((file) => processTypesFile(__spreadProps(__spreadValues({}, options), {
      filePath: join(filePath, file)
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
      const mfeTypeEntry = join(mfTypePath, `${sourceEntry}${DEFINITION_FILE_EXTENSION}`);
      const mfeTypeEntryDirectory = dirname(mfeTypeEntry);
      const relativePathToOutput = relative(mfeTypeEntryDirectory, filePath).replace(DEFINITION_FILE_EXTENSION, "").replace(STARTS_WITH_SLASH, "").split(sep).join("/");
      ensureDirSync(mfeTypeEntryDirectory);
      yield writeFile(mfeTypeEntry, `export * from './${relativePathToOutput}';
export { default } from './${relativePathToOutput}';`);
    }
    const content = yield readFile(filePath, "utf8");
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
    const thirdPartyExtractor = new ThirdPartyExtractor(resolve(mfTypePath, "node_modules"), remoteOptions.context);
    const execPromise = util.promisify(exec);
    const cmd = `npx ${remoteOptions.compilerInstance} --project ${tempTsConfigJsonPath}`;
    try {
      yield execPromise(cmd);
    } catch (err) {
      throw new Error(`compile TS failed, the original command is '${cmd}'`);
    }
    const mapExposeToEntry = Object.fromEntries(Object.entries(mapComponentsToExpose).map(([exposed, filename]) => {
      const normalizedFileName = normalize(filename);
      let relativeFileName = "";
      if (isAbsolute(normalizedFileName)) {
        relativeFileName = relative(tsConfig.compilerOptions.rootDir, normalizedFileName);
      } else {
        relativeFileName = relative(tsConfig.compilerOptions.rootDir, resolve(remoteOptions.context, normalizedFileName));
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
    yield rm(tempTsConfigJsonPath);
  } catch (err) {
    throw err;
  }
}), "compileTs");

// packages/dts-plugin/src/server/DevServer.ts
import WebSocket from "isomorphic-ws";

// packages/dts-plugin/src/server/broker/createBroker.ts
import { fork } from "child_process";
import path from "path";
function createBroker() {
  const startBrokerPath = path.resolve(__dirname, "./start-broker.js");
  const sub = fork(startBrokerPath, [], {
    detached: true,
    stdio: "ignore",
    env: process.env
  });
  sub.send("start");
  sub.unref();
  return sub;
}
__name(createBroker, "createBroker");

// packages/dts-plugin/src/server/DevServer.ts
var _ModuleFederationDevServer = class _ModuleFederationDevServer {
  constructor(ctx) {
    __publicField(this, "_remotes");
    __publicField(this, "_ip");
    __publicField(this, "_name");
    __publicField(this, "_remoteTypeTarPath");
    __publicField(this, "_publishWebSocket", null);
    __publicField(this, "_subscriberWebsocketMap", {});
    __publicField(this, "_reconnect", true);
    __publicField(this, "_reconnectTimes", 0);
    __publicField(this, "_isConnected", false);
    __publicField(this, "_isReconnecting", false);
    __publicField(this, "_updateCallback", /* @__PURE__ */ __name(() => Promise.resolve(void 0), "_updateCallback"));
    const { name, remotes, remoteTypeTarPath, updateCallback } = ctx;
    this._ip = getIPV4();
    this._name = name;
    this._remotes = remotes;
    this._remoteTypeTarPath = remoteTypeTarPath;
    this._updateCallback = updateCallback;
    this._stopWhenSIGTERMOrSIGINT();
    this._handleUnexpectedExit();
    this._connectPublishToServer();
  }
  _connectPublishToServer() {
    if (!this._reconnect) {
      return;
    }
    fileLog(`Publisher:${this._name} Trying to connect to ws://${this._ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}...`, MF_SERVER_IDENTIFIER, "info");
    this._publishWebSocket = new WebSocket(`ws://${this._ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}?WEB_SOCKET_CONNECT_MAGIC_ID=${Broker.WEB_SOCKET_CONNECT_MAGIC_ID}`);
    this._publishWebSocket.on("open", () => {
      var _a2;
      fileLog(`Current pid: ${process.pid}, publisher:${this._name} connected to ws://${this._ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}, starting service...`, MF_SERVER_IDENTIFIER, "info");
      this._isConnected = true;
      const addPublisherAction = new AddPublisherAction({
        name: this._name,
        ip: this._ip,
        remoteTypeTarPath: this._remoteTypeTarPath
      });
      (_a2 = this._publishWebSocket) == null ? void 0 : _a2.send(JSON.stringify(addPublisherAction));
      this._connectSubscribers();
    });
    this._publishWebSocket.on("message", (message) => __async(this, null, function* () {
      var _a2, _b;
      try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "Log") {
          if (parsedMessage.kind === LogKind.BrokerExitLog) {
            fileLog(`Receive broker exit signal, ${this._name} service will exit...`, MF_SERVER_IDENTIFIER, "warn");
            this._exit();
          }
        }
        if (parsedMessage.type === "API") {
          if (parsedMessage.kind === APIKind.FETCH_TYPES) {
            const { payload: { remoteInfo } } = parsedMessage;
            fileLog(`${this._name} Receive broker FETCH_TYPES, payload as follows: ${JSON.stringify(remoteInfo, null, 2)}.`, MF_SERVER_IDENTIFIER, "info");
            yield this.fetchDynamicRemoteTypes({
              remoteInfo
            });
          }
        }
      } catch (err) {
        console.error(err);
        const exitPublisher = new ExitPublisherAction({
          name: this._name,
          ip: this._ip
        });
        const exitSubscriber = new ExitSubscriberAction({
          name: this._name,
          ip: this._ip,
          publishers: this._remotes.map((remote) => ({
            name: remote.name,
            ip: remote.ip
          }))
        });
        (_a2 = this._publishWebSocket) == null ? void 0 : _a2.send(JSON.stringify(exitPublisher));
        (_b = this._publishWebSocket) == null ? void 0 : _b.send(JSON.stringify(exitSubscriber));
        fileLog("Parse messages error, ModuleFederationDevServer will exit...", MF_SERVER_IDENTIFIER, "fatal");
        this._exit();
      }
    }));
    this._publishWebSocket.on("close", (code) => {
      fileLog(`Connection closed with code ${code}.`, MF_SERVER_IDENTIFIER, "warn");
      this._publishWebSocket && this._publishWebSocket.close();
      this._publishWebSocket = null;
      if (!this._reconnect) {
        return;
      }
      const reconnectTime = fib(++this._reconnectTimes);
      fileLog(`start reconnecting to server after ${reconnectTime}s.`, MF_SERVER_IDENTIFIER, "info");
      setTimeout(() => this._connectPublishToServer(), reconnectTime * 1e3);
    });
    this._publishWebSocket.on("error", this._tryCreateBackgroundBroker.bind(this));
  }
  // Associate the remotes(Subscriber) to the Broker
  _connectSubscriberToServer(remote) {
    const { name, ip } = remote;
    fileLog(`remote module:${name} trying to connect to  ws://${ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}...`, MF_SERVER_IDENTIFIER, "info");
    const identifier = getIdentifier({
      name,
      ip
    });
    this._subscriberWebsocketMap[identifier] = new WebSocket(`ws://${ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}?WEB_SOCKET_CONNECT_MAGIC_ID=${Broker.WEB_SOCKET_CONNECT_MAGIC_ID}`);
    this._subscriberWebsocketMap[identifier].on("open", () => {
      fileLog(`Current pid: ${process.pid} remote module: ${name} connected to ws://${ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}, starting service...`, MF_SERVER_IDENTIFIER, "info");
      const addSubscriber = new AddSubscriberAction({
        name: this._name,
        ip: this._ip,
        publishers: [
          {
            name,
            ip
          }
        ]
      });
      this._subscriberWebsocketMap[identifier].send(JSON.stringify(addSubscriber));
    });
    this._subscriberWebsocketMap[identifier].on("message", (message) => __async(this, null, function* () {
      try {
        const parsedMessage = JSON.parse(message.toString());
        if (parsedMessage.type === "Log") {
          if (parsedMessage.kind === LogKind.BrokerExitLog) {
            fileLog(`${identifier}'s Server exit, thus ${identifier} will no longer has reload ability.`, MF_SERVER_IDENTIFIER, "warn");
            this._exit();
          }
        }
        if (parsedMessage.type === "API") {
          if (parsedMessage.kind === APIKind.UPDATE_SUBSCRIBER) {
            const { payload: { updateKind, updateSourcePaths, name: subscribeName, remoteTypeTarPath, updateMode } } = parsedMessage;
            yield this._updateSubscriber({
              remoteTypeTarPath,
              name: subscribeName,
              updateKind,
              updateMode,
              updateSourcePaths
            });
          }
        }
      } catch (err) {
        console.error(err);
        const exitSubscriber = new ExitSubscriberAction({
          name: this._name,
          ip: this._ip,
          publishers: [
            {
              name,
              ip
            }
          ]
        });
        this._subscriberWebsocketMap[identifier].send(JSON.stringify(exitSubscriber));
        fileLog(`${identifier} exit,
        error: ${err instanceof Error ? err.toString() : JSON.stringify(err)}
        `, MF_SERVER_IDENTIFIER, "warn");
      }
    }));
    this._subscriberWebsocketMap[identifier].on("close", (code) => {
      fileLog(`Connection closed with code ${code}.`, MF_SERVER_IDENTIFIER, "warn");
      this._subscriberWebsocketMap[identifier] && this._subscriberWebsocketMap[identifier].close();
      delete this._subscriberWebsocketMap[identifier];
    });
  }
  _connectSubscribers() {
    this._remotes.forEach((remote) => {
      this._connectSubscriberToServer(remote);
    });
  }
  // app1 consumes provider1. And the function will be triggered when provider1 code change.
  _updateSubscriber(options) {
    return __async(this, null, function* () {
      var _a2;
      const { updateMode, updateKind, updateSourcePaths, name, remoteTypeTarPath, remoteInfo } = options;
      fileLog(
        // eslint-disable-next-line max-len
        `[_updateSubscriber] run, options: ${JSON.stringify(options, null, 2)}`,
        MF_SERVER_IDENTIFIER,
        "warn"
      );
      if (updateMode === UpdateMode.PASSIVE && updateSourcePaths.includes(this._name)) {
        fileLog(
          // eslint-disable-next-line max-len
          `[_updateSubscriber] run, updateSourcePaths:${updateSourcePaths} includes ${this._name}, update ignore!`,
          MF_SERVER_IDENTIFIER,
          "warn"
        );
        return;
      }
      if (updateSourcePaths.slice(-1)[0] === this._name) {
        fileLog(`[_updateSubscriber] run, updateSourcePaths:${updateSourcePaths} ends is ${this._name}, update ignore!`, MF_SERVER_IDENTIFIER, "warn");
        return;
      }
      fileLog(
        // eslint-disable-next-line max-len
        `[_updateSubscriber] run, updateSourcePaths:${updateSourcePaths}, current module:${this._name}, update start...`,
        MF_SERVER_IDENTIFIER,
        "info"
      );
      yield this._updateCallback({
        name,
        updateMode,
        updateKind,
        updateSourcePaths,
        remoteTypeTarPath,
        remoteInfo
      });
      const newUpdateSourcePaths = updateSourcePaths.concat(this._name);
      const updatePublisher = new UpdatePublisherAction({
        name: this._name,
        ip: this._ip,
        updateMode: UpdateMode.PASSIVE,
        updateKind,
        updateSourcePaths: newUpdateSourcePaths,
        remoteTypeTarPath: this._remoteTypeTarPath
      });
      fileLog(
        // eslint-disable-next-line max-len
        `[_updateSubscriber] run, updateSourcePaths:${newUpdateSourcePaths}, update publisher ${this._name} start...`,
        MF_SERVER_IDENTIFIER,
        "info"
      );
      (_a2 = this._publishWebSocket) == null ? void 0 : _a2.send(JSON.stringify(updatePublisher));
    });
  }
  _tryCreateBackgroundBroker(err) {
    if (!((err == null ? void 0 : err.code) === "ECONNREFUSED" && err.port === Broker.DEFAULT_WEB_SOCKET_PORT)) {
      fileLog(`websocket error: ${err.stack}`, MF_SERVER_IDENTIFIER, "fatal");
      return;
    }
    fileLog(`Failed to connect to ws://${this._ip}:${Broker.DEFAULT_WEB_SOCKET_PORT}...`, MF_SERVER_IDENTIFIER, "fatal");
    this._isReconnecting = true;
    setTimeout(() => {
      this._isReconnecting = false;
      if (this._reconnect === false) {
        return;
      }
      fileLog("Creating new background broker...", MF_SERVER_IDENTIFIER, "warn");
      const broker = createBroker();
      broker.on("message", (message) => {
        if (message === "ready") {
          fileLog("background broker started.", MF_SERVER_IDENTIFIER, "info");
          this._reconnectTimes = 1;
          if (process.send) {
            process.send("ready");
          }
        }
      });
    }, Math.ceil(100 * Math.random()));
  }
  _stopWhenSIGTERMOrSIGINT() {
    process.on("SIGTERM", () => {
      fileLog(`Process(${process.pid}) SIGTERM, ModuleFederationDevServer will exit...`, MF_SERVER_IDENTIFIER, "warn");
      this._exit();
    });
    process.on("SIGINT", () => {
      fileLog(`Process(${process.pid}) SIGINT, ModuleFederationDevServer will exit...`, MF_SERVER_IDENTIFIER, "warn");
      this._exit();
    });
  }
  _handleUnexpectedExit() {
    process.on("unhandledRejection", (error) => {
      if (this._isReconnecting) {
        return;
      }
      console.error("Unhandled Rejection Error: ", error);
      fileLog(`Process(${process.pid}) unhandledRejection, garfishModuleServer will exit...`, MF_SERVER_IDENTIFIER, "error");
      this._exit();
    });
    process.on("uncaughtException", (error) => {
      if (this._isReconnecting) {
        return;
      }
      console.error("Unhandled Exception Error: ", error);
      fileLog(`Process(${process.pid}) uncaughtException, garfishModuleServer will exit...`, MF_SERVER_IDENTIFIER, "error");
      this._exit();
    });
  }
  _exit() {
    this._reconnect = false;
    if (this._publishWebSocket) {
      const exitPublisher = new ExitPublisherAction({
        name: this._name,
        ip: this._ip
      });
      this._publishWebSocket.send(JSON.stringify(exitPublisher));
      this._publishWebSocket.on("message", (message) => {
        const parsedMessage = JSON.parse(message.toString());
        fileLog(`[${parsedMessage.kind}]: ${JSON.stringify(parsedMessage)}`, MF_SERVER_IDENTIFIER, "info");
      });
    }
    if (this._publishWebSocket) {
      this._publishWebSocket.close();
      this._publishWebSocket = null;
    }
    process.exit(0);
  }
  exit() {
    this._exit();
  }
  update(options) {
    if (!this._publishWebSocket || !this._isConnected) {
      return;
    }
    const { updateKind, updateMode, updateSourcePaths, clientName } = options;
    fileLog(`update run, ${this._name} module update, updateKind: ${updateKind}, updateMode: ${updateMode}, updateSourcePaths: ${updateSourcePaths}`, MF_SERVER_IDENTIFIER, "info");
    if (updateKind === UpdateKind.RELOAD_PAGE) {
      const notifyWebClient = new NotifyWebClientAction({
        name: clientName || this._name,
        updateMode
      });
      this._publishWebSocket.send(JSON.stringify(notifyWebClient));
      return;
    }
    const updatePublisher = new UpdatePublisherAction({
      name: this._name,
      ip: this._ip,
      updateMode,
      updateKind,
      updateSourcePaths: [
        this._name
      ],
      remoteTypeTarPath: this._remoteTypeTarPath
    });
    this._publishWebSocket.send(JSON.stringify(updatePublisher));
  }
  fetchDynamicRemoteTypes(options) {
    return __async(this, null, function* () {
      const { remoteInfo, once } = options;
      const updateMode = UpdateMode.PASSIVE;
      const updateKind = UpdateKind.UPDATE_TYPE;
      fileLog(`fetchDynamicRemoteTypes: remoteInfo: ${JSON.stringify(remoteInfo)}`, MF_SERVER_IDENTIFIER, "info");
      yield this._updateCallback({
        name: this._name,
        updateMode,
        updateKind,
        updateSourcePaths: [],
        remoteTypeTarPath: "",
        remoteInfo,
        once
      });
      const updatePublisher = new UpdatePublisherAction({
        name: this._name,
        ip: this._ip,
        updateMode,
        updateKind,
        updateSourcePaths: [
          this._name
        ],
        remoteTypeTarPath: this._remoteTypeTarPath
      });
      this._publishWebSocket.send(JSON.stringify(updatePublisher));
    });
  }
};
__name(_ModuleFederationDevServer, "ModuleFederationDevServer");
var ModuleFederationDevServer = _ModuleFederationDevServer;

// packages/dts-plugin/src/server/createKoaServer.ts
import fs from "fs-extra";
import Koa from "koa";
function createKoaServer(options) {
  return __async(this, null, function* () {
    const { typeTarPath } = options;
    const freeport = yield getFreePort();
    const app = new Koa();
    app.use((ctx, next) => __async(this, null, function* () {
      if (ctx.path === `/${DEFAULT_TAR_NAME}`) {
        ctx.status = 200;
        ctx.body = fs.createReadStream(typeTarPath);
        ctx.response.type = "application/x-gzip";
      } else {
        yield next();
      }
    }));
    app.listen(freeport);
    return {
      server: app,
      serverAddress: `http://${getIPV4()}:${freeport}`
    };
  });
}
__name(createKoaServer, "createKoaServer");

// packages/dts-plugin/src/core/lib/archiveHandler.ts
import AdmZip from "adm-zip";
import { resolve as resolve3, join as join3 } from "path";
import { rm as rm3 } from "fs/promises";

// packages/dts-plugin/src/core/lib/utils.ts
import fs3 from "fs";
import path3 from "path";
import axios from "axios";
import http from "http";
import https from "https";
import ansiColors2 from "ansi-colors";

// packages/dts-plugin/src/core/configurations/remotePlugin.ts
import { existsSync as existsSync2 } from "fs";
import { dirname as dirname2, join as join2, resolve as resolve2, extname as extname2 } from "path";
import { utils } from "@module-federation/managers";
import typescript from "typescript";
var defaultOptions = {
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
    const commonRoot = files.map((file) => dirname2(file)).reduce((commonPath, fileDir) => {
      while (!fileDir.startsWith(commonPath)) {
        commonPath = dirname2(commonPath);
      }
      return commonPath;
    }, files[0]);
    return commonRoot;
  }
  throw new Error("Can not get effective rootDir, please set compilerOptions.rootDir !");
}
__name(getEffectiveRootDir, "getEffectiveRootDir");
var readTsConfig = /* @__PURE__ */ __name(({ tsConfigPath, typesFolder, compiledTypesFolder, context, additionalFilesToCompile }, mapComponentsToExpose) => {
  const resolvedTsConfigPath = resolve2(context, tsConfigPath);
  const readResult = typescript.readConfigFile(resolvedTsConfigPath, typescript.sys.readFile);
  if (readResult.error) {
    throw new Error(readResult.error.messageText.toString());
  }
  const rawTsConfigJson = readResult.config;
  const configContent = typescript.parseJsonConfigFileContent(rawTsConfigJson, typescript.sys, dirname2(resolvedTsConfigPath));
  const rootDir = getEffectiveRootDir(configContent);
  const outDir = resolve2(context, configContent.options.outDir || "dist", typesFolder, compiledTypesFolder);
  const defaultCompilerOptions = {
    rootDir,
    emitDeclarationOnly: true,
    noEmit: false,
    declaration: true,
    outDir
  };
  rawTsConfigJson.compilerOptions = rawTsConfigJson.compilerOptions || {};
  rawTsConfigJson.compilerOptions = __spreadValues(__spreadValues({}, rawTsConfigJson.compilerOptions), defaultCompilerOptions);
  const _a2 = rawTsConfigJson.compilerOptions || {}, { paths, baseUrl } = _a2, restCompilerOptions = __objRest(_a2, ["paths", "baseUrl"]);
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
  if (extname2(exposedPath)) {
    return resolve2(context, exposedPath);
  }
  for (const extension of TS_EXTENSIONS) {
    const exposedPathWithExtension = resolve2(context, `${exposedPath}.${extension}`);
    if (existsSync2(exposedPathWithExtension)) {
      return exposedPathWithExtension;
    }
  }
  return void 0;
}, "resolveWithExtension");
var resolveExposes = /* @__PURE__ */ __name((remoteOptions) => {
  const parsedOptions = utils.parseOptions(remoteOptions.moduleFederationConfig.exposes || {}, (item, key) => ({
    exposePath: Array.isArray(item) ? item[0] : item,
    key
  }), (item, key) => ({
    exposePath: Array.isArray(item.import) ? item.import[0] : item.import[0],
    key
  }));
  return parsedOptions.reduce((accumulator, item) => {
    const { exposePath, key } = item[1];
    accumulator[key] = resolveWithExtension(exposePath, remoteOptions.context) || resolveWithExtension(join2(exposePath, "index"), remoteOptions.context) || exposePath;
    return accumulator;
  }, {});
}, "resolveExposes");
var retrieveRemoteConfig = /* @__PURE__ */ __name((options) => {
  validateOptions(options);
  const remoteOptions = __spreadValues(__spreadValues({}, defaultOptions), options);
  const mapComponentsToExpose = resolveExposes(remoteOptions);
  const tsConfig = readTsConfig(remoteOptions, mapComponentsToExpose);
  return {
    tsConfig,
    mapComponentsToExpose,
    remoteOptions
  };
}, "retrieveRemoteConfig");

// packages/dts-plugin/src/core/lib/DTSManager.ts
import ansiColors from "ansi-colors";
import path2 from "path";
import { rm as rm2 } from "fs/promises";
import fs2 from "fs";
import { MANIFEST_EXT, inferAutoPublicPath } from "@module-federation/sdk";
import { ThirdPartyExtractor as ThirdPartyExtractor2 } from "@module-federation/third-party-dts-extractor";

// packages/dts-plugin/src/core/configurations/hostPlugin.ts
import { parseEntry, ENCODE_NAME_PREFIX, decodeName } from "@module-federation/sdk";
import { utils as utils2 } from "@module-federation/managers";
var defaultOptions2 = {
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
  if (decodedRemote.startsWith(ENCODE_NAME_PREFIX)) {
    decodedRemote = decodeName(decodedRemote, ENCODE_NAME_PREFIX);
  }
  const parsedInfo = parseEntry(decodedRemote, void 0, "@");
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
  const parsedOptions = utils2.parseOptions(hostOptions.moduleFederationConfig.remotes || {}, (item, key) => ({
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
  const hostOptions = __spreadValues(__spreadValues({}, defaultOptions2), options);
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
      const exposePath = path2.join(REMOTE_ALIAS_IDENTIFIER, exposeKey).split(path2.sep).join("/");
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
          typesFolder: path2.join(mfTypesPath, "node_modules"),
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
      var _a2;
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
          fs2.writeFileSync(apiTypesPath, apiTypes);
        }
        try {
          if (remoteOptions.deleteTypesFolder) {
            yield rm2(retrieveMfTypesPath(tsConfig, remoteOptions), {
              recursive: true,
              force: true
            });
          }
        } catch (err) {
          if (isDebugMode()) {
            console.error(err);
          }
        }
        console.log(ansiColors.green("Federated types created correctly"));
      } catch (error) {
        if (((_a2 = this.options.remote) == null ? void 0 : _a2.abortOnError) === false) {
          console.error(ansiColors.red(`Unable to compile federated types, ${error}`));
        } else {
          throw error;
        }
      }
    });
  }
  requestRemoteManifest(remoteInfo) {
    return __async(this, null, function* () {
      try {
        if (!remoteInfo.url.includes(MANIFEST_EXT)) {
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
          publicPath = inferAutoPublicPath(remoteInfo.url);
        }
        remoteInfo.zipUrl = new URL(path2.join(addProtocol(publicPath), manifestJson.metaData.types.zip)).href;
        if (!manifestJson.metaData.types.api) {
          console.warn(`Can not get ${remoteInfo.name}'s api types url!`);
          remoteInfo.apiTypeUrl = "";
          return remoteInfo;
        }
        remoteInfo.apiTypeUrl = new URL(path2.join(addProtocol(publicPath), manifestJson.metaData.types.api)).href;
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
        const filePath = path2.join(destinationPath, REMOTE_API_TYPES_FILE_NAME);
        fs2.writeFileSync(filePath, apiTypeFile);
        this.loadedRemoteAPIAlias.add(remoteInfo.alias);
      } catch (err) {
        fileLog(`Unable to download "${remoteInfo.name}" api types, ${err}`, "consumeTargetRemotes", "error");
      }
    });
  }
  consumeAPITypes(hostOptions) {
    const apiTypeFileName = path2.join(hostOptions.context, hostOptions.typesFolder, HOST_API_TYPES_FILE_NAME);
    try {
      const existedFile = fs2.readFileSync(apiTypeFileName, "utf-8");
      const existedImports = new ThirdPartyExtractor2("").collectTypeImports(existedFile);
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
    fs2.writeFileSync(path2.join(hostOptions.context, hostOptions.typesFolder, HOST_API_TYPES_FILE_NAME), fileStr);
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
      var _a2;
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
        console.log(ansiColors.green("Federated types extraction completed"));
      } catch (err) {
        if (((_a2 = this.options.host) == null ? void 0 : _a2.abortOnError) === false) {
          fileLog(`Unable to consume federated types, ${err}`, "consumeTypes", "error");
        } else {
          throw err;
        }
      }
    });
  }
  updateTypes(options) {
    return __async(this, null, function* () {
      var _a2, _b, _c;
      try {
        const { remoteName, updateMode, remoteInfo: updatedRemoteInfo, once } = options;
        const hostName = (_c = (_b = (_a2 = this.options) == null ? void 0 : _a2.host) == null ? void 0 : _b.moduleFederationConfig) == null ? void 0 : _c.name;
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
          const consumeTypes = /* @__PURE__ */ __name((requiredRemoteInfo) => __async(this, null, function* () {
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
              yield consumeTypes(this.remoteAliasMap[remoteInfo.alias]);
            } else if (updatedRemoteInfo) {
              const consumeDynamicRemoteTypes = /* @__PURE__ */ __name(() => __async(this, null, function* () {
                yield consumeTypes(this.updatedRemoteInfos[updatedRemoteInfo.name]);
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
            yield consumeTypes(loadedRemoteInfo);
          }
        }
      } catch (err) {
        fileLog(`updateTypes fail, ${err}`, "updateTypes", "error");
      }
    });
  }
}, __name(_a, "DTSManager"), _a);

// packages/dts-plugin/src/core/lib/utils.ts
import cloneDeepWith from "lodash.clonedeepwith";
function getDTSManagerConstructor(implementation) {
  if (implementation) {
    const NewConstructor = __require(implementation);
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
      zipPrefix = path3.dirname(moduleFederationConfig.manifest.fileName);
    } else if (moduleFederationConfig.filename) {
      zipPrefix = path3.dirname(moduleFederationConfig.filename);
    }
    return {
      zipPrefix,
      apiTypesPath,
      zipTypesPath,
      zipName: path3.basename(zipTypesPath),
      apiFileName: path3.basename(apiTypesPath)
    };
  } catch (err) {
    console.error(ansiColors2.red(`Unable to compile federated types, ${err}`));
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
      filepath = path3.resolve(context, "./tsconfig.json");
    }
    if (!path3.isAbsolute(filepath)) {
      filepath = path3.resolve(context, filepath);
    }
    return fs3.existsSync(filepath);
  } catch (err) {
    return false;
  }
}, "isTSProject");
function cloneDeepOptions(options) {
  const excludeKeys = [
    "manifest",
    "async"
  ];
  return cloneDeepWith(options, (_value, key) => {
    if (typeof key === "string" && excludeKeys.includes(key)) {
      return false;
    }
  });
}
__name(cloneDeepOptions, "cloneDeepOptions");
function axiosGet(url, config) {
  return __async(this, null, function* () {
    const httpAgent = new http.Agent({
      family: 4
    });
    const httpsAgent = new https.Agent({
      family: 4
    });
    return axios.get(url, __spreadValues({
      httpAgent,
      httpsAgent
    }, config));
  });
}
__name(axiosGet, "axiosGet");

// packages/dts-plugin/src/core/lib/archiveHandler.ts
var retrieveTypesZipPath = /* @__PURE__ */ __name((mfTypesPath, remoteOptions) => join3(mfTypesPath.replace(remoteOptions.typesFolder, ""), `${remoteOptions.typesFolder}.zip`), "retrieveTypesZipPath");
var createTypesArchive = /* @__PURE__ */ __name((tsConfig, remoteOptions) => __async(void 0, null, function* () {
  const mfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions);
  const zip = new AdmZip();
  zip.addLocalFolder(mfTypesPath);
  return zip.writeZipPromise(retrieveTypesZipPath(mfTypesPath, remoteOptions));
}), "createTypesArchive");
var downloadErrorLogger = /* @__PURE__ */ __name((destinationFolder, fileToDownload) => (reason) => {
  throw __spreadProps(__spreadValues({}, reason), {
    message: `Network error: Unable to download federated mocks for '${destinationFolder}' from '${fileToDownload}' because '${reason.message}'`
  });
}, "downloadErrorLogger");
var retrieveTypesArchiveDestinationPath = /* @__PURE__ */ __name((hostOptions, destinationFolder) => {
  return resolve3(hostOptions.context, hostOptions.typesFolder, destinationFolder);
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
            yield rm3(destinationPath, {
              recursive: true,
              force: true
            });
          }
        } catch (error) {
          fileLog(`Unable to remove types folder, ${error}`, "downloadTypesArchive", "error");
        }
        const zip = new AdmZip(Buffer.from(response.data));
        zip.extractAllTo(destinationPath, true);
        return [
          destinationFolder,
          destinationPath
        ];
      } catch (error) {
        fileLog(`Error during types archive download: ${(error == null ? void 0 : error.message) || "unknown error"}`, "downloadTypesArchive", "error");
        if (retries >= hostOptions.maxRetries) {
          if (hostOptions.abortOnError !== false) {
            throw error;
          }
          return void 0;
        }
      }
    }
  });
}, "downloadTypesArchive");

// packages/dts-plugin/src/core/lib/generateTypes.ts
function generateTypes(options) {
  return __async(this, null, function* () {
    var _a2;
    const DTSManagerConstructor = getDTSManagerConstructor((_a2 = options.remote) == null ? void 0 : _a2.implementation);
    const dtsManager = new DTSManagerConstructor(options);
    return dtsManager.generateTypes();
  });
}
__name(generateTypes, "generateTypes");

// packages/dts-plugin/src/core/rpc/types.ts
var RpcGMCallTypes;
(function(RpcGMCallTypes2) {
  RpcGMCallTypes2["CALL"] = "mf_call";
  RpcGMCallTypes2["RESOLVE"] = "mf_resolve";
  RpcGMCallTypes2["REJECT"] = "mf_reject";
  RpcGMCallTypes2["EXIT"] = "mf_exit";
})(RpcGMCallTypes || (RpcGMCallTypes = {}));

// packages/dts-plugin/src/core/rpc/expose-rpc.ts
import process2 from "process";
function exposeRpc(fn) {
  const sendMessage = /* @__PURE__ */ __name((message) => new Promise((resolve4, reject) => {
    if (!process2.send) {
      reject(new Error(`Process ${process2.pid} doesn't have IPC channels`));
    } else if (!process2.connected) {
      reject(new Error(`Process ${process2.pid} doesn't have open IPC channels`));
    } else {
      process2.send(message, void 0, void 0, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve4(void 0);
        }
      });
    }
  }), "sendMessage");
  const handleMessage = /* @__PURE__ */ __name((message) => __async(this, null, function* () {
    if (message.type === RpcGMCallTypes.CALL) {
      if (!process2.send) {
        return;
      }
      let value, error;
      try {
        value = yield fn(...message.args);
      } catch (fnError) {
        error = fnError;
      }
      try {
        if (error) {
          yield sendMessage({
            type: RpcGMCallTypes.REJECT,
            id: message.id,
            error
          });
        } else {
          yield sendMessage({
            type: RpcGMCallTypes.RESOLVE,
            id: message.id,
            value
          });
        }
      } catch (sendError) {
        if (error) {
          if (error instanceof Error) {
            console.error(error);
          }
        }
        console.error(sendError);
      }
    }
  }), "handleMessage");
  process2.on("message", handleMessage);
}
__name(exposeRpc, "exposeRpc");

export {
  retrieveMfTypesPath,
  retrieveOriginalOutDir,
  ModuleFederationDevServer,
  createKoaServer,
  retrieveTypesZipPath,
  retrieveHostConfig,
  REMOTE_ALIAS_IDENTIFIER,
  REMOTE_API_TYPES_FILE_NAME,
  HOST_API_TYPES_FILE_NAME,
  DTSManager,
  getDTSManagerConstructor,
  validateOptions,
  retrieveTypesAssetsInfo,
  isDebugMode,
  isTSProject,
  cloneDeepOptions,
  retrieveRemoteConfig,
  generateTypes,
  RpcGMCallTypes,
  exposeRpc
};
