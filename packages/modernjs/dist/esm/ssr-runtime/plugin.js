import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import hoistNonReactStatics from "hoist-non-react-statics";
import { SSRLiveReload } from "./SSRLiveReload";
var mfSSRPlugin = function() {
  return {
    name: "@module-federation/modern-js",
    setup: function() {
      return {
        init: function init(param, next) {
          var context = param.context;
          return _async_to_generator(function() {
            var nodeUtils, shouldUpdate;
            return _ts_generator(this, function(_state) {
              switch (_state.label) {
                case 0:
                  if (typeof window !== "undefined") {
                    return [
                      2,
                      next({
                        context
                      })
                    ];
                  }
                  globalThis.shouldUpdate = false;
                  return [
                    4,
                    import("@module-federation/node/utils")
                  ];
                case 1:
                  nodeUtils = _state.sent();
                  return [
                    4,
                    nodeUtils.revalidate()
                  ];
                case 2:
                  shouldUpdate = _state.sent();
                  if (!shouldUpdate)
                    return [
                      3,
                      4
                    ];
                  console.log("should RELOAD", shouldUpdate);
                  return [
                    4,
                    nodeUtils.flushChunks()
                  ];
                case 3:
                  _state.sent();
                  globalThis.shouldUpdate = true;
                  _state.label = 4;
                case 4:
                  return [
                    2,
                    next({
                      context
                    })
                  ];
              }
            });
          })();
        },
        wrapRoot: function wrapRoot(App) {
          var AppWrapper = function(props) {
            return /* @__PURE__ */ _jsxs(_Fragment, {
              children: [
                /* @__PURE__ */ _jsx(SSRLiveReload, {}),
                /* @__PURE__ */ _jsx(App, _object_spread({}, props))
              ]
            });
          };
          return hoistNonReactStatics(AppWrapper, App);
        }
      };
    }
  };
};
export {
  mfSSRPlugin
};
