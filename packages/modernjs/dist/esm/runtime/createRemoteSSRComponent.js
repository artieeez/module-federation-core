import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { getInstance } from "@module-federation/enhanced/runtime";
import { ErrorBoundary } from "react-error-boundary";
function getLoadedRemoteInfos(instance, id) {
  var _ref = instance.remoteHandler.idToRemoteMap[id] || {}, name = _ref.name, expose = _ref.expose;
  if (!name) {
    return;
  }
  var module = instance.moduleCache.get(name);
  if (!module) {
    return;
  }
  var remoteSnapshot = instance.snapshotHandler.getGlobalRemoteInfo(module.remoteInfo).remoteSnapshot;
  return _object_spread_props(_object_spread({}, module.remoteInfo), {
    snapshot: remoteSnapshot,
    expose
  });
}
function getTargetModuleInfo(id) {
  var instance = getInstance();
  if (!instance) {
    return;
  }
  var loadedRemoteInfo = getLoadedRemoteInfos(instance, id);
  if (!loadedRemoteInfo) {
    return;
  }
  var snapshot = loadedRemoteInfo.snapshot;
  if (!snapshot) {
    return;
  }
  var publicPath = "publicPath" in snapshot ? snapshot.publicPath : "getPublicPath" in snapshot ? new Function(snapshot.getPublicPath)() : "";
  if (!publicPath) {
    return;
  }
  var modules = "modules" in snapshot ? snapshot.modules : [];
  var targetModule = modules.find(function(m) {
    return m.modulePath === loadedRemoteInfo.expose;
  });
  if (!targetModule) {
    return;
  }
  var remoteEntry = "remoteEntry" in snapshot ? snapshot.remoteEntry : "";
  if (!remoteEntry) {
    return;
  }
  return {
    module: targetModule,
    publicPath,
    remoteEntry
  };
}
function collectSSRAssets(options) {
  var _ref = typeof options === "string" ? {
    id: options
  } : options, id = _ref.id, _ref_injectLink = _ref.injectLink, injectLink = _ref_injectLink === void 0 ? true : _ref_injectLink, _ref_injectScript = _ref.injectScript, injectScript = _ref_injectScript === void 0 ? true : _ref_injectScript;
  var links = [];
  var scripts = [];
  var instance = getInstance();
  if (!instance || !injectLink && !injectScript) {
    return _to_consumable_array(scripts).concat(_to_consumable_array(links));
  }
  var moduleAndPublicPath = getTargetModuleInfo(id);
  if (!moduleAndPublicPath) {
    return _to_consumable_array(scripts).concat(_to_consumable_array(links));
  }
  var targetModule = moduleAndPublicPath.module, publicPath = moduleAndPublicPath.publicPath, remoteEntry = moduleAndPublicPath.remoteEntry;
  if (injectLink) {
    _to_consumable_array(targetModule.assets.css.sync).concat(_to_consumable_array(targetModule.assets.css.async)).forEach(function(file, index) {
      links.push(/* @__PURE__ */ _jsx("link", {
        href: "".concat(publicPath).concat(file),
        rel: "stylesheet",
        type: "text/css"
      }, "".concat(file.split(".")[0], "_").concat(index)));
    });
  }
  if (injectScript) {
    scripts.push(/* @__PURE__ */ _jsx("script", {
      async: true,
      src: "".concat(publicPath).concat(remoteEntry),
      crossOrigin: "anonymous"
    }, remoteEntry.split(".")[0]));
    _to_consumable_array(targetModule.assets.js.sync).forEach(function(file, index) {
      scripts.push(/* @__PURE__ */ _jsx("script", {
        async: true,
        src: "".concat(publicPath).concat(file),
        crossOrigin: "anonymous"
      }, "".concat(file.split(".")[0], "_").concat(index)));
    });
  }
  return _to_consumable_array(scripts).concat(_to_consumable_array(links));
}
function createRemoteSSRComponent(info) {
  return function(props) {
    var exportName = (info === null || info === void 0 ? void 0 : info.export) || "default";
    var LazyComponent = /* @__PURE__ */ React.lazy(/* @__PURE__ */ _async_to_generator(function() {
      var m, moduleId, assets, Com, err, FallbackFunctionComponent, FallbackNode;
      return _ts_generator(this, function(_state) {
        switch (_state.label) {
          case 0:
            _state.trys.push([
              0,
              2,
              ,
              3
            ]);
            return [
              4,
              info.loader()
            ];
          case 1:
            m = _state.sent();
            if (!m) {
              throw new Error("load remote failed");
            }
            moduleId = m && m[Symbol.for("mf_module_id")];
            assets = collectSSRAssets({
              id: moduleId
            });
            Com = m[exportName];
            if (exportName in m && typeof Com === "function") {
              return [
                2,
                {
                  default: function() {
                    return /* @__PURE__ */ _jsxs(_Fragment, {
                      children: [
                        assets,
                        /* @__PURE__ */ _jsx(Com, _object_spread({}, props))
                      ]
                    });
                  }
                }
              ];
            } else {
              throw Error("Make sure that ".concat(moduleId, " has the correct export when export is ").concat(String(exportName)));
            }
            return [
              3,
              3
            ];
          case 2:
            err = _state.sent();
            if (!info.fallback) {
              throw err;
            }
            FallbackFunctionComponent = info.fallback;
            FallbackNode = /* @__PURE__ */ _jsx(FallbackFunctionComponent, {
              error: err,
              resetErrorBoundary: function() {
                console.log('SSR mode not support "resetErrorBoundary" !');
              }
            });
            return [
              2,
              {
                default: function() {
                  return FallbackNode;
                }
              }
            ];
          case 3:
            return [
              2
            ];
        }
      });
    }));
    return /* @__PURE__ */ _jsx(ErrorBoundary, {
      FallbackComponent: info.fallback,
      children: /* @__PURE__ */ _jsx(React.Suspense, {
        fallback: info.loading,
        children: /* @__PURE__ */ _jsx(LazyComponent, {})
      })
    });
  };
}
export {
  collectSSRAssets,
  createRemoteSSRComponent
};
