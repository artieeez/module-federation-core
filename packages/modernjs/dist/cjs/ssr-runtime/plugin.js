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
var plugin_exports = {};
__export(plugin_exports, {
  mfSSRPlugin: () => mfSSRPlugin
});
module.exports = __toCommonJS(plugin_exports);
var import_jsx_runtime = require("react/jsx-runtime");
var import_hoist_non_react_statics = __toESM(require("hoist-non-react-statics"));
var import_SSRLiveReload = require("./SSRLiveReload");
const mfSSRPlugin = () => ({
  name: "@module-federation/modern-js",
  setup: () => {
    return {
      async init({ context }, next) {
        if (typeof window !== "undefined") {
          return next({
            context
          });
        }
        globalThis.shouldUpdate = false;
        const nodeUtils = await Promise.resolve().then(() => __toESM(require("@module-federation/node/utils")));
        const shouldUpdate = await nodeUtils.revalidate();
        if (shouldUpdate) {
          console.log("should RELOAD", shouldUpdate);
          await nodeUtils.flushChunks();
          globalThis.shouldUpdate = true;
        }
        return next({
          context
        });
      },
      wrapRoot(App) {
        const AppWrapper = (props) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, {
          children: [
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_SSRLiveReload.SSRLiveReload, {}),
            /* @__PURE__ */ (0, import_jsx_runtime.jsx)(App, {
              ...props
            })
          ]
        });
        return (0, import_hoist_non_react_statics.default)(AppWrapper, App);
      }
    };
  }
});
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  mfSSRPlugin
});
