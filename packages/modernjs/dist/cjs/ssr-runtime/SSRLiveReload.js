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
var SSRLiveReload_exports = {};
__export(SSRLiveReload_exports, {
  SSRLiveReload: () => SSRLiveReload
});
module.exports = __toCommonJS(SSRLiveReload_exports);
var import_jsx_runtime = require("react/jsx-runtime");
function SSRLiveReload() {
  if (process.env.NODE_ENV !== "development") {
    return null;
  }
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("script", {
    suppressHydrationWarning: true,
    dangerouslySetInnerHTML: {
      __html: String.raw`
      if(${globalThis.shouldUpdate}){
        location.reload();
      }
   `
    }
  });
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  SSRLiveReload
});
