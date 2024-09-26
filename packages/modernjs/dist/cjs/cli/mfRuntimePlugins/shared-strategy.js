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
var shared_strategy_exports = {};
__export(shared_strategy_exports, {
  default: () => shared_strategy_default
});
module.exports = __toCommonJS(shared_strategy_exports);
const sharedStrategy = () => ({
  name: "shared-strategy-plugin",
  beforeInit(args) {
    const { userOptions } = args;
    const shared = userOptions.shared;
    if (shared) {
      Object.keys(shared).forEach((sharedKey) => {
        const sharedConfigs = shared[sharedKey];
        const arraySharedConfigs = Array.isArray(sharedConfigs) ? sharedConfigs : [
          sharedConfigs
        ];
        arraySharedConfigs.forEach((s) => {
          s.strategy = "loaded-first";
        });
      });
    }
    return args;
  }
});
var shared_strategy_default = sharedStrategy;
