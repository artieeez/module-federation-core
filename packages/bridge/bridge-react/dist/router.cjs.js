"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const ReactRouterDom = require("react-router-dom/");
const context = require("./context--mtFt3tp.cjs");
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
const ReactRouterDom__namespace = /* @__PURE__ */ _interopNamespaceDefault(ReactRouterDom);
function WrapperRouter(props) {
  const { basename, ...propsRes } = props;
  const routerContextProps = React.useContext(context.RouterContext) || {};
  context.LoggerInstance.log(`WrapperRouter info >>>`, {
    ...routerContextProps,
    routerContextProps,
    WrapperRouterProps: props
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
function WrapperRouterProvider(props) {
  const { router, ...propsRes } = props;
  const routerContextProps = React.useContext(context.RouterContext) || {};
  const routers = router.routes;
  context.LoggerInstance.log(`WrapperRouterProvider info >>>`, {
    ...routerContextProps,
    routerContextProps,
    WrapperRouterProviderProps: props,
    router
  });
  const RouterProvider = ReactRouterDom__namespace["RouterProvider"];
  const createMemoryRouter = ReactRouterDom__namespace["createMemoryRouter"];
  const createBrowserRouter = ReactRouterDom__namespace["createBrowserRouter"];
  if (routerContextProps.memoryRoute) {
    const MemeoryRouterInstance = createMemoryRouter(routers, {
      initialEntries: [routerContextProps == null ? void 0 : routerContextProps.memoryRoute.entryPath]
    });
    return /* @__PURE__ */ React.createElement(RouterProvider, { router: MemeoryRouterInstance });
  } else {
    const BrowserRouterInstance = createBrowserRouter(routers, {
      basename: routerContextProps.basename,
      future: router.future,
      window: router.window
    });
    return /* @__PURE__ */ React.createElement(RouterProvider, { ...propsRes, router: BrowserRouterInstance });
  }
}
exports.BrowserRouter = WrapperRouter;
exports.RouterProvider = WrapperRouterProvider;
Object.keys(ReactRouterDom).forEach((k) => {
  if (k !== "default" && !Object.prototype.hasOwnProperty.call(exports, k))
    Object.defineProperty(exports, k, {
      enumerable: true,
      get: () => ReactRouterDom[k]
    });
});
