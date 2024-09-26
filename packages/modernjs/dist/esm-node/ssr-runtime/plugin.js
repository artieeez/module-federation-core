import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import hoistNonReactStatics from "hoist-non-react-statics";
import { SSRLiveReload } from "./SSRLiveReload";
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
        const nodeUtils = await import("@module-federation/node/utils");
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
        const AppWrapper = (props) => /* @__PURE__ */ _jsxs(_Fragment, {
          children: [
            /* @__PURE__ */ _jsx(SSRLiveReload, {}),
            /* @__PURE__ */ _jsx(App, {
              ...props
            })
          ]
        });
        return hoistNonReactStatics(AppWrapper, App);
      }
    };
  }
});
export {
  mfSSRPlugin
};
