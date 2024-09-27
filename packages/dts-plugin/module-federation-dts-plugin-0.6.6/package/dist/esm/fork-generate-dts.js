import {
  RpcGMCallTypes,
  exposeRpc,
  generateTypes
} from "./chunk-FVLVCOUE.js";
import "./chunk-MY3H5SQO.js";
import {
  __async,
  __name
} from "./chunk-4CSLH7II.js";

// packages/dts-plugin/src/core/lib/forkGenerateDts.ts
function forkGenerateDts(options) {
  return __async(this, null, function* () {
    return generateTypes(options);
  });
}
__name(forkGenerateDts, "forkGenerateDts");
process.on("message", (message) => {
  if (message.type === RpcGMCallTypes.EXIT) {
    process.exit(0);
  }
});
exposeRpc(forkGenerateDts);
export {
  forkGenerateDts
};
