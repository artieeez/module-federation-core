import {
  RpcGMCallTypes,
  cloneDeepOptions,
  exposeRpc,
  getDTSManagerConstructor,
  isDebugMode
} from "./chunk-FVLVCOUE.js";
import {
  __async,
  __export,
  __name,
  __publicField,
  __spreadProps,
  __spreadValues
} from "./chunk-4CSLH7II.js";

// packages/dts-plugin/src/core/lib/DtsWorker.ts
import path from "path";

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

// packages/dts-plugin/src/core/rpc/rpc-error.ts
var _a;
var RpcExitError = (_a = class extends Error {
  constructor(message, code, signal) {
    super(message);
    __publicField(this, "code");
    __publicField(this, "signal");
    this.code = code;
    this.signal = signal;
    this.name = "RpcExitError";
  }
}, __name(_a, "RpcExitError"), _a);

// packages/dts-plugin/src/core/rpc/wrap-rpc.ts
function createControlledPromise() {
  let resolve = /* @__PURE__ */ __name(() => void 0, "resolve");
  let reject = /* @__PURE__ */ __name(() => void 0, "reject");
  const promise = new Promise((aResolve, aReject) => {
    resolve = aResolve;
    reject = aReject;
  });
  return {
    promise,
    resolve,
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
    }, (error) => {
      if (error) {
        rejectSend(error);
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
import * as child_process from "child_process";
import * as process2 from "process";
import { randomUUID } from "crypto";
var FEDERATION_WORKER_DATA_ENV_KEY = "VMOK_WORKER_DATA_ENV";
function createRpcWorker(modulePath, data, memoryLimit, once) {
  const options = {
    env: __spreadProps(__spreadValues({}, process2.env), {
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
  const id = randomUUID();
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
      } catch (error) {
        if (error.code === "EPIPE") {
          console.error("Pipe closed before message could be sent:", error);
        } else {
          console.error("Unexpected error:", error);
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
  return JSON.parse(process2.env[FEDERATION_WORKER_DATA_ENV_KEY] || "{}");
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
    this.rpcWorker = createRpcWorker(path.resolve(__dirname, "./fork-generate-dts.js"), {}, void 0, true);
    this._res = this.rpcWorker.connect(this._options);
  }
  removeUnSerializationOptions() {
    var _a2, _b, _c, _d, _e, _f, _g, _h;
    if ((_b = (_a2 = this._options.remote) == null ? void 0 : _a2.moduleFederationConfig) == null ? void 0 : _b.manifest) {
      (_d = (_c = this._options.remote) == null ? void 0 : _c.moduleFederationConfig) == null ? true : delete _d.manifest;
    }
    if ((_f = (_e = this._options.host) == null ? void 0 : _e.moduleFederationConfig) == null ? void 0 : _f.manifest) {
      (_h = (_g = this._options.host) == null ? void 0 : _g.moduleFederationConfig) == null ? true : delete _h.manifest;
    }
  }
  get controlledPromise() {
    const ensureChildProcessExit = /* @__PURE__ */ __name(() => {
      var _a2;
      try {
        const pid = (_a2 = this.rpcWorker.process) == null ? void 0 : _a2.pid;
        const rootPid = process.pid;
        if (pid && rootPid !== pid) {
          process.kill(pid, 0);
        }
      } catch (error) {
        if (isDebugMode()) {
          console.error(error);
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
    var _a2;
    try {
      (_a2 = this.rpcWorker) == null ? void 0 : _a2.terminate();
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
    var _a2;
    const DTSManagerConstructor = getDTSManagerConstructor((_a2 = options.host) == null ? void 0 : _a2.implementation);
    const dtsManager = new DTSManagerConstructor(options);
    yield dtsManager.consumeTypes();
  });
}
__name(consumeTypes, "consumeTypes");

export {
  rpc_exports,
  DtsWorker,
  generateTypesInChildProcess,
  consumeTypes
};
