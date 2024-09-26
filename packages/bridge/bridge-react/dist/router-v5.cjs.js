"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const ReactRouterDom$1 = require("react-router-dom/index.js");
const context = require("./context--mtFt3tp.cjs");
const ReactRouterDom = require("react-router-dom/index.js");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const ReactRouterDom__namespace = /* @__PURE__ */ _interopNamespaceDefault(ReactRouterDom$1);
function WraperRouter(props) {
  const { basename, ...propsRes } = props;
  const routerContextProps = React.useContext(context.RouterContext) || {};
  context.LoggerInstance.log(`WraperRouter info >>>`, {
    ...routerContextProps,
    routerContextProps,
    WraperRouterProps: props
  });
  if (routerContextProps == null ? void 0 : routerContextProps.memoryRoute) {
    return /* @__PURE__ */ React.createElement(
      ReactRouterDom__namespace.MemoryRouter,
      {
        ...props,
        initialEntries: [routerContextProps == null ? void 0 : routerContextProps.memoryRoute.entryPath]
      }
    );
  }
  return /* @__PURE__ */ React.createElement(
    ReactRouterDom__namespace.BrowserRouter,
    {
      ...propsRes,
      basename: (routerContextProps == null ? void 0 : routerContextProps.basename) || basename
    }
  );
}
exports.BrowserRouter = WraperRouter;
Object.keys(ReactRouterDom).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
    Object.defineProperty(exports, k, {
      enumerable: true,
      get: () => ReactRouterDom[k]
    });
});
