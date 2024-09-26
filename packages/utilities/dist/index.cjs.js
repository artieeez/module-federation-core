'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

function _array_like_to_array$3(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$3(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit$3(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest$3() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array$3(arr, i) {
    return _array_with_holes$3(arr) || _iterable_to_array_limit$3(arr, i) || _unsupported_iterable_to_array$3(arr, i) || _non_iterable_rest$3();
}
function _type_of$2(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array$3(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$3(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$3(o, minLen);
}
var pure = typeof process !== 'undefined' ? process.env['REMOTES'] || {} : {};
var remoteVars = pure;
var extractUrlAndGlobal = function(urlAndGlobal) {
    var index = urlAndGlobal.indexOf('@');
    if (index <= 0 || index === urlAndGlobal.length - 1) {
        throw new Error('Invalid request "'.concat(urlAndGlobal, '"'));
    }
    return [
        urlAndGlobal.substring(index + 1),
        urlAndGlobal.substring(0, index)
    ];
};
var loadScript = function(keyOrRuntimeRemoteItem) {
    var runtimeRemotes = getRuntimeRemotes$1();
    // 1) Load remote container if needed
    var asyncContainer;
    var reference = typeof keyOrRuntimeRemoteItem === 'string' ? runtimeRemotes[keyOrRuntimeRemoteItem] : keyOrRuntimeRemoteItem;
    if (reference.asyncContainer) {
        asyncContainer = typeof reference.asyncContainer.then === 'function' ? reference.asyncContainer : reference.asyncContainer();
    } else {
        // This casting is just to satisfy typescript,
        // In reality remoteGlobal will always be a string;
        var remoteGlobal = reference.global;
        // Check if theres an override for container key if not use remote global
        var containerKey = reference.uniqueKey ? reference.uniqueKey : remoteGlobal;
        var __webpack_error__ = new Error();
        // @ts-ignore
        var globalScope = // @ts-ignore
        typeof window !== 'undefined' ? window : globalThis.__remote_scope__;
        if (typeof window === 'undefined') {
            //@ts-ignore
            globalScope['_config'][containerKey] = reference.url;
        } else {
            // to match promise template system, can be removed once promise template is gone
            //@ts-ignore
            if (!globalScope['remoteLoading']) {
                //@ts-ignore
                globalScope['remoteLoading'] = {};
            }
            //@ts-ignore
            if (globalScope['remoteLoading'][containerKey]) {
                //@ts-ignore
                return globalScope['remoteLoading'][containerKey];
            }
        }
        // @ts-ignore
        asyncContainer = new Promise(function(resolve, reject) {
            function resolveRemoteGlobal() {
                //@ts-ignore
                var asyncContainer = globalScope[remoteGlobal];
                return resolve(asyncContainer);
            }
            //@ts-ignore
            if (typeof globalScope[remoteGlobal] !== 'undefined') {
                return resolveRemoteGlobal();
            }
            __webpack_require__.l(reference.url, function(event) {
                //@ts-ignore
                if (typeof globalScope[remoteGlobal] !== 'undefined') {
                    return resolveRemoteGlobal();
                }
                var errorType = event && (event.type === 'load' ? 'missing' : event.type);
                var realSrc = event && event.target && event.target.src;
                __webpack_error__.message = 'Loading script failed.\n(' + errorType + ': ' + realSrc + ' or global var ' + remoteGlobal + ')';
                __webpack_error__.name = 'ScriptExternalLoadError';
                __webpack_error__.type = errorType;
                __webpack_error__.request = realSrc;
                reject(__webpack_error__);
            }, containerKey);
        }).catch(function(err) {
            console.error('container is offline, returning fake remote');
            console.error(err);
            return {
                fake: true,
                // @ts-ignore
                get: function(arg) {
                    console.warn('faking', arg, 'module on, its offline');
                    return Promise.resolve(function() {
                        return {
                            __esModule: true,
                            default: function() {
                                return null;
                            }
                        };
                    });
                },
                //eslint-disable-next-line
                init: function() {}
            };
        });
        if (typeof window !== 'undefined') {
            //@ts-ignore
            globalScope['remoteLoading'][containerKey] = asyncContainer;
        }
    }
    return asyncContainer;
};
var getRuntimeRemotes$1 = function() {
    return Object.entries(remoteVars).reduce(function(acc, param) {
        var _param = _sliced_to_array$3(param, 2), key = _param[0], value = _param[1];
        if ((typeof value === "undefined" ? "undefined" : _type_of$2(value)) === 'object' && typeof value.then === 'function') {
            acc[key] = {
                asyncContainer: value
            };
        } else if (typeof value === 'function') {
            acc[key] = {
                asyncContainer: Promise.resolve(value())
            };
        } else if (typeof value === 'string') {
            if (value.startsWith('internal ')) {
                var _value_replace_split = _sliced_to_array$3(value.replace('internal ', '').split('?'), 2); _value_replace_split[0]; var query = _value_replace_split[1];
                if (query) {
                    var remoteSyntax = new URLSearchParams(query).get('remote');
                    if (remoteSyntax) {
                        var _extractUrlAndGlobal = _sliced_to_array$3(extractUrlAndGlobal(remoteSyntax), 2), url = _extractUrlAndGlobal[0], global = _extractUrlAndGlobal[1];
                        acc[key] = {
                            global: global,
                            url: url
                        };
                    }
                }
            } else {
                var _extractUrlAndGlobal1 = _sliced_to_array$3(extractUrlAndGlobal(value), 2), url1 = _extractUrlAndGlobal1[0], global1 = _extractUrlAndGlobal1[1];
                acc[key] = {
                    global: global1,
                    url: url1
                };
            }
        } else {
            console.warn('remotes process', process.env['REMOTES']);
            throw new Error('[mf] Invalid value received for runtime_remote "'.concat(key, '"'));
        }
        return acc;
    }, {});
};

/* eslint-disable @typescript-eslint/ban-ts-comment */ function _array_like_to_array$2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$2(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator$2(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$2(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _iterable_to_array_limit$2(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest$2() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array$2(arr, i) {
    return _array_with_holes$2(arr) || _iterable_to_array_limit$2(arr, i) || _unsupported_iterable_to_array$2(arr, i) || _non_iterable_rest$2();
}
function _type_of$1(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array$2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$2(o, minLen);
}
function _ts_generator$2(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var createContainerSharingScope = function(asyncContainer) {
    // @ts-ignore
    return asyncContainer.then(function(container) {
        if (!__webpack_share_scopes__['default']) {
            // not always a promise, so we wrap it in a resolve
            return Promise.resolve(__webpack_init_sharing__('default')).then(function() {
                return container;
            });
        } else {
            return container;
        }
    }).then(function(container) {
        try {
            // WARNING: here might be a potential BUG.
            //   `container.init` does not return a Promise, and here we do not call `then` on it.
            // But according to [docs](https://webpack.js.org/concepts/module-federation/#dynamic-remote-containers)
            //   it must be async.
            // The problem may be in Proxy in NextFederationPlugin.js.
            //   or maybe a bug in the webpack itself - instead of returning rejected promise it just throws an error.
            // But now everything works properly and we keep this code as is.
            container.init(__webpack_share_scopes__['default']);
        } catch (e) {
        // maybe container already initialized so nothing to throw
        }
        return container;
    });
};
/**
 * Return initialized remote container by remote's key or its runtime remote item data.
 *
 * `runtimeRemoteItem` might be
 *    { global, url } - values obtained from webpack remotes option `global@url`
 * or
 *    { asyncContainer } - async container is a promise that resolves to the remote container
 */ var injectScript = function() {
    var _ref = _async_to_generator$2(function(keyOrRuntimeRemoteItem) {
        var asyncContainer;
        return _ts_generator$2(this, function(_state) {
            asyncContainer = loadScript(keyOrRuntimeRemoteItem);
            return [
                2,
                createContainerSharingScope(asyncContainer)
            ];
        });
    });
    return function injectScript(keyOrRuntimeRemoteItem) {
        return _ref.apply(this, arguments);
    };
}();
/**
 * Creates runtime variables from the provided remotes.
 * If the value of a remote starts with 'promise ' or 'external ', it is transformed into a function that returns the promise call.
 * Otherwise, the value is stringified.
 * @param {Remotes} remotes - The remotes to create runtime variables from.
 * @returns {Record<string, string>} - The created runtime variables.
 */ var createRuntimeVariables = function(remotes) {
    if (!remotes) {
        return {};
    }
    return Object.entries(remotes).reduce(function(acc, param) {
        var _param = _sliced_to_array$2(param, 2), key = _param[0], value = _param[1];
        if (value.startsWith('promise ') || value.startsWith('external ')) {
            var promiseCall = value.split(' ')[1];
            acc[key] = "function() {\n        return ".concat(promiseCall, "\n      }");
        } else {
            acc[key] = JSON.stringify(value);
        }
        return acc;
    }, {});
};
/**
 * Returns initialized webpack RemoteContainer.
 * If its' script does not loaded - then load & init it firstly.
 */ var getContainer = function() {
    var _ref = _async_to_generator$2(function(remoteContainer) {
        var containerScope, containerKey, container;
        return _ts_generator$2(this, function(_state) {
            switch(_state.label){
                case 0:
                    if (!remoteContainer) {
                        throw Error("Remote container options is empty");
                    }
                    containerScope = typeof window !== 'undefined' ? window : globalThis.__remote_scope__;
                    if (!(typeof remoteContainer === 'string')) return [
                        3,
                        1
                    ];
                    containerKey = remoteContainer;
                    return [
                        3,
                        3
                    ];
                case 1:
                    containerKey = remoteContainer.uniqueKey;
                    if (!!containerScope[containerKey]) return [
                        3,
                        3
                    ];
                    return [
                        4,
                        injectScript({
                            global: remoteContainer.global,
                            url: remoteContainer.url
                        })
                    ];
                case 2:
                    container = _state.sent();
                    if (!container) {
                        throw Error("Remote container ".concat(remoteContainer.url, " is empty"));
                    }
                    _state.label = 3;
                case 3:
                    return [
                        2,
                        containerScope[containerKey]
                    ];
            }
        });
    });
    return function getContainer(remoteContainer) {
        return _ref.apply(this, arguments);
    };
}();
/**
 * Return remote module from container.
 * If you provide `exportName` it automatically return exact property value from module.
 *
 * @example
 *   remote.getModule('./pages/index', 'default')
 */ var getModule = function() {
    var _ref = _async_to_generator$2(function(param) {
        var remoteContainer, modulePath, exportName, container, modFactory, mod, error;
        return _ts_generator$2(this, function(_state) {
            switch(_state.label){
                case 0:
                    remoteContainer = param.remoteContainer, modulePath = param.modulePath, exportName = param.exportName;
                    return [
                        4,
                        getContainer(remoteContainer)
                    ];
                case 1:
                    container = _state.sent();
                    _state.label = 2;
                case 2:
                    _state.trys.push([
                        2,
                        4,
                        ,
                        5
                    ]);
                    return [
                        4,
                        container === null || container === void 0 ? void 0 : container.get(modulePath)
                    ];
                case 3:
                    modFactory = _state.sent();
                    if (!modFactory) {
                        return [
                            2,
                            undefined
                        ];
                    }
                    mod = modFactory();
                    if (exportName) {
                        return [
                            2,
                            mod && (typeof mod === "undefined" ? "undefined" : _type_of$1(mod)) === 'object' ? mod[exportName] : undefined
                        ];
                    } else {
                        return [
                            2,
                            mod
                        ];
                    }
                case 4:
                    error = _state.sent();
                    console.error(error);
                    return [
                        2,
                        undefined
                    ];
                case 5:
                    return [
                        2
                    ];
            }
        });
    });
    return function getModule(_) {
        return _ref.apply(this, arguments);
    };
}();

var isObjectEmpty = function(obj) {
    for(var x in obj){
        return false;
    }
    return true;
};

function _array_like_to_array$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$1(arr) {
    if (Array.isArray(arr)) return arr;
}
function asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator$1(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep$1(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _define_property$1(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterable_to_array_limit$1(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest$1() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property$1(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array$1(arr, i) {
    return _array_with_holes$1(arr) || _iterable_to_array_limit$1(arr, i) || _unsupported_iterable_to_array$1(arr, i) || _non_iterable_rest$1();
}
function _unsupported_iterable_to_array$1(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$1(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$1(o, minLen);
}
function _ts_generator$1(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
/**
 * Constant for remote entry file
 * @constant {string}
 */ var REMOTE_ENTRY_FILE = 'remoteEntry.js';
/**
 * Function to load remote
 * @function
 * @param {ImportRemoteOptions['url']} url - The url of the remote module
 * @param {ImportRemoteOptions['scope']} scope - The scope of the remote module
 * @param {ImportRemoteOptions['bustRemoteEntryCache']} bustRemoteEntryCache - Flag to bust the remote entry cache
 * @returns {Promise<void>} A promise that resolves when the remote is loaded
 */ var loadRemote = function(url, scope, bustRemoteEntryCache) {
    return new Promise(function(resolve, reject) {
        var timestamp = bustRemoteEntryCache ? "?t=".concat(new Date().getTime()) : '';
        var webpackRequire = __webpack_require__;
        webpackRequire.l("".concat(url).concat(timestamp), function(event) {
            var _event_target;
            if ((event === null || event === void 0 ? void 0 : event.type) === 'load') {
                // Script loaded successfully:
                return resolve();
            }
            var realSrc = event === null || event === void 0 ? void 0 : (_event_target = event.target) === null || _event_target === void 0 ? void 0 : _event_target.src;
            var error = new Error();
            error.message = 'Loading script failed.\n(missing: ' + realSrc + ')';
            error.name = 'ScriptExternalLoadError';
            reject(error);
        }, scope);
    });
};
var loadEsmRemote = function() {
    var _ref = _async_to_generator$1(function(url, scope) {
        var module;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    return [
                        4,
                        (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(/* webpackIgnore: true */ url)
                    ];
                case 1:
                    module = _state.sent();
                    if (!module) {
                        throw new Error("Unable to load requested remote from ".concat(url, " with scope ").concat(scope));
                    }
                    window[scope] = _object_spread_props(_object_spread({}, module), {
                        __initializing: false,
                        __initialized: false
                    });
                    return [
                        2
                    ];
            }
        });
    });
    return function loadEsmRemote(url, scope) {
        return _ref.apply(this, arguments);
    };
}();
/**
 * Function to initialize sharing
 * @async
 * @function
 */ var initSharing = function() {
    var _ref = _async_to_generator$1(function() {
        var webpackShareScopes;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    webpackShareScopes = __webpack_share_scopes__;
                    if (!!(webpackShareScopes === null || webpackShareScopes === void 0 ? void 0 : webpackShareScopes.default)) return [
                        3,
                        2
                    ];
                    return [
                        4,
                        __webpack_init_sharing__('default')
                    ];
                case 1:
                    _state.sent();
                    _state.label = 2;
                case 2:
                    return [
                        2
                    ];
            }
        });
    });
    return function initSharing() {
        return _ref.apply(this, arguments);
    };
}();
/**
 * Function to initialize container
 * @async
 * @function
 * @param {WebpackRemoteContainer} containerScope - The container scope
 */ var initContainer = function() {
    var _ref = _async_to_generator$1(function(containerScope) {
        var webpackShareScopes, error;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    _state.trys.push([
                        0,
                        3,
                        ,
                        4
                    ]);
                    webpackShareScopes = __webpack_share_scopes__;
                    if (!(!containerScope.__initialized && !containerScope.__initializing)) return [
                        3,
                        2
                    ];
                    containerScope.__initializing = true;
                    return [
                        4,
                        containerScope.init(webpackShareScopes.default)
                    ];
                case 1:
                    _state.sent();
                    containerScope.__initialized = true;
                    delete containerScope.__initializing;
                    _state.label = 2;
                case 2:
                    return [
                        3,
                        4
                    ];
                case 3:
                    error = _state.sent();
                    console.error(error);
                    return [
                        3,
                        4
                    ];
                case 4:
                    return [
                        2
                    ];
            }
        });
    });
    return function initContainer(containerScope) {
        return _ref.apply(this, arguments);
    };
}();
/**
 * Function to import remote
 * @async
 * @function
 * @param {ImportRemoteOptions} options - The options for importing the remote
 * @returns {Promise<T>} A promise that resolves with the imported module
 */ var importRemote = function() {
    var _ref = _async_to_generator$1(function(param) {
        var url, scope, module, _param_remoteEntryFileName, remoteEntryFileName, _param_bustRemoteEntryCache, bustRemoteEntryCache, _param_esm, esm, remoteScope, remoteUrl, remoteUrlWithEntryFile, asyncContainer, _ref, moduleFactory, moduleFactory1;
        return _ts_generator$1(this, function(_state) {
            switch(_state.label){
                case 0:
                    url = param.url, scope = param.scope, module = param.module, _param_remoteEntryFileName = param.remoteEntryFileName, remoteEntryFileName = _param_remoteEntryFileName === void 0 ? REMOTE_ENTRY_FILE : _param_remoteEntryFileName, _param_bustRemoteEntryCache = param.bustRemoteEntryCache, bustRemoteEntryCache = _param_bustRemoteEntryCache === void 0 ? true : _param_bustRemoteEntryCache, _param_esm = param.esm, esm = _param_esm === void 0 ? false : _param_esm;
                    remoteScope = scope;
                    if (!!window[remoteScope]) return [
                        3,
                        6
                    ];
                    remoteUrl = '';
                    if (!(typeof url === 'string')) return [
                        3,
                        1
                    ];
                    remoteUrl = url;
                    return [
                        3,
                        3
                    ];
                case 1:
                    return [
                        4,
                        url()
                    ];
                case 2:
                    remoteUrl = _state.sent();
                    _state.label = 3;
                case 3:
                    remoteUrlWithEntryFile = "".concat(remoteUrl, "/").concat(remoteEntryFileName);
                    asyncContainer = !esm ? loadRemote(remoteUrlWithEntryFile, scope, bustRemoteEntryCache) : loadEsmRemote(remoteUrlWithEntryFile, scope);
                    // Load the remote and initialize the share scope if it's empty
                    return [
                        4,
                        Promise.all([
                            asyncContainer,
                            initSharing()
                        ])
                    ];
                case 4:
                    _state.sent();
                    if (!window[remoteScope]) {
                        throw new Error("Remote loaded successfully but ".concat(scope, " could not be found! Verify that the name is correct in the Webpack configuration!"));
                    }
                    return [
                        4,
                        Promise.all([
                            initContainer(window[remoteScope]),
                            window[remoteScope].get(module === '.' || module.startsWith('./') ? module : "./".concat(module))
                        ])
                    ];
                case 5:
                    _ref = _sliced_to_array$1.apply(void 0, [
                        _state.sent(),
                        2
                    ]), moduleFactory = _ref[1];
                    return [
                        2,
                        moduleFactory()
                    ];
                case 6:
                    return [
                        4,
                        window[remoteScope].get(module === '.' || module.startsWith('./') ? module : "./".concat(module))
                    ];
                case 7:
                    moduleFactory1 = _state.sent();
                    return [
                        2,
                        moduleFactory1()
                    ];
                case 8:
                    return [
                        2
                    ];
            }
        });
    });
    return function importRemote(_) {
        return _ref.apply(this, arguments);
    };
}();

function _class_call_check(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
}
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
var Logger = /*#__PURE__*/ function() {
    function Logger() {
        _class_call_check(this, Logger);
    }
    _create_class(Logger, null, [
        {
            key: "getLogger",
            value: function getLogger() {
                return this.loggerInstance;
            }
        },
        {
            key: "setLogger",
            value: function setLogger(logger) {
                this.loggerInstance = logger || console;
                return logger;
            }
        }
    ]);
    return Logger;
}();
_define_property(Logger, "loggerInstance", console);

function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _iterable_to_array_limit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _non_iterable_rest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
function _unsupported_iterable_to_array(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array(o, minLen);
}
var getRuntimeRemotes = function() {
    try {
        return Object.entries(remoteVars).reduce(function(acc, item) {
            var _item = _sliced_to_array(item, 2), key = _item[0], value = _item[1];
            // if its an object with a thenable (eagerly executing function)
            if ((typeof value === "undefined" ? "undefined" : _type_of(value)) === 'object' && typeof value.then === 'function') {
                acc[key] = {
                    asyncContainer: value
                };
            } else if (typeof value === 'function') {
                // @ts-ignore
                acc[key] = {
                    asyncContainer: value
                };
            } else if (typeof value === 'string' && value.startsWith('internal ')) {
                var _value_replace_split = _sliced_to_array(value.replace('internal ', '').split('?'), 2), request = _value_replace_split[0], query = _value_replace_split[1];
                if (query) {
                    var remoteSyntax = new URLSearchParams(query).get('remote');
                    if (remoteSyntax) {
                        var _extractUrlAndGlobal = _sliced_to_array(extractUrlAndGlobal(remoteSyntax), 2), url = _extractUrlAndGlobal[0], global = _extractUrlAndGlobal[1];
                        acc[key] = {
                            global: global,
                            url: url
                        };
                    }
                }
            } else if (typeof value === 'string') {
                var _extractUrlAndGlobal1 = _sliced_to_array(extractUrlAndGlobal(value), 2), url1 = _extractUrlAndGlobal1[0], global1 = _extractUrlAndGlobal1[1];
                acc[key] = {
                    global: global1,
                    url: url1
                };
            } else {
                //@ts-ignore
                console.warn('remotes process', process.env.REMOTES);
                throw new Error('[mf] Invalid value received for runtime_remote "'.concat(key, '"'));
            }
            return acc;
        }, {});
    } catch (err) {
        console.warn('Unable to retrieve runtime remotes: ', err);
    }
    return {};
};

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
        var info = gen[key](arg);
        var value = info.value;
    } catch (error) {
        reject(error);
        return;
    }
    if (info.done) {
        resolve(value);
    } else {
        Promise.resolve(value).then(_next, _throw);
    }
}
function _async_to_generator(fn) {
    return function() {
        var self = this, args = arguments;
        return new Promise(function(resolve, reject) {
            var gen = fn.apply(self, args);
            function _next(value) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
            }
            function _throw(err) {
                asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
            }
            _next(undefined);
        });
    };
}
function _ts_generator(thisArg, body) {
    var f, y, t, g, _ = {
        label: 0,
        sent: function() {
            if (t[0] & 1) throw t[1];
            return t[1];
        },
        trys: [],
        ops: []
    };
    return g = {
        next: verb(0),
        "throw": verb(1),
        "return": verb(2)
    }, typeof Symbol === "function" && (g[Symbol.iterator] = function() {
        return this;
    }), g;
    function verb(n) {
        return function(v) {
            return step([
                n,
                v
            ]);
        };
    }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while(_)try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [
                op[0] & 2,
                t.value
            ];
            switch(op[0]){
                case 0:
                case 1:
                    t = op;
                    break;
                case 4:
                    _.label++;
                    return {
                        value: op[1],
                        done: false
                    };
                case 5:
                    _.label++;
                    y = op[1];
                    op = [
                        0
                    ];
                    continue;
                case 7:
                    op = _.ops.pop();
                    _.trys.pop();
                    continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                        _ = 0;
                        continue;
                    }
                    if (op[0] === 3 && (!t || op[1] > t[0] && op[1] < t[3])) {
                        _.label = op[1];
                        break;
                    }
                    if (op[0] === 6 && _.label < t[1]) {
                        _.label = t[1];
                        t = op;
                        break;
                    }
                    if (t && _.label < t[2]) {
                        _.label = t[2];
                        _.ops.push(op);
                        break;
                    }
                    if (t[2]) _.ops.pop();
                    _.trys.pop();
                    continue;
            }
            op = body.call(thisArg, _);
        } catch (e) {
            op = [
                6,
                e
            ];
            y = 0;
        } finally{
            f = t = 0;
        }
        if (op[0] & 5) throw op[1];
        return {
            value: op[0] ? op[1] : void 0,
            done: true
        };
    }
}
var importDelegatedModule = function() {
    var _ref = _async_to_generator(function(keyOrRuntimeRemoteItem) {
        return _ts_generator(this, function(_state) {
            // @ts-ignore
            return [
                2,
                loadScript(keyOrRuntimeRemoteItem).then(function(asyncContainer) {
                    return asyncContainer;
                }).then(function(asyncContainer) {
                    // most of this is only needed because of legacy promise based implementation
                    // can remove proxies once we remove promise based implementations
                    if (typeof window === 'undefined') {
                        if (!Object.hasOwnProperty.call(keyOrRuntimeRemoteItem, 'globalThis')) {
                            return asyncContainer;
                        }
                        // return asyncContainer;
                        //TODO: need to solve chunk flushing with delegated modules
                        return {
                            get: function get(arg) {
                                //@ts-ignore
                                return asyncContainer.get(arg).then(function(f) {
                                    var _loop = function(prop) {
                                        if (typeof m[prop] === 'function') {
                                            Object.defineProperty(result, prop, {
                                                get: function get() {
                                                    return function() {
                                                        var _m;
                                                        //@ts-ignore
                                                        if (globalThis.usedChunks) {
                                                            //@ts-ignore
                                                            globalThis.usedChunks.add(//@ts-ignore
                                                            "".concat(keyOrRuntimeRemoteItem.global, "->").concat(arg));
                                                        }
                                                        //eslint-disable-next-line prefer-rest-params
                                                        return (_m = m)[prop].apply(_m, arguments);
                                                    };
                                                },
                                                enumerable: true
                                            });
                                        } else {
                                            Object.defineProperty(result, prop, {
                                                get: function() {
                                                    //@ts-ignore
                                                    if (globalThis.usedChunks) {
                                                        //@ts-ignore
                                                        globalThis.usedChunks.add(//@ts-ignore
                                                        "".concat(keyOrRuntimeRemoteItem.global, "->").concat(arg));
                                                    }
                                                    return m[prop];
                                                },
                                                enumerable: true
                                            });
                                        }
                                    };
                                    var m = f();
                                    var result = {
                                        __esModule: m.__esModule
                                    };
                                    for(var prop in m)_loop(prop);
                                    if (m.then) {
                                        return Promise.resolve(function() {
                                            return result;
                                        });
                                    }
                                    return function() {
                                        return result;
                                    };
                                });
                            },
                            init: asyncContainer.init
                        };
                    } else {
                        return asyncContainer;
                    }
                })
            ];
        });
    });
    return function importDelegatedModule(keyOrRuntimeRemoteItem) {
        return _ref.apply(this, arguments);
    };
}();

exports.Logger = Logger;
exports.createRuntimeVariables = createRuntimeVariables;
exports.extractUrlAndGlobal = extractUrlAndGlobal;
exports.getContainer = getContainer;
exports.getModule = getModule;
exports.getRuntimeRemotes = getRuntimeRemotes;
exports.importDelegatedModule = importDelegatedModule;
exports.importRemote = importRemote;
exports.injectScript = injectScript;
exports.isObjectEmpty = isObjectEmpty;
exports.loadScript = loadScript;
