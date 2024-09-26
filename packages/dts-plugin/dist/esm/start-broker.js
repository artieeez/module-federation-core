import {
  Broker,
  fileLog
} from "./chunk-MY3H5SQO.js";
import {
  __async,
  __name
} from "./chunk-4CSLH7II.js";

// packages/dts-plugin/src/server/broker/startBroker.ts
var broker;
function getBroker() {
  return broker;
}
__name(getBroker, "getBroker");
function startBroker() {
  return __async(this, null, function* () {
    var _a;
    if (getBroker()) {
      return;
    }
    broker = new Broker();
    yield broker.start();
    (_a = process.send) == null ? void 0 : _a.call(process, "ready");
  });
}
__name(startBroker, "startBroker");
process.on("message", (message) => {
  if (message === "start") {
    fileLog(`startBroker... ${process.pid}`, "StartBroker", "info");
    startBroker();
  }
});
export {
  getBroker
};
