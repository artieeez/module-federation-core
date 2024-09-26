import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from "react";
import { getInstance } from "@module-federation/enhanced/runtime";
import { ErrorBoundary } from "react-error-boundary";
function getLoadedRemoteInfos(instance, id) {
  const { name, expose } = instance.remoteHandler.idToRemoteMap[id] || {};
  if (!name) {
    return;
  }
  const module = instance.moduleCache.get(name);
  if (!module) {
    return;
  }
  const { remoteSnapshot } = instance.snapshotHandler.getGlobalRemoteInfo(module.remoteInfo);
  return {
    ...module.remoteInfo,
    snapshot: remoteSnapshot,
    expose
  };
}
function getTargetModuleInfo(id) {
  const instance = getInstance();
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
  const instance = getInstance();
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
      links.push(/* @__PURE__ */ _jsx("link", {
        href: `${publicPath}${file}`,
        rel: "stylesheet",
        type: "text/css"
      }, `${file.split(".")[0]}_${index}`));
    });
  }
  if (injectScript) {
    scripts.push(/* @__PURE__ */ _jsx("script", {
      async: true,
      src: `${publicPath}${remoteEntry}`,
      crossOrigin: "anonymous"
    }, remoteEntry.split(".")[0]));
    [
      ...targetModule.assets.js.sync
    ].forEach((file, index) => {
      scripts.push(/* @__PURE__ */ _jsx("script", {
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
    const LazyComponent = /* @__PURE__ */ React.lazy(async () => {
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
            default: () => /* @__PURE__ */ _jsxs(_Fragment, {
              children: [
                assets,
                /* @__PURE__ */ _jsx(Com, {
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
        const FallbackNode = /* @__PURE__ */ _jsx(FallbackFunctionComponent, {
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
