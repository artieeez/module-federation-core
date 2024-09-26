import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { LOCALHOST } from "../../constant";
var ipv4 = typeof FEDERATION_IPV4 !== "undefined" ? FEDERATION_IPV4 : "127.0.0.1";
var remoteIpStrategy = typeof REMOTE_IP_STRATEGY !== "undefined" ? REMOTE_IP_STRATEGY : "inherit";
function replaceObjectLocalhost(key, obj) {
  if (remoteIpStrategy !== "ipv4") {
    return;
  }
  if (!(key in obj)) {
    return;
  }
  var remote = obj[key];
  if (remote && typeof remote === "string" && remote.includes(LOCALHOST)) {
    obj[key] = replaceLocalhost(remote);
  }
}
function replaceLocalhost(url) {
  return url.replace(LOCALHOST, ipv4);
}
var resolveEntryIpv4Plugin = function() {
  return {
    name: "resolve-entry-ipv4",
    beforeRegisterRemote: function beforeRegisterRemote(args) {
      var remote = args.remote;
      replaceObjectLocalhost("entry", remote);
      return args;
    },
    afterResolve: function afterResolve(args) {
      return _async_to_generator(function() {
        var remoteInfo;
        return _ts_generator(this, function(_state) {
          remoteInfo = args.remoteInfo;
          replaceObjectLocalhost("entry", remoteInfo);
          return [
            2,
            args
          ];
        });
      })();
    },
    beforeLoadRemoteSnapshot: function beforeLoadRemoteSnapshot(args) {
      var moduleInfo = args.moduleInfo;
      if ("entry" in moduleInfo) {
        replaceObjectLocalhost("entry", moduleInfo);
        return args;
      }
      if ("version" in moduleInfo) {
        replaceObjectLocalhost("version", moduleInfo);
      }
      return args;
    },
    loadRemoteSnapshot: function loadRemoteSnapshot(args) {
      var remoteSnapshot = args.remoteSnapshot;
      if ("publicPath" in remoteSnapshot) {
        replaceObjectLocalhost("publicPath", remoteSnapshot);
      }
      if ("getPublicPath" in remoteSnapshot) {
        replaceObjectLocalhost("getPublicPath", remoteSnapshot);
      }
      if (remoteSnapshot.remotesInfo) {
        Object.keys(remoteSnapshot.remotesInfo).forEach(function(key) {
          var remoteInfo = remoteSnapshot.remotesInfo[key];
          replaceObjectLocalhost("matchedVersion", remoteInfo);
        });
      }
      return args;
    }
  };
};
var resolve_entry_ipv4_default = resolveEntryIpv4Plugin;
export {
  resolve_entry_ipv4_default as default
};
