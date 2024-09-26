"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
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
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var resolve_entry_ipv4_exports = {};
__export(resolve_entry_ipv4_exports, {
  default: () => resolve_entry_ipv4_default
});
module.exports = __toCommonJS(resolve_entry_ipv4_exports);
var import_constant = require("../../constant");
const ipv4 = typeof FEDERATION_IPV4 !== "undefined" ? FEDERATION_IPV4 : "127.0.0.1";
const remoteIpStrategy = typeof REMOTE_IP_STRATEGY !== "undefined" ? REMOTE_IP_STRATEGY : "inherit";
function replaceObjectLocalhost(key, obj) {
  if (remoteIpStrategy !== "ipv4") {
    return;
  }
  if (!(key in obj)) {
    return;
  }
  const remote = obj[key];
  if (remote && typeof remote === "string" && remote.includes(import_constant.LOCALHOST)) {
    obj[key] = replaceLocalhost(remote);
  }
}
function replaceLocalhost(url) {
  return url.replace(import_constant.LOCALHOST, ipv4);
}
const resolveEntryIpv4Plugin = () => ({
  name: "resolve-entry-ipv4",
  beforeRegisterRemote(args) {
    const { remote } = args;
    replaceObjectLocalhost("entry", remote);
    return args;
  },
  async afterResolve(args) {
    const { remoteInfo } = args;
    replaceObjectLocalhost("entry", remoteInfo);
    return args;
  },
  beforeLoadRemoteSnapshot(args) {
    const { moduleInfo } = args;
    if ("entry" in moduleInfo) {
      replaceObjectLocalhost("entry", moduleInfo);
      return args;
    }
    if ("version" in moduleInfo) {
      replaceObjectLocalhost("version", moduleInfo);
    }
    return args;
  },
  loadRemoteSnapshot(args) {
    const { remoteSnapshot } = args;
    if ("publicPath" in remoteSnapshot) {
      replaceObjectLocalhost("publicPath", remoteSnapshot);
    }
    if ("getPublicPath" in remoteSnapshot) {
      replaceObjectLocalhost("getPublicPath", remoteSnapshot);
    }
    if (remoteSnapshot.remotesInfo) {
      Object.keys(remoteSnapshot.remotesInfo).forEach((key) => {
        const remoteInfo = remoteSnapshot.remotesInfo[key];
        replaceObjectLocalhost("matchedVersion", remoteInfo);
      });
    }
    return args;
  }
});
var resolve_entry_ipv4_default = resolveEntryIpv4Plugin;
