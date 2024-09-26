var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
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
  return new Promise((resolve, reject) => {
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
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// packages/dts-plugin/src/server/broker/startBroker.ts
var startBroker_exports = {};
__export(startBroker_exports, {
  getBroker: () => getBroker
});
module.exports = __toCommonJS(startBroker_exports);

// packages/dts-plugin/src/server/broker/Broker.ts
var import_http = require("http");

// packages/dts-plugin/src/server/constant.ts
var DEFAULT_WEB_SOCKET_PORT = 16322;
var WEB_SOCKET_CONNECT_MAGIC_ID = "1hpzW-zo2z-o8io-gfmV1-2cb1d82";
var UpdateMode;
(function(UpdateMode2) {
  UpdateMode2["POSITIVE"] = "POSITIVE";
  UpdateMode2["PASSIVE"] = "PASSIVE";
})(UpdateMode || (UpdateMode = {}));

// packages/dts-plugin/src/server/broker/Broker.ts
var import_isomorphic_ws = __toESM(require("isomorphic-ws"));
var import_node_schedule = __toESM(require("node-schedule"));
var import_url = require("url");

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
var import_sdk2 = require("@module-federation/sdk");

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
var import_sdk = require("@module-federation/sdk");
var log4js = __toESM(require("log4js"));
var import_chalk2 = __toESM(require("chalk"));
function fileLog(msg, module2, level) {
  var _a, _b;
  if (!((_a = process == null ? void 0 : process.env) == null ? void 0 : _a["FEDERATION_DEBUG"])) {
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
  return `mf ${import_sdk2.SEPARATOR}${name}${ip ? `${import_sdk2.SEPARATOR}${ip}` : ""}`;
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
        var _a;
        if (req.url) {
          const { pathname } = (0, import_url.parse)(req.url);
          if (pathname === "/") {
            (_a = this._webSocketServer) == null ? void 0 : _a.handleUpgrade(req, socket, head, (ws) => {
              var _a2;
              (_a2 = this._webSocketServer) == null ? void 0 : _a2.emit("connection", ws, req);
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
    var _a;
    return (_a = this._tmpSubscriberShelter.get(publisherIdentifier)) == null ? void 0 : _a.subscribers;
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
    var _a, _b;
    fileLog(`[broadcast] exit info : ${JSON.stringify(message)}`, "Broker", "warn");
    (_a = this._webSocketServer) == null ? void 0 : _a.clients.forEach((client) => {
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

// packages/dts-plugin/src/server/broker/startBroker.ts
var broker;
function getBroker() {
  return broker;
}
__name(getBroker, "getBroker");
function startBroker() {
  return __async(this, null, function* () {
    var _a;
    if (getBroker()) {
      return;
    }
    broker = new Broker();
    yield broker.start();
    (_a = process.send) == null ? void 0 : _a.call(process, "ready");
  });
}
__name(startBroker, "startBroker");
process.on("message", (message) => {
  if (message === "start") {
    fileLog(`startBroker... ${process.pid}`, "StartBroker", "info");
    startBroker();
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  getBroker
});
