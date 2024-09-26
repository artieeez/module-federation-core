import React__default, { useContext } from "react";
import * as ReactRouterDom$1 from "react-router-dom/index.js";
import { R as RouterContext, L as LoggerInstance } from "./context-Bw2PEwa6.js";
export * from "react-router-dom/index.js";
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
      ReactRouterDom$1.MemoryRouter,
      {
        ...props,
        initialEntries: [routerContextProps == null ? void 0 : routerContextProps.memoryRoute.entryPath]
      }
    );
  }
  return /* @__PURE__ */ React__default.createElement(
    ReactRouterDom$1.BrowserRouter,
    {
      ...propsRes,
      basename: (routerContextProps == null ? void 0 : routerContextProps.basename) || basename
    }
  );
}
export {
  WraperRouter as BrowserRouter
};
