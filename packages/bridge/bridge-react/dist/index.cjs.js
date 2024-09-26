"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const React = require("react");
const context = require("./context--mtFt3tp.cjs");
const ReactRouterDOM = require("react-router-dom");
const ReactDOM = require("react-dom");
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
const React__namespace = /* @__PURE__ */ _interopNamespaceDefault(React);
const ReactRouterDOM__namespace = /* @__PURE__ */ _interopNamespaceDefault(ReactRouterDOM);
const ErrorBoundaryContext = React.createContext(null);
const initialState = {
  didCatch: false,
  error: null
};
class ErrorBoundary extends React.Component {
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
        childToRender = React.createElement(FallbackComponent, props);
      } else if (fallback === null || React.isValidElement(fallback)) {
        childToRender = fallback;
      } else {
        throw error;
      }
    }
    return React.createElement(ErrorBoundaryContext.Provider, {
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
const RemoteAppWrapper = React.forwardRef(function(props, ref) {
  const RemoteApp2 = () => {
    context.LoggerInstance.log(`RemoteAppWrapper RemoteApp props >>>`, { props });
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
    const rootRef = ref && "current" in ref ? ref : React.useRef(null);
    const renderDom = React.useRef(null);
    const providerInfoRef = React.useRef(null);
    React.useEffect(() => {
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
        context.LoggerInstance.log(
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
            context.LoggerInstance.log(
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
    return /* @__PURE__ */ React.createElement(
      "div",
      {
        className: props == null ? void 0 : props.className,
        style: props == null ? void 0 : props.style,
        ref: rootRef
      }
    );
  };
  RemoteApp2["__APP_VERSION__"] = "0.6.6";
  return /* @__PURE__ */ React.createElement(RemoteApp2, null);
});
function withRouterData(WrappedComponent) {
  const Component = React.forwardRef(function(props, ref) {
    var _a;
    let enableDispathPopstate = false;
    let routerContextVal;
    try {
      ReactRouterDOM__namespace.useLocation();
      enableDispathPopstate = true;
    } catch {
      enableDispathPopstate = false;
    }
    let basename = "/";
    if (!props.basename && enableDispathPopstate) {
      const ReactRouterDOMAny = ReactRouterDOM__namespace;
      const useRouteMatch = ReactRouterDOMAny["useRouteMatch"];
      const useHistory = ReactRouterDOMAny["useHistory"];
      const useHref = ReactRouterDOMAny["useHref"];
      const UNSAFE_RouteContext = ReactRouterDOMAny["UNSAFE_RouteContext"];
      if (UNSAFE_RouteContext) {
        if (useHref) {
          basename = useHref == null ? void 0 : useHref("/");
        }
        routerContextVal = React.useContext(UNSAFE_RouteContext);
        if (routerContextVal && routerContextVal.matches && routerContextVal.matches.length > 0) {
          const matchIndex = routerContextVal.matches.length - 1;
          const pathnameBase = routerContextVal.matches[matchIndex].pathnameBase;
          basename = context.pathJoin(basename, pathnameBase || "/");
        }
      } else {
        const match = useRouteMatch == null ? void 0 : useRouteMatch();
        if (useHistory) {
          const history = useHistory == null ? void 0 : useHistory();
          basename = (_a = history == null ? void 0 : history.createHref) == null ? void 0 : _a.call(history, { pathname: "/" });
        }
        if (match) {
          basename = context.pathJoin(basename, (match == null ? void 0 : match.path) || "/");
        }
      }
    }
    context.LoggerInstance.log(`createRemoteComponent withRouterData >>>`, {
      ...props,
      basename,
      routerContextVal,
      enableDispathPopstate
    });
    if (enableDispathPopstate) {
      const location = ReactRouterDOM__namespace.useLocation();
      const [pathname, setPathname] = React.useState(location.pathname);
      React.useEffect(() => {
        if (pathname !== "" && pathname !== location.pathname) {
          context.LoggerInstance.log(`createRemoteComponent dispatchPopstateEnv >>>`, {
            name: props.name,
            pathname: location.pathname
          });
          context.f();
        }
        setPathname(location.pathname);
      }, [location]);
    }
    return /* @__PURE__ */ React.createElement(WrappedComponent, { ...props, basename, ref });
  });
  return React.forwardRef(function(props, ref) {
    return /* @__PURE__ */ React.createElement(Component, { ...props, ref });
  });
}
const RemoteApp = withRouterData(RemoteAppWrapper);
function createLazyRemoteComponent(info) {
  const exportName = (info == null ? void 0 : info.export) || "default";
  return React.lazy(async () => {
    context.LoggerInstance.log(`createRemoteComponent LazyComponent create >>>`, {
      lazyComponent: info.loader,
      exportName
    });
    try {
      const m2 = await info.loader();
      const moduleName = m2 && m2[Symbol.for("mf_module_id")];
      context.LoggerInstance.log(
        `createRemoteComponent LazyComponent loadRemote info >>>`,
        { name: moduleName, module: m2, exportName }
      );
      const exportFn = m2[exportName];
      if (exportName in m2 && typeof exportFn === "function") {
        const RemoteAppComponent = React.forwardRef((props, ref) => {
          return /* @__PURE__ */ React.createElement(
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
        context.LoggerInstance.log(
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
  return React.forwardRef(
    (props, ref) => {
      const LazyComponent = createLazyRemoteComponent(info);
      return /* @__PURE__ */ React.createElement(ErrorBoundary, { FallbackComponent: info.fallback }, /* @__PURE__ */ React.createElement(React.Suspense, { fallback: info.loading }, /* @__PURE__ */ React.createElement(LazyComponent, { ...props, ref })));
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
      return /* @__PURE__ */ React__namespace.createElement(context.RouterContext.Provider, { value: { moduleName, basename, memoryRoute } }, /* @__PURE__ */ React__namespace.createElement(
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
        context.LoggerInstance.log(`createBridgeComponent render Info`, info);
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
          /* @__PURE__ */ React__namespace.createElement(ErrorBoundary, { FallbackComponent: fallback }, /* @__PURE__ */ React__namespace.createElement(
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
        if (context.atLeastReact18(React__namespace)) {
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
        context.LoggerInstance.log(`createBridgeComponent destroy Info`, {
          dom: info.dom
        });
        if (context.atLeastReact18(React__namespace)) {
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
exports.createBridgeComponent = createBridgeComponent;
exports.createRemoteComponent = createRemoteComponent;
