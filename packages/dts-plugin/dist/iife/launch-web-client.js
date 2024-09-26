(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
  var __publicField = (obj, key, value) => {
    __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
    return value;
  };

  // packages/dts-plugin/src/server/constant.ts
  var DEFAULT_WEB_SOCKET_PORT = 16322;
  var WEB_SOCKET_CONNECT_MAGIC_ID = "1hpzW-zo2z-o8io-gfmV1-2cb1d82";
  var UpdateMode;
  (function(UpdateMode2) {
    UpdateMode2["POSITIVE"] = "POSITIVE";
    UpdateMode2["PASSIVE"] = "PASSIVE";
  })(UpdateMode || (UpdateMode = {}));

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
  var _Action = class _Action extends Message {
    constructor(content, kind) {
      super("Action", kind);
      __publicField(this, "payload");
      const { payload } = content;
      this.payload = payload;
    }
  };
  __name(_Action, "Action");
  var Action = _Action;

  // packages/dts-plugin/src/server/message/Action/Update.ts
  var UpdateKind;
  (function(UpdateKind2) {
    UpdateKind2["UPDATE_TYPE"] = "UPDATE_TYPE";
    UpdateKind2["RELOAD_PAGE"] = "RELOAD_PAGE";
  })(UpdateKind || (UpdateKind = {}));

  // packages/dts-plugin/src/server/message/Action/AddWebClient.ts
  var _AddWebClientAction = class _AddWebClientAction extends Action {
    constructor(payload) {
      super({
        payload
      }, ActionKind.ADD_WEB_CLIENT);
    }
  };
  __name(_AddWebClientAction, "AddWebClientAction");
  var AddWebClientAction = _AddWebClientAction;

  // packages/dts-plugin/src/server/message/API/API.ts
  var APIKind;
  (function(APIKind2) {
    APIKind2["UPDATE_SUBSCRIBER"] = "UPDATE_SUBSCRIBER";
    APIKind2["RELOAD_WEB_CLIENT"] = "RELOAD_WEB_CLIENT";
    APIKind2["FETCH_TYPES"] = "FETCH_TYPES";
  })(APIKind || (APIKind = {}));

  // node_modules/.pnpm/isomorphic-ws@5.0.0_ws@8.17.1/node_modules/isomorphic-ws/browser.js
  var ws = null;
  if (typeof WebSocket !== "undefined") {
    ws = WebSocket;
  } else if (typeof MozWebSocket !== "undefined") {
    ws = MozWebSocket;
  } else if (typeof global !== "undefined") {
    ws = global.WebSocket || global.MozWebSocket;
  } else if (typeof window !== "undefined") {
    ws = window.WebSocket || window.MozWebSocket;
  } else if (typeof self !== "undefined") {
    ws = self.WebSocket || self.MozWebSocket;
  }
  var browser_default = ws;

  // packages/dts-plugin/src/server/createWebsocket.ts
  function createWebsocket() {
    return new browser_default(`ws://127.0.0.1:${DEFAULT_WEB_SOCKET_PORT}?WEB_SOCKET_CONNECT_MAGIC_ID=${WEB_SOCKET_CONNECT_MAGIC_ID}`);
  }
  __name(createWebsocket, "createWebsocket");

  // packages/dts-plugin/src/server/WebClient.ts
  var _WebClient = class _WebClient {
    constructor(options) {
      __publicField(this, "_webSocket", null);
      __publicField(this, "_name");
      __publicField(this, "logPrefix");
      this._name = options.name;
      this.logPrefix = options.logPrefix || "";
      this._connect();
    }
    _connect() {
      console.log(`${this.logPrefix}Trying to connect to {cyan ws://127.0.0.1:${DEFAULT_WEB_SOCKET_PORT}}...}`);
      this._webSocket = createWebsocket();
      this._webSocket.onopen = () => {
        console.log(`${this.logPrefix}Connected to {cyan ws://127.0.0.1:${DEFAULT_WEB_SOCKET_PORT}} success!`);
        const startWebClient = new AddWebClientAction({
          name: this._name
        });
        this._webSocket && this._webSocket.send(JSON.stringify(startWebClient));
      };
      this._webSocket.onmessage = (message) => {
        console.log(message);
        const parsedMessage = JSON.parse(message.data.toString());
        if (parsedMessage.type === "API") {
          if (parsedMessage.kind === APIKind.RELOAD_WEB_CLIENT) {
            const { payload: { name } } = parsedMessage;
            if (name !== this._name) {
              return;
            }
            this._reload();
          }
        }
      };
      this._webSocket.onerror = (err) => {
        console.error(`${this.logPrefix}err: ${err}`);
      };
    }
    _reload() {
      console.log(`${this.logPrefix}reload`);
      location.reload();
    }
  };
  __name(_WebClient, "WebClient");
  var WebClient = _WebClient;

  // packages/dts-plugin/src/server/launchWebClient.ts
  new WebClient(__WEB_CLIENT_OPTIONS__);
})();
