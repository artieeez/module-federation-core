"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
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
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var createRemoteSSRComponent_exports = {};
__export(createRemoteSSRComponent_exports, {
  collectSSRAssets: () => collectSSRAssets,
  createRemoteSSRComponent: () => createRemoteSSRComponent
});
module.exports = __toCommonJS(createRemoteSSRComponent_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_react = __toESM(require("react"));
var import_runtime = require("@module-federation/enhanced/runtime");
var import_react_error_boundary = require("react-error-boundary");
function getLoadedRemoteInfos(instance, id) {
  const { name, expose } = instance.remoteHandler.idToRemoteMap[id] || {};
  if (!name) {
    return;
  }
  const module2 = instance.moduleCache.get(name);
  if (!module2) {
    return;
  }
  const { remoteSnapshot } = instance.snapshotHandler.getGlobalRemoteInfo(module2.remoteInfo);
  return {
    ...module2.remoteInfo,
    snapshot: remoteSnapshot,
    expose
  };
}
function getTargetModuleInfo(id) {
  const instance = (0, import_runtime.getInstance)();
  if (!instance) {
    return;
  }
  const loadedRemoteInfo = getLoadedRemoteInfos(instance, id);
  if (!loadedRemoteInfo) {
    return;
  }
  const snapshot = loadedRemoteInfo.snapshot;
  if (!snapshot) {
    return;
  }
  const publicPath = "publicPath" in snapshot ? snapshot.publicPath : "getPublicPath" in snapshot ? new Function(snapshot.getPublicPath)() : "";
  if (!publicPath) {
    return;
  }
  const modules = "modules" in snapshot ? snapshot.modules : [];
  const targetModule = modules.find((m) => m.modulePath === loadedRemoteInfo.expose);
  if (!targetModule) {
    return;
  }
  const remoteEntry = "remoteEntry" in snapshot ? snapshot.remoteEntry : "";
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
  const { id, injectLink = true, injectScript = true } = typeof options === "string" ? {
    id: options
  } : options;
  const links = [];
  const scripts = [];
  const instance = (0, import_runtime.getInstance)();
  if (!instance || !injectLink && !injectScript) {
    return [
      ...scripts,
      ...links
    ];
  }
  const moduleAndPublicPath = getTargetModuleInfo(id);
  if (!moduleAndPublicPath) {
    return [
      ...scripts,
      ...links
    ];
  }
  const { module: targetModule, publicPath, remoteEntry } = moduleAndPublicPath;
  if (injectLink) {
    [
      ...targetModule.assets.css.sync,
      ...targetModule.assets.css.async
    ].forEach((file, index) => {
      links.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("link", {
        href: `${publicPath}${file}`,
        rel: "stylesheet",
        type: "text/css"
      }, `${file.split(".")[0]}_${index}`));
    });
  }
  if (injectScript) {
    scripts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
      async: true,
      src: `${publicPath}${remoteEntry}`,
      crossOrigin: "anonymous"
    }, remoteEntry.split(".")[0]));
    [
      ...targetModule.assets.js.sync
    ].forEach((file, index) => {
      scripts.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
        async: true,
        src: `${publicPath}${file}`,
        crossOrigin: "anonymous"
      }, `${file.split(".")[0]}_${index}`));
    });
  }
  return [
    ...scripts,
    ...links
  ];
}
function createRemoteSSRComponent(info) {
  return (props) => {
    const exportName = (info === null || info === void 0 ? void 0 : info.export) || "default";
    const LazyComponent = /* @__PURE__ */ import_react.default.lazy(async () => {
      try {
        const m = await info.loader();
        if (!m) {
          throw new Error("load remote failed");
        }
        const moduleId = m && m[Symbol.for("mf_module_id")];
        const assets = collectSSRAssets({
          id: moduleId
        });
        const Com = m[exportName];
        if (exportName in m && typeof Com === "function") {
          return {
            default: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
              children: [
                assets,
                /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Com, {
                  ...props
                })
              ]
            })
          };
        } else {
          throw Error(`Make sure that ${moduleId} has the correct export when export is ${String(exportName)}`);
        }
      } catch (err) {
        if (!info.fallback) {
          throw err;
        }
        const FallbackFunctionComponent = info.fallback;
        const FallbackNode = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FallbackFunctionComponent, {
          error: err,
          resetErrorBoundary: () => {
            console.log('SSR mode not support "resetErrorBoundary" !');
          }
        });
        return {
          default: () => FallbackNode
        };
      }
    });
    return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react_error_boundary.ErrorBoundary, {
      FallbackComponent: info.fallback,
      children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_react.default.Suspense, {
        fallback: info.loading,
        children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LazyComponent, {})
      })
    });
  };
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  collectSSRAssets,
  createRemoteSSRComponent
});
