import {
  rpc_exports
} from "./chunk-VJKKCGU4.js";
import {
  ModuleFederationDevServer,
  createKoaServer,
  getDTSManagerConstructor,
  retrieveHostConfig,
  retrieveMfTypesPath,
  retrieveRemoteConfig,
  retrieveTypesZipPath
} from "./chunk-FVLVCOUE.js";
import {
  fileLog,
  getIPV4
} from "./chunk-MY3H5SQO.js";
import {
  getIpFromEntry
} from "./chunk-QAUALHAU.js";
import {
  DEFAULT_TAR_NAME,
  UpdateKind,
  UpdateMode,
  __async,
  __name
} from "./chunk-4CSLH7II.js";

// packages/dts-plugin/src/dev-worker/forkDevWorker.ts
import { decodeName } from "@module-federation/sdk";
var typesManager;
var serverAddress;
var moduleServer;
var cacheOptions;
function getLocalRemoteNames(options, encodeNameIdentifier) {
  if (!options) {
    return [];
  }
  const { mapRemotesToDownload } = retrieveHostConfig(options);
  return Object.keys(mapRemotesToDownload).reduce((sum, remoteModuleName) => {
    const remoteInfo = mapRemotesToDownload[remoteModuleName];
    const name = encodeNameIdentifier ? decodeName(remoteInfo.name, encodeNameIdentifier) : remoteInfo.name;
    const ip = getIpFromEntry(remoteInfo.url, getIPV4());
    if (!ip) {
      return sum;
    }
    sum.push({
      name,
      entry: remoteInfo.url,
      ip
    });
    return sum;
  }, []);
}
__name(getLocalRemoteNames, "getLocalRemoteNames");
function updateCallback(_0) {
  return __async(this, arguments, function* ({ updateMode, name, remoteTypeTarPath, remoteInfo, once }) {
    const { disableHotTypesReload, disableLiveReload } = cacheOptions || {};
    fileLog(`sync remote module ${name}, types to ${cacheOptions == null ? void 0 : cacheOptions.name},typesManager.updateTypes run`, "forkDevWorker", "info");
    if (!disableLiveReload && moduleServer) {
      moduleServer.update({
        updateKind: UpdateKind.RELOAD_PAGE,
        updateMode: UpdateMode.PASSIVE
      });
    }
    if (!disableHotTypesReload && typesManager) {
      yield typesManager.updateTypes({
        updateMode,
        remoteName: name,
        remoteTarPath: remoteTypeTarPath,
        remoteInfo,
        once
      });
    }
  });
}
__name(updateCallback, "updateCallback");
function forkDevWorker(options, action) {
  return __async(this, null, function* () {
    if (!typesManager) {
      const { name, remote, host, extraOptions } = options;
      const DTSManagerConstructor = getDTSManagerConstructor(remote == null ? void 0 : remote.implementation);
      typesManager = new DTSManagerConstructor({
        remote,
        host,
        extraOptions
      });
      if (!options.disableHotTypesReload && remote) {
        const { remoteOptions, tsConfig } = retrieveRemoteConfig(remote);
        const mfTypesPath = retrieveMfTypesPath(tsConfig, remoteOptions);
        const mfTypesZipPath = retrieveTypesZipPath(mfTypesPath, remoteOptions);
        yield Promise.all([
          createKoaServer({
            typeTarPath: mfTypesZipPath
          }).then((res) => {
            serverAddress = res.serverAddress;
          }),
          typesManager.generateTypes()
        ]).catch((err) => {
          fileLog(`${name} module generateTypes done, localServerAddress:  ${JSON.stringify(err)}`, "forkDevWorker", "error");
        });
        fileLog(`${name} module generateTypes done, localServerAddress:  ${serverAddress}`, "forkDevWorker", "info");
      }
      moduleServer = new ModuleFederationDevServer({
        name,
        remotes: getLocalRemoteNames(host, extraOptions == null ? void 0 : extraOptions["encodeNameIdentifier"]),
        updateCallback,
        remoteTypeTarPath: `${serverAddress}/${DEFAULT_TAR_NAME}`
      });
      cacheOptions = options;
    }
    if (action === "update" && cacheOptions) {
      fileLog(`remoteModule ${cacheOptions.name} receive devWorker update, start typesManager.updateTypes `, "forkDevWorker", "info");
      if (!cacheOptions.disableLiveReload) {
        moduleServer == null ? void 0 : moduleServer.update({
          updateKind: UpdateKind.RELOAD_PAGE,
          updateMode: UpdateMode.POSITIVE
        });
      }
      if (!cacheOptions.disableHotTypesReload) {
        typesManager == null ? void 0 : typesManager.updateTypes({
          updateMode: UpdateMode.POSITIVE,
          remoteName: cacheOptions.name
        }).then(() => {
          moduleServer == null ? void 0 : moduleServer.update({
            updateKind: UpdateKind.UPDATE_TYPE,
            updateMode: UpdateMode.POSITIVE
          });
        });
      }
    }
  });
}
__name(forkDevWorker, "forkDevWorker");
process.on("message", (message) => {
  fileLog(`ChildProcess(${process.pid}), message: ${JSON.stringify(message)} `, "forkDevWorker", "info");
  if (message.type === rpc_exports.RpcGMCallTypes.EXIT) {
    fileLog(`ChildProcess(${process.pid}) SIGTERM, Federation DevServer will exit...`, "forkDevWorker", "error");
    moduleServer.exit();
    process.exit(0);
  }
});
rpc_exports.exposeRpc(forkDevWorker);
export {
  forkDevWorker
};
