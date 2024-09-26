import path from "path";
import { fs } from "@modern-js/utils";
import { MODERN_JS_SERVER_DIR } from "../constant";
function mergeStats(browserStats, nodeStats) {
  var ssrRemoteEntry = nodeStats.metaData.remoteEntry;
  ssrRemoteEntry.path = MODERN_JS_SERVER_DIR;
  browserStats.metaData.ssrRemoteEntry = ssrRemoteEntry;
  return browserStats;
}
function mergeManifest(browserManifest, nodeManifest) {
  var ssrRemoteEntry = nodeManifest.metaData.remoteEntry;
  ssrRemoteEntry.path = MODERN_JS_SERVER_DIR;
  browserManifest.metaData.ssrRemoteEntry = ssrRemoteEntry;
  return browserManifest;
}
function mergeStatsAndManifest(nodePlugin, browserPlugin) {
  var nodeResourceInfo = nodePlugin.statsResourceInfo;
  var browserResourceInfo = browserPlugin.statsResourceInfo;
  if (!browserResourceInfo || !nodeResourceInfo || !browserResourceInfo.stats || !nodeResourceInfo.stats || !browserResourceInfo.manifest || !nodeResourceInfo.manifest) {
    throw new Error("can not get browserResourceInfo or nodeResourceInfo");
  }
  var mergedStats = mergeStats(browserResourceInfo.stats.stats, nodeResourceInfo.stats.stats);
  var mergedManifest = mergeManifest(browserResourceInfo.manifest.manifest, nodeResourceInfo.manifest.manifest);
  return {
    mergedStats,
    mergedStatsFilePath: browserResourceInfo.stats.filename,
    mergedManifest,
    mergedManifestFilePath: browserResourceInfo.manifest.filename
  };
}
function updateStatsAndManifest(nodePlugin, browserPlugin, outputDir) {
  var _mergeStatsAndManifest = mergeStatsAndManifest(nodePlugin, browserPlugin), mergedStats = _mergeStatsAndManifest.mergedStats, mergedStatsFilePath = _mergeStatsAndManifest.mergedStatsFilePath, mergedManifest = _mergeStatsAndManifest.mergedManifest, mergedManifestFilePath = _mergeStatsAndManifest.mergedManifestFilePath;
  fs.writeFileSync(path.resolve(outputDir, mergedStatsFilePath), JSON.stringify(mergedStats, null, 2));
  fs.writeFileSync(path.resolve(outputDir, mergedManifestFilePath), JSON.stringify(mergedManifest, null, 2));
}
export {
  updateStatsAndManifest
};
