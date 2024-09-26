import { LOCALHOST } from "../../constant";
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
  if (remote && typeof remote === "string" && remote.includes(LOCALHOST)) {
    obj[key] = replaceLocalhost(remote);
  }
}
function replaceLocalhost(url) {
  return url.replace(LOCALHOST, ipv4);
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
export {
  resolve_entry_ipv4_default as default
};
