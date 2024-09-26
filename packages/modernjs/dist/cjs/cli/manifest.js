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
var manifest_exports = {};
__export(manifest_exports, {
  updateStatsAndManifest: () => updateStatsAndManifest
});
module.exports = __toCommonJS(manifest_exports);
var import_path = __toESM(require("path"));
var import_utils = require("@modern-js/utils");
var import_constant = require("../constant");
function mergeStats(browserStats, nodeStats) {
  const ssrRemoteEntry = nodeStats.metaData.remoteEntry;
  ssrRemoteEntry.path = import_constant.MODERN_JS_SERVER_DIR;
  browserStats.metaData.ssrRemoteEntry = ssrRemoteEntry;
  return browserStats;
}
function mergeManifest(browserManifest, nodeManifest) {
  const ssrRemoteEntry = nodeManifest.metaData.remoteEntry;
  ssrRemoteEntry.path = import_constant.MODERN_JS_SERVER_DIR;
  browserManifest.metaData.ssrRemoteEntry = ssrRemoteEntry;
  return browserManifest;
}
function mergeStatsAndManifest(nodePlugin, browserPlugin) {
  const nodeResourceInfo = nodePlugin.statsResourceInfo;
  const browserResourceInfo = browserPlugin.statsResourceInfo;
  if (!browserResourceInfo || !nodeResourceInfo || !browserResourceInfo.stats || !nodeResourceInfo.stats || !browserResourceInfo.manifest || !nodeResourceInfo.manifest) {
    throw new Error("can not get browserResourceInfo or nodeResourceInfo");
  }
  const mergedStats = mergeStats(browserResourceInfo.stats.stats, nodeResourceInfo.stats.stats);
  const mergedManifest = mergeManifest(browserResourceInfo.manifest.manifest, nodeResourceInfo.manifest.manifest);
  return {
    mergedStats,
    mergedStatsFilePath: browserResourceInfo.stats.filename,
    mergedManifest,
    mergedManifestFilePath: browserResourceInfo.manifest.filename
  };
}
function updateStatsAndManifest(nodePlugin, browserPlugin, outputDir) {
  const { mergedStats, mergedStatsFilePath, mergedManifest, mergedManifestFilePath } = mergeStatsAndManifest(nodePlugin, browserPlugin);
  import_utils.fs.writeFileSync(import_path.default.resolve(outputDir, mergedStatsFilePath), JSON.stringify(mergedStats, null, 2));
  import_utils.fs.writeFileSync(import_path.default.resolve(outputDir, mergedManifestFilePath), JSON.stringify(mergedManifest, null, 2));
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  updateStatsAndManifest
});
