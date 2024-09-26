import * as React from "react";
import React__default, { createContext, Component, createElement, isValidElement, forwardRef, useRef, useEffect, useContext, useState } from "react";
import { L as LoggerInstance, p as pathJoin, f, a as atLeastReact18, R as RouterContext } from "./context-Bw2PEwa6.js";
import * as ReactRouterDOM from "react-router-dom";
import ReactDOM from "react-dom";
const ErrorBoundaryContext = createContext(null);
const initialState = {
  didCatch: false,
  error: null
};
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.resetErrorBoundary = this.resetErrorBoundary.bind(this);
    this.state = initialState;
  }
  static getDerivedStateFromError(error) {
    return {
      didCatch: true,
      error
    };
  }
  resetErrorBoundary() {
    const {
      error
    } = this.state;
    if (error !== null) {
      var _this$props$onReset, _this$props;
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      (_this$props$onReset = (_this$props = this.props).onReset) === null || _this$props$onReset === void 0 ? void 0 : _this$props$onReset.call(_this$props, {
        args,
        reason: "imperative-api"
      });
      this.setState(initialState);
    }
  }
  componentDidCatch(error, info) {
    var _this$props$onError, _this$props2;
    (_this$props$onError = (_this$props2 = this.props).onError) === null || _this$props$onError === void 0 ? void 0 : _this$props$onError.call(_this$props2, error, info);
  }
  componentDidUpdate(prevProps, prevState) {
    const {
      didCatch
    } = this.state;
    const {
      resetKeys
    } = this.props;
    if (didCatch && prevState.error !== null && hasArrayChanged(prevProps.resetKeys, resetKeys)) {
      var _this$props$onReset2, _this$props3;
      (_this$props$onReset2 = (_this$props3 = this.props).onReset) === null || _this$props$onReset2 === void 0 ? void 0 : _this$props$onReset2.call(_this$props3, {
        next: resetKeys,
        prev: prevProps.resetKeys,
        reason: "keys"
      });
      this.setState(initialState);
    }
  }
  render() {
    const {
      children,
      fallbackRender,
      FallbackComponent,
      fallback
    } = this.props;
    const {
      didCatch,
      error
    } = this.state;
    let childToRender = children;
    if (didCatch) {
      const props = {
        error,
        resetErrorBoundary: this.resetErrorBoundary
      };
      if (typeof fallbackRender === "function") {
        childToRender = fallbackRender(props);
      } else if (FallbackComponent) {
        childToRender = createElement(FallbackComponent, props);
      } else if (fallback === null || isValidElement(fallback)) {
        childToRender = fallback;
      } else {
        throw error;
      }
    }
    return createElement(ErrorBoundaryContext.Provider, {
      value: {
        didCatch,
        error,
        resetErrorBoundary: this.resetErrorBoundary
      }
    }, childToRender);
  }
}
function hasArrayChanged() {
  let a = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : [];
  let b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [];
  return a.length !== b.length || a.some((item, index) => !Object.is(item, b[index]));
}
const RemoteAppWrapper = forwardRef(function(props, ref) {
  const RemoteApp2 = () => {
    LoggerInstance.log(`RemoteAppWrapper RemoteApp props >>>`, { props });
    const {
      moduleName,
      memoryRoute,
      basename,
      providerInfo,
      className,
      style,
      fallback,
      ...resProps
    } = props;
    const rootRef = ref && "current" in ref ? ref : useRef(null);
    const renderDom = useRef(null);
    const providerInfoRef = useRef(null);
    useEffect(() => {
      const renderTimeout = setTimeout(() => {
        const providerReturn = providerInfo();
        providerInfoRef.current = providerReturn;
        const renderProps = {
          moduleName,
          dom: rootRef.current,
          basename,
          memoryRoute,
          fallback,
          ...resProps
        };
        renderDom.current = rootRef.current;
        LoggerInstance.log(
          `createRemoteComponent LazyComponent render >>>`,
          renderProps
        );
        providerReturn.render(renderProps);
      });
      return () => {
        clearTimeout(renderTimeout);
        setTimeout(() => {
          var _a, _b;
          if ((_a = providerInfoRef.current) == null ? void 0 : _a.destroy) {
            LoggerInstance.log(
              `createRemoteComponent LazyComponent destroy >>>`,
              { moduleName, basename, dom: renderDom.current }
            );
            (_b = providerInfoRef.current) == null ? void 0 : _b.destroy({
              dom: renderDom.current
            });
          }
        });
      };
    }, []);
    return /* @__PURE__ */ React__default.createElement(
      "div",
      {
        className: props == null ? void 0 : props.className,
        style: props == null ? void 0 : props.style,
        ref: rootRef
      }
    );
  };
  RemoteApp2["__APP_VERSION__"] = "0.6.6";
  return /* @__PURE__ */ React__default.createElement(RemoteApp2, null);
});
function withRouterData(WrappedComponent) {
  const Component2 = forwardRef(function(props, ref) {
    var _a;
    let enableDispathPopstate = false;
    let routerContextVal;
    try {
      ReactRouterDOM.useLocation();
      enableDispathPopstate = true;
    } catch {
      enableDispathPopstate = false;
    }
    let basename = "/";
    if (!props.basename && enableDispathPopstate) {
      const ReactRouterDOMAny = ReactRouterDOM;
      const useRouteMatch = ReactRouterDOMAny["useRouteMatch"];
      const useHistory = ReactRouterDOMAny["useHistory"];
      const useHref = ReactRouterDOMAny["useHref"];
      const UNSAFE_RouteContext = ReactRouterDOMAny["UNSAFE_RouteContext"];
      if (UNSAFE_RouteContext) {
        if (useHref) {
          basename = useHref == null ? void 0 : useHref("/");
        }
        routerContextVal = useContext(UNSAFE_RouteContext);
        if (routerContextVal && routerContextVal.matches && routerContextVal.matches.length > 0) {
          const matchIndex = routerContextVal.matches.length - 1;
          const pathnameBase = routerContextVal.matches[matchIndex].pathnameBase;
          basename = pathJoin(basename, pathnameBase || "/");
        }
      } else {
        const match = useRouteMatch == null ? void 0 : useRouteMatch();
        if (useHistory) {
          const history = useHistory == null ? void 0 : useHistory();
          basename = (_a = history == null ? void 0 : history.createHref) == null ? void 0 : _a.call(history, { pathname: "/" });
        }
        if (match) {
          basename = pathJoin(basename, (match == null ? void 0 : match.path) || "/");
        }
      }
    }
    LoggerInstance.log(`createRemoteComponent withRouterData >>>`, {
      ...props,
      basename,
      routerContextVal,
      enableDispathPopstate
    });
    if (enableDispathPopstate) {
      const location = ReactRouterDOM.useLocation();
      const [pathname, setPathname] = useState(location.pathname);
      useEffect(() => {
        if (pathname !== "" && pathname !== location.pathname) {
          LoggerInstance.log(`createRemoteComponent dispatchPopstateEnv >>>`, {
            name: props.name,
            pathname: location.pathname
          });
          f();
        }
        setPathname(location.pathname);
      }, [location]);
    }
    return /* @__PURE__ */ React__default.createElement(WrappedComponent, { ...props, basename, ref });
  });
  return forwardRef(function(props, ref) {
    return /* @__PURE__ */ React__default.createElement(Component2, { ...props, ref });
  });
}
const RemoteApp = withRouterData(RemoteAppWrapper);
function createLazyRemoteComponent(info) {
  const exportName = (info == null ? void 0 : info.export) || "default";
  return React__default.lazy(async () => {
    LoggerInstance.log(`createRemoteComponent LazyComponent create >>>`, {
      lazyComponent: info.loader,
      exportName
    });
    try {
      const m2 = await info.loader();
      const moduleName = m2 && m2[Symbol.for("mf_module_id")];
      LoggerInstance.log(
        `createRemoteComponent LazyComponent loadRemote info >>>`,
        { name: moduleName, module: m2, exportName }
      );
      const exportFn = m2[exportName];
      if (exportName in m2 && typeof exportFn === "function") {
        const RemoteAppComponent = forwardRef((props, ref) => {
          return /* @__PURE__ */ React__default.createElement(
            RemoteApp,
            {
              moduleName,
              providerInfo: exportFn,
              exportName: info.export || "default",
              fallback: info.fallback,
              ref,
              ...props
            }
          );
        });
        return {
          default: RemoteAppComponent
        };
      } else {
        LoggerInstance.log(
          `createRemoteComponent LazyComponent module not found >>>`,
          { name: moduleName, module: m2, exportName }
        );
        throw Error(
          `Make sure that ${moduleName} has the correct export when export is ${String(
            exportName
          )}`
        );
      }
    } catch (error) {
      throw error;
    }
  });
}
function createRemoteComponent(info) {
  return forwardRef(
    (props, ref) => {
      const LazyComponent = createLazyRemoteComponent(info);
      return /* @__PURE__ */ React__default.createElement(ErrorBoundary, { FallbackComponent: info.fallback }, /* @__PURE__ */ React__default.createElement(React__default.Suspense, { fallback: info.loading }, /* @__PURE__ */ React__default.createElement(LazyComponent, { ...props, ref })));
    }
  );
}
var client = {};
var m = ReactDOM;
if (process.env.NODE_ENV === "production") {
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
} else {
  var i = m.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED;
  client.createRoot = function(c, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.createRoot(c, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
  client.hydrateRoot = function(c, h, o) {
    i.usingClientEntryPoint = true;
    try {
      return m.hydrateRoot(c, h, o);
    } finally {
      i.usingClientEntryPoint = false;
    }
  };
}
function createBridgeComponent(bridgeInfo) {
  return () => {
    const rootMap = /* @__PURE__ */ new Map();
    const RawComponent = (info) => {
      const { appInfo, propsInfo, ...restProps } = info;
      const { moduleName, memoryRoute, basename = "/" } = appInfo;
      return /* @__PURE__ */ React.createElement(RouterContext.Provider, { value: { moduleName, basename, memoryRoute } }, /* @__PURE__ */ React.createElement(
        bridgeInfo.rootComponent,
        {
          ...propsInfo,
          basename,
          ...restProps
        }
      ));
    };
    return {
      async render(info) {
        LoggerInstance.log(`createBridgeComponent render Info`, info);
        const {
          moduleName,
          dom,
          basename,
          memoryRoute,
          fallback,
          ...propsInfo
        } = info;
        const rootComponentWithErrorBoundary = (
          // set ErrorBoundary for RawComponent rendering error, usually caused by user app rendering error
          /* @__PURE__ */ React.createElement(ErrorBoundary, { FallbackComponent: fallback }, /* @__PURE__ */ React.createElement(
            RawComponent,
            {
              appInfo: {
                moduleName,
                basename,
                memoryRoute
              },
              propsInfo
            }
          ))
        );
        if (atLeastReact18(React)) {
          if (bridgeInfo == null ? void 0 : bridgeInfo.render) {
            Promise.resolve(
              bridgeInfo == null ? void 0 : bridgeInfo.render(rootComponentWithErrorBoundary, dom)
            ).then((root) => rootMap.set(info.dom, root));
          } else {
            const root = client.createRoot(info.dom);
            root.render(rootComponentWithErrorBoundary);
            rootMap.set(info.dom, root);
          }
        } else {
          const renderFn = (bridgeInfo == null ? void 0 : bridgeInfo.render) || ReactDOM.render;
          renderFn == null ? void 0 : renderFn(rootComponentWithErrorBoundary, info.dom);
        }
      },
      async destroy(info) {
        LoggerInstance.log(`createBridgeComponent destroy Info`, {
          dom: info.dom
        });
        if (atLeastReact18(React)) {
          const root = rootMap.get(info.dom);
          root == null ? void 0 : root.unmount();
          rootMap.delete(info.dom);
        } else {
          ReactDOM.unmountComponentAtNode(info.dom);
        }
      },
      rawComponent: bridgeInfo.rootComponent,
      __BRIDGE_FN__: (_args) => {
      }
    };
  };
}
export {
  createBridgeComponent,
  createRemoteComponent
};
