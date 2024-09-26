import React__default, { useContext } from "react";
import * as ReactRouterDom from "react-router-dom/dist/index.js";
export * from "react-router-dom/dist/index.js";
import { R as RouterContext, L as LoggerInstance } from "./context-Bw2PEwa6.js";
function WraperRouter(props) {
  const { basename, ...propsRes } = props;
  const routerContextProps = useContext(RouterContext) || {};
  LoggerInstance.log(`WraperRouter info >>>`, {
    ...routerContextProps,
    routerContextProps,
    WraperRouterProps: props
  });
  if (routerContextProps == null ? void 0 : routerContextProps.memoryRoute) {
    return /* @__PURE__ */ React__default.createElement(
      ReactRouterDom.MemoryRouter,
      {
        ...props,
        initialEntries: [routerContextProps == null ? void 0 : routerContextProps.memoryRoute.entryPath]
      }
    );
  }
  return /* @__PURE__ */ React__default.createElement(
    ReactRouterDom.BrowserRouter,
    {
      ...propsRes,
      basename: (routerContextProps == null ? void 0 : routerContextProps.basename) || basename
    }
  );
}
function WraperRouterProvider(props) {
  const { router, ...propsRes } = props;
  const routerContextProps = useContext(RouterContext) || {};
  const routers = router.routes;
  LoggerInstance.log(`WraperRouterProvider info >>>`, {
    ...routerContextProps,
    routerContextProps,
    WraperRouterProviderProps: props,
    router
  });
  const RouterProvider = ReactRouterDom["RouterProvider"];
  const createMemoryRouter = ReactRouterDom["createMemoryRouter"];
  const createBrowserRouter = ReactRouterDom["createBrowserRouter"];
  if (routerContextProps.memoryRoute) {
    const MemeoryRouterInstance = createMemoryRouter(routers, {
      initialEntries: [routerContextProps == null ? void 0 : routerContextProps.memoryRoute.entryPath]
    });
    return /* @__PURE__ */ React__default.createElement(RouterProvider, { router: MemeoryRouterInstance });
  } else {
    const BrowserRouterInstance = createBrowserRouter(routers, {
      basename: routerContextProps.basename,
      future: router.future,
      window: router.window
    });
    return /* @__PURE__ */ React__default.createElement(RouterProvider, { ...propsRes, router: BrowserRouterInstance });
  }
}
export {
  WraperRouter as BrowserRouter,
  WraperRouterProvider as RouterProvider
};
