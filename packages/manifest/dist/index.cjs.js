'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path = require('path');
var fs = require('fs');
var chalk = require('chalk');
var sdk = require('@module-federation/sdk');
var core = require('@module-federation/dts-plugin/core');
var managers = require('@module-federation/managers');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var chalk__default = /*#__PURE__*/_interopDefaultLegacy(chalk);

var PLUGIN_IDENTIFIER = 'Module Federation Manifest Plugin';
var HOT_UPDATE_SUFFIX = '.hot-update';

function _array_like_to_array$2(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$2(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes$1(arr) {
    if (Array.isArray(arr)) return _array_like_to_array$2(arr);
}
function _define_property$4(obj, key, value) {
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
function _iterable_to_array$1(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
function _non_iterable_spread$1() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _object_spread$3(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property$4(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys$2(object, enumerableOnly) {
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
function _object_spread_props$2(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys$2(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
function _sliced_to_array$2(arr, i) {
    return _array_with_holes$2(arr) || _iterable_to_array_limit$2(arr, i) || _unsupported_iterable_to_array$2(arr, i) || _non_iterable_rest$2();
}
function _tagged_template_literal$2(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _to_consumable_array$1(arr) {
    return _array_without_holes$1(arr) || _iterable_to_array$1(arr) || _unsupported_iterable_to_array$2(arr) || _non_iterable_spread$1();
}
function _unsupported_iterable_to_array$2(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _array_like_to_array$2(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _array_like_to_array$2(o, minLen);
}
function _templateObject$2() {
    var data = _tagged_template_literal$2([
        "{bold {yellow [ ",
        " ]: getTypesMetaInfo failed, it will use the default types meta info, and the errors as belows: ",
        " }}"
    ]);
    _templateObject$2 = function _templateObject() {
        return data;
    };
    return data;
}
function isHotFile(file) {
    return file.includes(HOT_UPDATE_SUFFIX);
}
var collectAssets = function(assets, jsTargetSet, cssTargetSet) {
    assets.forEach(function(file) {
        if (file.endsWith('.css')) {
            cssTargetSet.add(file);
        } else {
            if (isDev()) {
                if (!isHotFile(file)) {
                    jsTargetSet.add(file);
                }
            } else {
                jsTargetSet.add(file);
            }
        }
    });
};
function getSharedModuleName(name) {
    var _name_split = _sliced_to_array$2(name.split(' '), 5); _name_split[0]; _name_split[1]; _name_split[2]; _name_split[3]; var sharedInfo = _name_split[4];
    return sharedInfo.split('@').slice(0, -1).join('@');
}
function getAssetsByChunkIDs(compilation, chunkIDMap) {
    var arrayChunks = Array.from(compilation.chunks);
    var assetMap = {};
    Object.keys(chunkIDMap).forEach(function(key) {
        var chunkIDs = Array.from(chunkIDMap[key]);
        if (!assetMap[key]) {
            assetMap[key] = {
                css: new Set(),
                js: new Set()
            };
        }
        chunkIDs.forEach(function(chunkID) {
            var chunk = arrayChunks.find(function(item) {
                return item.id === chunkID;
            });
            if (chunk) {
                collectAssets(_to_consumable_array$1(chunk.files), assetMap[key].js, assetMap[key].css);
            }
        });
    });
    var assets = {};
    Object.keys(assetMap).map(function(key) {
        assets[key] = {
            js: Array.from(assetMap[key].js),
            css: Array.from(assetMap[key].css)
        };
    });
    return assets;
}
function findChunk(id, chunks) {
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = chunks[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var chunk = _step.value;
            if (id === chunk.id) {
                return chunk;
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
}
function getSharedModules(stats, sharedModules) {
    var _stats_modules;
    // 获取入口文件就是实际内容的 module
    var entryContentModuleNames = [];
    var effectiveSharedModules = ((_stats_modules = stats.modules) === null || _stats_modules === void 0 ? void 0 : _stats_modules.reduce(function(sum, module) {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for(var _iterator = sharedModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                var sharedModule = _step.value;
                if (sharedModule.name === module.issuerName) {
                    entryContentModuleNames.push(sharedModule.name);
                    sum.push([
                        getSharedModuleName(module.issuerName),
                        module
                    ]);
                    return sum;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally{
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally{
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        return sum;
    }, [])) || [];
    // 获取入口文件仅作为 Re Export 的 module
    var entryReExportModules = sharedModules.filter(function(sharedModule) {
        return !entryContentModuleNames.includes(sharedModule.name);
    });
    if (entryReExportModules.length) {
        effectiveSharedModules = effectiveSharedModules.concat(stats.modules.reduce(function(sum, module) {
            var flag = false;
            var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
            try {
                for(var _iterator = entryReExportModules[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
                    var entryReExportModule = _step.value;
                    if (flag) {
                        break;
                    }
                    if (module.reasons) {
                        var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                        try {
                            for(var _iterator1 = module.reasons[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true){
                                var issueModule = _step1.value;
                                if (issueModule.moduleName === entryReExportModule.name) {
                                    sum.push([
                                        getSharedModuleName(entryReExportModule.name),
                                        module
                                    ]);
                                    flag = true;
                                    break;
                                }
                            }
                        } catch (err) {
                            _didIteratorError1 = true;
                            _iteratorError1 = err;
                        } finally{
                            try {
                                if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                    _iterator1.return();
                                }
                            } finally{
                                if (_didIteratorError1) {
                                    throw _iteratorError1;
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                _didIteratorError = true;
                _iteratorError = err;
            } finally{
                try {
                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                        _iterator.return();
                    }
                } finally{
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }
            return sum;
        }, []));
    }
    return effectiveSharedModules;
}
function getAssetsByChunk(chunk, entryPointNames) {
    var assesSet = {
        js: {
            sync: new Set(),
            async: new Set()
        },
        css: {
            sync: new Set(),
            async: new Set()
        }
    };
    var collectChunkFiles = function(targetChunk, type) {
        _to_consumable_array$1(targetChunk.groupsIterable).forEach(function(chunkGroup) {
            if (chunkGroup.name && !entryPointNames.includes(chunkGroup.name)) {
                collectAssets(chunkGroup.getFiles(), assesSet.js[type], assesSet.css[type]);
            }
        });
    };
    collectChunkFiles(chunk, 'sync');
    _to_consumable_array$1(chunk.getAllAsyncChunks()).forEach(function(asyncChunk) {
        collectAssets(_to_consumable_array$1(asyncChunk.files), assesSet.js['async'], assesSet.css['async']);
        collectChunkFiles(asyncChunk, 'async');
    });
    var assets = {
        js: {
            sync: Array.from(assesSet.js.sync),
            async: Array.from(assesSet.js.async)
        },
        css: {
            sync: Array.from(assesSet.css.sync),
            async: Array.from(assesSet.css.async)
        }
    };
    return assets;
}
function assert(condition, msg) {
    if (!condition) {
        error(msg);
    }
}
function error(msg) {
    throw new Error("[ ".concat(PLUGIN_IDENTIFIER, " ]: ").concat(msg));
}
function isDev() {
    return process.env['NODE_ENV'] === 'development';
}
function getFileNameWithOutExt(str) {
    return str.replace(path__default["default"].extname(str), '');
}
function getFileName(manifestOptions) {
    if (!manifestOptions) {
        return {
            statsFileName: sdk.StatsFileName,
            manifestFileName: sdk.ManifestFileName
        };
    }
    var filePath = typeof manifestOptions === 'boolean' ? '' : manifestOptions.filePath || '';
    var fileName = typeof manifestOptions === 'boolean' ? '' : manifestOptions.fileName || '';
    var JSON_EXT = '.json';
    var addExt = function(name) {
        if (name.endsWith(JSON_EXT)) {
            return name;
        }
        return "".concat(name).concat(JSON_EXT);
    };
    var insertSuffix = function(name, suffix) {
        return name.replace(JSON_EXT, "".concat(suffix).concat(JSON_EXT));
    };
    var manifestFileName = fileName ? addExt(fileName) : sdk.ManifestFileName;
    var statsFileName = fileName ? insertSuffix(manifestFileName, '-stats') : sdk.StatsFileName;
    return {
        statsFileName: sdk.simpleJoinRemoteEntry(filePath, statsFileName),
        manifestFileName: sdk.simpleJoinRemoteEntry(filePath, manifestFileName)
    };
}
function getTypesMetaInfo(pluginOptions, context) {
    var defaultRemoteOptions = {
        generateAPITypes: true,
        compileInChildProcess: true
    };
    var defaultTypesMetaInfo = {
        path: '',
        name: '',
        zip: '',
        api: ''
    };
    try {
        var normalizedDtsOptions = sdk.normalizeOptions(core.isTSProject(pluginOptions.dts, context), {
            generateTypes: defaultRemoteOptions,
            consumeTypes: {}
        }, 'mfOptions.dts')(pluginOptions.dts);
        if (normalizedDtsOptions === false) {
            return defaultTypesMetaInfo;
        }
        var normalizedRemote = sdk.normalizeOptions(true, defaultRemoteOptions, 'mfOptions.dts.generateTypes')(normalizedDtsOptions.generateTypes);
        if (normalizedRemote === false) {
            return defaultTypesMetaInfo;
        }
        var _retrieveTypesAssetsInfo = core.retrieveTypesAssetsInfo(_object_spread_props$2(_object_spread$3({}, normalizedRemote), {
            context: context,
            moduleFederationConfig: pluginOptions
        })), apiFileName = _retrieveTypesAssetsInfo.apiFileName, zipName = _retrieveTypesAssetsInfo.zipName, zipPrefix = _retrieveTypesAssetsInfo.zipPrefix;
        return {
            path: '',
            name: '',
            zip: path__default["default"].join(zipPrefix, zipName),
            api: path__default["default"].join(zipPrefix, apiFileName)
        };
    } catch (err) {
        console.warn(chalk__default["default"](_templateObject$2(), PLUGIN_IDENTIFIER, err));
        return defaultTypesMetaInfo;
    }
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
function _class_call_check$3(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$3(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class$3(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$3(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$3(Constructor, staticProps);
    return Constructor;
}
function _define_property$3(obj, key, value) {
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
function _object_spread$2(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property$3(target, key, source[key]);
        });
    }
    return target;
}
function _tagged_template_literal$1(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
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
function _templateObject$1() {
    var data = _tagged_template_literal$1([
        "{bold {greenBright [ ",
        " ]} {greenBright Manifest Link:} {cyan ",
        "",
        "}}"
    ]);
    _templateObject$1 = function _templateObject() {
        return data;
    };
    return data;
}
var ManifestManager = /*#__PURE__*/ function() {
    function ManifestManager() {
        _class_call_check$3(this, ManifestManager);
        _define_property$3(this, "_options", {});
        _define_property$3(this, "_manifest", void 0);
    }
    _create_class$3(ManifestManager, [
        {
            key: "manifest",
            get: function get() {
                return this._manifest;
            }
        },
        {
            key: "init",
            value: function init(options) {
                this._options = options;
            }
        },
        {
            key: "fileName",
            get: function get() {
                return getFileName(this._options.manifest).manifestFileName;
            }
        },
        {
            key: "generateManifest",
            value: function generateManifest(options) {
                var extraOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
                var _this = this;
                return _async_to_generator$2(function() {
                    var compilation, publicPath, stats, compiler, bundler, additionalData, disableEmit, manifest, prefetchInterface, prefetchFilePath, existPrefetch, content, manifestFileName, ret;
                    return _ts_generator$2(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                compilation = options.compilation, publicPath = options.publicPath, stats = options.stats, compiler = options.compiler, bundler = options.bundler, additionalData = options.additionalData;
                                disableEmit = extraOptions.disableEmit;
                                manifest = _object_spread$2({}, stats);
                                manifest.exposes = stats.exposes.reduce(function(sum, cur) {
                                    var expose = {
                                        id: cur.id,
                                        name: cur.name,
                                        assets: cur.assets,
                                        path: cur.path
                                    };
                                    sum.push(expose);
                                    return sum;
                                }, []);
                                manifest.shared = stats.shared.reduce(function(sum, cur) {
                                    var shared = {
                                        id: cur.id,
                                        name: cur.name,
                                        version: cur.version,
                                        singleton: cur.singleton,
                                        requiredVersion: cur.requiredVersion,
                                        hash: cur.hash,
                                        assets: cur.assets
                                    };
                                    sum.push(shared);
                                    return sum;
                                }, []);
                                manifest.remotes = stats.remotes.reduce(function(sum, cur) {
                                    // @ts-ignore version/entry will be added as follow
                                    var remote = {
                                        federationContainerName: cur.federationContainerName,
                                        moduleName: cur.moduleName,
                                        alias: cur.alias
                                    };
                                    if ('entry' in cur) {
                                        // @ts-ignore
                                        remote.entry = cur.entry;
                                    } else if ('version' in cur) {
                                        // @ts-ignore
                                        remote.entry = cur.version;
                                    }
                                    sum.push(remote);
                                    return sum;
                                }, []);
                                prefetchInterface = false;
                                prefetchFilePath = path__default["default"].resolve(compiler.options.context || process.cwd(), "node_modules/.mf/".concat(sdk.encodeName(stats.name), "/").concat(sdk.MFPrefetchCommon.fileName));
                                existPrefetch = fs__default["default"].existsSync(prefetchFilePath);
                                if (existPrefetch) {
                                    content = fs__default["default"].readFileSync(prefetchFilePath).toString();
                                    if (content) {
                                        prefetchInterface = true;
                                    }
                                }
                                stats.metaData.prefetchInterface = prefetchInterface;
                                _this._manifest = manifest;
                                manifestFileName = _this.fileName;
                                if (!additionalData) return [
                                    3,
                                    2
                                ];
                                return [
                                    4,
                                    additionalData({
                                        manifest: _this._manifest,
                                        stats: stats,
                                        pluginOptions: _this._options,
                                        compiler: compiler,
                                        compilation: compilation,
                                        bundler: bundler
                                    })
                                ];
                            case 1:
                                ret = _state.sent();
                                _this._manifest = ret || _this._manifest;
                                _state.label = 2;
                            case 2:
                                if (!disableEmit) {
                                    compilation.emitAsset(manifestFileName, new compiler.webpack.sources.RawSource(JSON.stringify(_this._manifest, null, 2)));
                                }
                                if (isDev()) {
                                    console.log(chalk__default["default"](_templateObject$1(), PLUGIN_IDENTIFIER, publicPath === 'auto' ? '{auto}/' : publicPath, manifestFileName));
                                }
                                return [
                                    2,
                                    {
                                        manifest: _this._manifest,
                                        filename: manifestFileName
                                    }
                                ];
                        }
                    });
                })();
            }
        }
    ]);
    return ManifestManager;
}();

function _array_like_to_array$1(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes$1(arr) {
    if (Array.isArray(arr)) return arr;
}
function _class_call_check$2(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$2(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class$2(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$2(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$2(Constructor, staticProps);
    return Constructor;
}
function _define_property$2(obj, key, value) {
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
function _object_spread$1(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property$2(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys$1(object, enumerableOnly) {
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
function _object_spread_props$1(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys$1(Object(source)).forEach(function(key) {
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
var ModuleHandler = /*#__PURE__*/ function() {
    function ModuleHandler(options, modules, param) {
        var bundler = param.bundler;
        _class_call_check$2(this, ModuleHandler);
        _define_property$2(this, "_options", void 0);
        _define_property$2(this, "_bundler", 'webpack');
        _define_property$2(this, "_modules", void 0);
        _define_property$2(this, "_remoteManager", new managers.RemoteManager());
        _define_property$2(this, "_sharedManager", new managers.SharedManager());
        this._options = options;
        this._modules = modules;
        this._bundler = bundler;
        this._remoteManager = new managers.RemoteManager();
        this._remoteManager.init(options);
        this._sharedManager = new managers.SharedManager();
        this._sharedManager.init(options);
    }
    _create_class$2(ModuleHandler, [
        {
            key: "isRspack",
            get: function get() {
                return this._bundler === 'rspack';
            }
        },
        {
            key: "_handleSharedModule",
            value: function _handleSharedModule(mod, sharedMap, exposesMap) {
                var _this = this;
                var identifier = mod.identifier, moduleType = mod.moduleType;
                if (!identifier) {
                    return;
                }
                var sharedManagerNormalizedOptions = this._sharedManager.normalizedOptions;
                var initShared = function(pkgName, pkgVersion) {
                    var _sharedManagerNormalizedOptions_pkgName;
                    if (sharedMap[pkgName]) {
                        return;
                    }
                    sharedMap[pkgName] = _object_spread_props$1(_object_spread$1({}, sharedManagerNormalizedOptions[pkgName]), {
                        id: "".concat(_this._options.name, ":").concat(pkgName),
                        requiredVersion: ((_sharedManagerNormalizedOptions_pkgName = sharedManagerNormalizedOptions[pkgName]) === null || _sharedManagerNormalizedOptions_pkgName === void 0 ? void 0 : _sharedManagerNormalizedOptions_pkgName.requiredVersion) || "^".concat(pkgVersion),
                        name: pkgName,
                        version: pkgVersion,
                        assets: {
                            js: {
                                async: [],
                                sync: []
                            },
                            css: {
                                async: [],
                                sync: []
                            }
                        },
                        // @ts-ignore to deduplicate
                        usedIn: new Set()
                    });
                };
                var collectRelationshipMap = function(mod, pkgName) {
                    var issuerName = mod.issuerName, reasons = mod.reasons;
                    if (issuerName) {
                        if (exposesMap[getFileNameWithOutExt(issuerName)]) {
                            var expose = exposesMap[getFileNameWithOutExt(issuerName)];
                            // @ts-ignore use Set to deduplicate
                            expose.requires.add(pkgName);
                            // @ts-ignore use Set to deduplicate
                            sharedMap[pkgName].usedIn.add(expose.path);
                        }
                    }
                    if (reasons) {
                        reasons.forEach(function(param) {
                            var resolvedModule = param.resolvedModule, moduleName = param.moduleName;
                            var exposeModName = _this.isRspack ? moduleName : resolvedModule;
                            // filters out entrypoints
                            if (exposeModName) {
                                if (exposesMap[getFileNameWithOutExt(exposeModName)]) {
                                    var expose = exposesMap[getFileNameWithOutExt(exposeModName)];
                                    // @ts-ignore to deduplicate
                                    expose.requires.add(pkgName);
                                    // @ts-ignore to deduplicate
                                    sharedMap[pkgName].usedIn.add(expose.path);
                                }
                            }
                        });
                    }
                };
                var parseResolvedIdentifier = function(nameAndVersion) {
                    var name = '';
                    var version = '';
                    if (nameAndVersion.startsWith('@')) {
                        var splitInfo = nameAndVersion.split('@');
                        splitInfo[0] = '@';
                        name = splitInfo[0] + splitInfo[1];
                        version = splitInfo[2];
                    } else if (nameAndVersion.includes('@')) {
                        var ref;
                        ref = _sliced_to_array$1(nameAndVersion.split('@'), 2), name = ref[0], version = ref[1];
                        version = version.replace(/[\^~>|>=]/g, '');
                    }
                    return {
                        name: name,
                        version: version
                    };
                };
                if (moduleType === 'provide-module') {
                    // identifier(rspack) = provide shared module (default) react@18.2.0 = /temp/node_modules/.pnpm/react@18.2.0/node_modules/react/index.js
                    // identifier(webpack) = provide module (default) react@18.2.0 = /temp/node_modules/.pnpm/react@18.2.0/node_modules/react/index.js
                    var data = identifier.split(' ');
                    var nameAndVersion = this.isRspack ? data[4] : data[3];
                    var _parseResolvedIdentifier = parseResolvedIdentifier(nameAndVersion), name = _parseResolvedIdentifier.name, version = _parseResolvedIdentifier.version;
                    if (name && version) {
                        initShared(name, version);
                        collectRelationshipMap(mod, name);
                    }
                }
                if (moduleType === 'consume-shared-module') {
                    // identifier(rspack) = consume shared module (default) lodash/get@^4.17.21 (strict) (fallback: /temp/node_modules/.pnpm/lodash@4.17.21/node_modules/lodash/get.js)
                    // identifier(webpack) = consume-shared-module|default|react-dom|!=1.8...2...0|false|/temp/node_modules/.pnpm/react-dom@18.2.0_react@18.2.0/node_modules/react-dom/index.js|true|false
                    var SEPARATOR = this.isRspack ? ' ' : '|';
                    var data1 = identifier.split(SEPARATOR);
                    var pkgName = '';
                    var pkgVersion = '';
                    if (this.isRspack) {
                        var nameAndVersion1 = data1[4];
                        var res = parseResolvedIdentifier(nameAndVersion1);
                        pkgName = res.name;
                        pkgVersion = res.version;
                    } else {
                        pkgName = data1[2];
                        var pkgVersionRange = data1[3];
                        pkgVersion = '';
                        if (pkgVersionRange.startsWith('=')) {
                            pkgVersion = data1[3].replace('=', '');
                        } else {
                            if (sharedManagerNormalizedOptions[pkgName]) {
                                pkgVersion = sharedManagerNormalizedOptions[pkgName].version;
                            } else {
                                var fullPkgName = pkgName.split('/').slice(0, -1).join('/');
                                // pkgName: react-dom/
                                if (sharedManagerNormalizedOptions["".concat(fullPkgName, "/")]) {
                                    if (sharedManagerNormalizedOptions[fullPkgName]) {
                                        pkgVersion = sharedManagerNormalizedOptions[fullPkgName].version;
                                    } else {
                                        pkgVersion = sharedManagerNormalizedOptions["".concat(fullPkgName, "/")].version;
                                    }
                                }
                            }
                        }
                    }
                    if (pkgName && pkgVersion) {
                        initShared(pkgName, pkgVersion);
                        collectRelationshipMap(mod, pkgName);
                    }
                }
            }
        },
        {
            key: "_handleRemoteModule",
            value: function _handleRemoteModule(mod, remotes, remotesConsumerMap) {
                var _this = this;
                var identifier = mod.identifier, reasons = mod.reasons, nameForCondition = mod.nameForCondition;
                if (!identifier) {
                    return;
                }
                var remoteManagerNormalizedOptions = this._remoteManager.normalizedOptions;
                // identifier = remote (default) webpack/container/reference/app2 ./Button
                var data = identifier.split(' ');
                if (data.length === 4) {
                    var moduleName = data[3].replace('./', '');
                    var remoteAlias = data[2].replace('webpack/container/reference/', '');
                    var normalizedRemote = remoteManagerNormalizedOptions[remoteAlias];
                    var basicRemote = {
                        alias: normalizedRemote.alias,
                        consumingFederationContainerName: this._options.name || '',
                        federationContainerName: remoteManagerNormalizedOptions[remoteAlias].name,
                        moduleName: moduleName,
                        // @ts-ignore to deduplicate
                        usedIn: new Set()
                    };
                    if (!nameForCondition) {
                        return;
                    }
                    var remote;
                    if ('version' in normalizedRemote) {
                        remote = _object_spread_props$1(_object_spread$1({}, basicRemote), {
                            version: normalizedRemote.version
                        });
                    } else {
                        remote = _object_spread_props$1(_object_spread$1({}, basicRemote), {
                            entry: normalizedRemote.entry
                        });
                    }
                    remotes.push(remote);
                    remotesConsumerMap[nameForCondition] = remote;
                }
                if (reasons) {
                    reasons.forEach(function(param) {
                        var userRequest = param.userRequest, resolvedModule = param.resolvedModule, moduleName = param.moduleName;
                        var exposeModName = _this.isRspack ? moduleName : resolvedModule;
                        if (userRequest && exposeModName && remotesConsumerMap[userRequest]) {
                            // @ts-ignore to deduplicate
                            remotesConsumerMap[userRequest].usedIn.add(exposeModName.replace('./', ''));
                        }
                    });
                }
            }
        },
        {
            key: "_handleContainerModule",
            value: function _handleContainerModule(mod, exposesMap) {
                var _this = this;
                var identifier = mod.identifier;
                if (!identifier) {
                    return;
                }
                // identifier: container entry (default) [[".",{"import":["./src/routes/page.tsx"],"name":"__federation_expose_default_export"}]]'
                var data = identifier.split(' ');
                JSON.parse(data[3]).forEach(function(param) {
                    var _param = _sliced_to_array$1(param, 2), prefixedName = _param[0], file = _param[1];
                    var exposeModuleName = prefixedName.replace('./', '');
                    // TODO: support multiple import
                    exposesMap[getFileNameWithOutExt(file.import[0])] = {
                        path: prefixedName,
                        id: "".concat(_this._options.name, ":").concat(exposeModuleName),
                        name: exposeModuleName,
                        // @ts-ignore to deduplicate
                        requires: new Set(),
                        file: path__default["default"].relative(process.cwd(), file.import[0]),
                        assets: {
                            js: {
                                async: [],
                                sync: []
                            },
                            css: {
                                async: [],
                                sync: []
                            }
                        }
                    };
                });
            }
        },
        {
            key: "collect",
            value: function collect() {
                var _this = this;
                var remotes = [];
                var remotesConsumerMap = {};
                var exposesMap = {};
                var sharedMap = {};
                var isSharedModule = function(moduleType) {
                    return Boolean(moduleType && [
                        'provide-module',
                        'consume-shared-module'
                    ].includes(moduleType));
                };
                var isContainerModule = function(identifier) {
                    var data = identifier.split(' ');
                    return Boolean(data[0] === 'container' && data[1] === 'entry');
                };
                var isRemoteModule = function(identifier) {
                    var data = identifier.split(' ');
                    return data[0] === 'remote';
                };
                // handle remote/expose
                this._modules.forEach(function(mod) {
                    var identifier = mod.identifier; mod.reasons; mod.nameForCondition; var moduleType = mod.moduleType;
                    if (!identifier) {
                        return;
                    }
                    if (isSharedModule(moduleType)) {
                        _this._handleSharedModule(mod, sharedMap, exposesMap);
                    }
                    if (isRemoteModule(identifier)) {
                        _this._handleRemoteModule(mod, remotes, remotesConsumerMap);
                    } else if (isContainerModule(identifier)) {
                        _this._handleContainerModule(mod, exposesMap);
                    }
                });
                return {
                    remotes: remotes,
                    exposesMap: exposesMap,
                    sharedMap: sharedMap
                };
            }
        }
    ]);
    return ModuleHandler;
}();

/* eslint-disable max-lines-per-function */ /* eslint-disable @typescript-eslint/member-ordering */ /* eslint-disable max-depth */ function _array_like_to_array(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _array_with_holes(arr) {
    if (Array.isArray(arr)) return arr;
}
function _array_without_holes(arr) {
    if (Array.isArray(arr)) return _array_like_to_array(arr);
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
function _class_call_check$1(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
        throw new TypeError("Cannot call a class as a function");
    }
}
function _defineProperties$1(target, props) {
    for(var i = 0; i < props.length; i++){
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
    }
}
function _create_class$1(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties$1(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties$1(Constructor, staticProps);
    return Constructor;
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
function _iterable_to_array(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
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
function _non_iterable_spread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
function _sliced_to_array(arr, i) {
    return _array_with_holes(arr) || _iterable_to_array_limit(arr, i) || _unsupported_iterable_to_array(arr, i) || _non_iterable_rest();
}
function _tagged_template_literal(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _to_consumable_array(arr) {
    return _array_without_holes(arr) || _iterable_to_array(arr) || _unsupported_iterable_to_array(arr) || _non_iterable_spread();
}
function _type_of$1(obj) {
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
function _templateObject() {
    var data = _tagged_template_literal([
        "{bold {yellow [ ",
        " ]: Manifest will not generate, because publicPath can only be string, but got '",
        "' }}"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "{bold {blue [ ",
        " ]: Manifest will use absolute path resolution via its host at runtime, reason: publicPath='",
        "'}}"
    ]);
    _templateObject1 = function _templateObject() {
        return data;
    };
    return data;
}
var StatsManager = /*#__PURE__*/ function() {
    function StatsManager() {
        _class_call_check$1(this, StatsManager);
        _define_property$1(this, "_options", {});
        _define_property$1(this, "_publicPath", void 0);
        _define_property$1(this, "_pluginVersion", void 0);
        _define_property$1(this, "_bundler", 'webpack');
        _define_property$1(this, "_containerManager", new managers.ContainerManager());
        _define_property$1(this, "_remoteManager", new managers.RemoteManager());
        _define_property$1(this, "_sharedManager", new managers.SharedManager());
        _define_property$1(this, "_pkgJsonManager", new managers.PKGJsonManager());
    }
    _create_class$1(StatsManager, [
        {
            key: "buildInfo",
            get: function get() {
                var pkg = this._pkgJsonManager.readPKGJson(process.cwd());
                return {
                    buildVersion: managers.utils.getBuildVersion(),
                    buildName: managers.utils.getBuildName() || pkg['name']
                };
            }
        },
        {
            key: "fileName",
            get: function get() {
                return getFileName(this._options.manifest).statsFileName;
            }
        },
        {
            key: "_getMetaData",
            value: function _getMetaData(compiler, compilation, extraOptions) {
                var _this = this;
                var _this__options_library, _this__options;
                var context = compiler.options.context;
                var _this1 = this, name = _this1._options.name, buildInfo = _this1.buildInfo;
                var type = this._pkgJsonManager.getExposeGarfishModuleType(context || process.cwd());
                var getRemoteEntryName = function() {
                    if (!_this._containerManager.enable) {
                        return '';
                    }
                    assert(name, 'name is required');
                    var remoteEntryPoint = compilation.entrypoints.get(name);
                    assert(remoteEntryPoint, 'Can not get remoteEntry entryPoint!');
                    var remoteEntryNameChunk = compilation.namedChunks.get(name);
                    assert(remoteEntryNameChunk, 'Can not get remoteEntry chunk!');
                    var files = Array.from(remoteEntryNameChunk.files).filter(function(f) {
                        return !f.includes(HOT_UPDATE_SUFFIX) && !f.endsWith('.css');
                    });
                    assert(files.length > 0, 'no files found for remoteEntry chunk');
                    assert(files.length === 1, "remoteEntry chunk should not have multiple files!, current files: ".concat(files.join(',')));
                    var remoteEntryName = files[0];
                    return remoteEntryName;
                };
                var globalName = this._containerManager.globalEntryName;
                assert(globalName, 'Can not get library.name, please ensure you have set library.name and the type is "string" !');
                assert(this._pluginVersion, 'Can not get pluginVersion, please ensure you have set pluginVersion !');
                var metaData = {
                    name: name,
                    type: type,
                    buildInfo: buildInfo,
                    remoteEntry: {
                        name: getRemoteEntryName(),
                        path: '',
                        // same as the types supported by runtime, currently only global/var/script is supported
                        type: ((_this__options = this._options) === null || _this__options === void 0 ? void 0 : (_this__options_library = _this__options.library) === null || _this__options_library === void 0 ? void 0 : _this__options_library.type) || 'global'
                    },
                    types: getTypesMetaInfo(this._options, compiler.context),
                    globalName: globalName,
                    pluginVersion: this._pluginVersion
                };
                if (this._options.getPublicPath) {
                    if ('publicPath' in metaData) {
                        delete metaData.publicPath;
                    }
                    return _object_spread_props(_object_spread({}, metaData), {
                        getPublicPath: this._options.getPublicPath
                    });
                }
                return _object_spread_props(_object_spread({}, metaData), {
                    publicPath: this.getPublicPath(compiler)
                });
            }
        },
        {
            key: "_getFilteredModules",
            value: function _getFilteredModules(stats) {
                var filteredModules = stats.modules.filter(function(module) {
                    if (!module || !module.name) {
                        return false;
                    }
                    var array = [
                        module.name.includes('container entry'),
                        module.name.includes('remote '),
                        module.name.includes('shared module '),
                        module.name.includes('provide module ')
                    ];
                    return array.some(function(item) {
                        return item;
                    });
                });
                return filteredModules;
            }
        },
        {
            key: "_getModuleAssets",
            value: function _getModuleAssets(compilation) {
                var chunks = compilation.chunks;
                var exposeFileNameImportMap = this._containerManager.exposeFileNameImportMap;
                var assets = {};
                var entryPointNames = _to_consumable_array(compilation.entrypoints.values()).map(function(e) {
                    return e.name;
                }).filter(function(v) {
                    return !!v;
                });
                chunks.forEach(function(chunk) {
                    if (typeof chunk.name === 'string' && exposeFileNameImportMap[chunk.name]) {
                        // TODO: support multiple import
                        var exposeKey = exposeFileNameImportMap[chunk.name][0];
                        assets[getFileNameWithOutExt(exposeKey)] = getAssetsByChunk(chunk, entryPointNames);
                    }
                });
                return assets;
            }
        },
        {
            key: "_getProvideSharedAssets",
            value: function _getProvideSharedAssets(compilation, stats) {
                var sharedModules = stats.modules.filter(function(module) {
                    if (!module || !module.name) {
                        return false;
                    }
                    var array = [
                        module.name.includes('consume shared module ')
                    ];
                    return array.some(function(item) {
                        return item;
                    });
                });
                var manifestOverrideChunkIDMap = {};
                var effectiveSharedModules = getSharedModules(stats, sharedModules);
                effectiveSharedModules.forEach(function(item) {
                    var _item = _sliced_to_array(item, 2), sharedModuleName = _item[0], sharedModule = _item[1];
                    if (!manifestOverrideChunkIDMap[sharedModuleName]) {
                        manifestOverrideChunkIDMap[sharedModuleName] = {
                            async: new Set(),
                            sync: new Set()
                        };
                    }
                    sharedModule.chunks.forEach(function(chunkID) {
                        var chunk = findChunk(chunkID, compilation.chunks);
                        manifestOverrideChunkIDMap[sharedModuleName].sync.add(chunkID);
                        Array.from(chunk.getAllInitialChunks()).forEach(function(syncChunk) {
                            syncChunk.id && manifestOverrideChunkIDMap[sharedModuleName].sync.add(syncChunk.id);
                        });
                        Array.from(chunk.getAllAsyncChunks()).forEach(function(asyncChunk) {
                            asyncChunk.id && manifestOverrideChunkIDMap[sharedModuleName].async.add(asyncChunk.id);
                        });
                    });
                });
                var assets = {
                    js: {
                        async: [],
                        sync: []
                    },
                    css: {
                        async: [],
                        sync: []
                    }
                };
                Object.keys(manifestOverrideChunkIDMap).forEach(function(override) {
                    var asyncAssets = getAssetsByChunkIDs(compilation, _define_property$1({}, override, manifestOverrideChunkIDMap[override].async));
                    var syncAssets = getAssetsByChunkIDs(compilation, _define_property$1({}, override, manifestOverrideChunkIDMap[override].sync));
                    assets[override] = {
                        js: {
                            async: asyncAssets[override].js,
                            sync: syncAssets[override].js
                        },
                        css: {
                            async: asyncAssets[override].css,
                            sync: syncAssets[override].css
                        }
                    };
                });
                return assets;
            }
        },
        {
            key: "_generateStats",
            value: function _generateStats(compiler, compilation, extraOptions) {
                var _this = this;
                return _async_to_generator$1(function() {
                    var _this__options, name, tmp, manifestOptions, metaData, stats, remotes, liveStats, statsOptions, webpackStats, filteredModules, moduleHandler, _moduleHandler_collect, remotes1, exposesMap, sharedMap, err;
                    return _ts_generator$1(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    3,
                                    ,
                                    4
                                ]);
                                _this__options = _this._options, name = _this__options.name, tmp = _this__options.manifest, manifestOptions = tmp === void 0 ? {} : tmp;
                                metaData = _this._getMetaData(compiler, compilation, extraOptions);
                                stats = {
                                    id: name,
                                    name: name,
                                    metaData: metaData,
                                    shared: [],
                                    remotes: [],
                                    exposes: []
                                };
                                if ((typeof manifestOptions === "undefined" ? "undefined" : _type_of$1(manifestOptions)) === 'object' && manifestOptions.disableAssetsAnalyze) {
                                    remotes = _this._remoteManager.statsRemoteWithEmptyUsedIn;
                                    stats.remotes = remotes;
                                    return [
                                        2,
                                        stats
                                    ];
                                }
                                liveStats = compilation.getStats();
                                statsOptions = {
                                    all: false,
                                    modules: true,
                                    builtAt: true,
                                    hash: true,
                                    ids: true,
                                    version: true,
                                    entrypoints: true,
                                    assets: false,
                                    chunks: false,
                                    reasons: true
                                };
                                if (_this._bundler === 'webpack') {
                                    statsOptions['cached'] = true;
                                    statsOptions['cachedModules'] = true;
                                }
                                webpackStats = liveStats.toJson(statsOptions);
                                filteredModules = _this._getFilteredModules(webpackStats);
                                moduleHandler = new ModuleHandler(_this._options, filteredModules, {
                                    bundler: _this._bundler
                                });
                                _moduleHandler_collect = moduleHandler.collect(), remotes1 = _moduleHandler_collect.remotes, exposesMap = _moduleHandler_collect.exposesMap, sharedMap = _moduleHandler_collect.sharedMap;
                                return [
                                    4,
                                    Promise.all([
                                        new Promise(function(resolve) {
                                            var sharedAssets = _this._getProvideSharedAssets(compilation, webpackStats);
                                            Object.keys(sharedMap).forEach(function(sharedKey) {
                                                var assets = sharedAssets[sharedKey];
                                                if (assets) {
                                                    sharedMap[sharedKey].assets = assets;
                                                }
                                            });
                                            resolve();
                                        }),
                                        new Promise(function(resolve) {
                                            var moduleAssets = _this._getModuleAssets(compilation);
                                            Object.keys(exposesMap).forEach(function(exposeKey) {
                                                var assets = moduleAssets[exposeKey];
                                                if (assets) {
                                                    exposesMap[exposeKey].assets = assets;
                                                }
                                                exposesMap[exposeKey].requires = Array.from(exposesMap[exposeKey].requires);
                                            });
                                            resolve();
                                        })
                                    ])
                                ];
                            case 1:
                                _state.sent();
                                return [
                                    4,
                                    Promise.all([
                                        new Promise(function(resolve) {
                                            stats.remotes = remotes1.map(function(remote) {
                                                return _object_spread_props(_object_spread({}, remote), {
                                                    usedIn: Array.from(remote.usedIn.values())
                                                });
                                            });
                                            resolve();
                                        }),
                                        new Promise(function(resolve) {
                                            stats.shared = Object.values(sharedMap).map(function(shared) {
                                                return _object_spread_props(_object_spread({}, shared), {
                                                    usedIn: Array.from(shared.usedIn)
                                                });
                                            });
                                            resolve();
                                        }),
                                        new Promise(function(resolve) {
                                            stats.exposes = Object.values(exposesMap).map(function(expose) {
                                                return _object_spread({}, expose);
                                            });
                                            resolve();
                                        })
                                    ])
                                ];
                            case 2:
                                _state.sent();
                                return [
                                    2,
                                    stats
                                ];
                            case 3:
                                err = _state.sent();
                                throw err;
                            case 4:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "getPublicPath",
            value: function getPublicPath(compiler) {
                if (this._publicPath) {
                    return this._publicPath;
                }
                var _compiler_options = compiler.options, _compiler_options_output = _compiler_options.output, originalPublicPath = _compiler_options_output.publicPath;
                var publicPath = originalPublicPath;
                this._publicPath = publicPath;
                return publicPath;
            }
        },
        {
            key: "init",
            value: function init(options, param) {
                var pluginVersion = param.pluginVersion, bundler = param.bundler;
                this._options = options;
                this._pluginVersion = pluginVersion;
                this._bundler = bundler;
                this._containerManager = new managers.ContainerManager();
                this._containerManager.init(options);
                this._remoteManager = new managers.RemoteManager();
                this._remoteManager.init(options);
                this._sharedManager = new managers.SharedManager();
                this._sharedManager.init(options);
            }
        },
        {
            key: "generateStats",
            value: function generateStats(compiler, compilation) {
                var extraOptions = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
                var _this = this;
                return _async_to_generator$1(function() {
                    var disableEmit, existedStats, _this__options, tmp, manifestOptions, stats, ret, err;
                    return _ts_generator$1(this, function(_state) {
                        switch(_state.label){
                            case 0:
                                _state.trys.push([
                                    0,
                                    4,
                                    ,
                                    5
                                ]);
                                disableEmit = extraOptions.disableEmit;
                                existedStats = compilation.getAsset(_this.fileName);
                                if (existedStats && !isDev()) {
                                    return [
                                        2,
                                        {
                                            stats: JSON.parse(existedStats.source.source().toString()),
                                            filename: _this.fileName
                                        }
                                    ];
                                }
                                _this__options = _this._options, tmp = _this__options.manifest, manifestOptions = tmp === void 0 ? {} : tmp;
                                return [
                                    4,
                                    _this._generateStats(compiler, compilation)
                                ];
                            case 1:
                                stats = _state.sent();
                                if (!((typeof manifestOptions === "undefined" ? "undefined" : _type_of$1(manifestOptions)) === 'object' && manifestOptions.additionalData)) return [
                                    3,
                                    3
                                ];
                                return [
                                    4,
                                    manifestOptions.additionalData({
                                        stats: stats,
                                        pluginOptions: _this._options,
                                        compiler: compiler,
                                        compilation: compilation,
                                        bundler: _this._bundler
                                    })
                                ];
                            case 2:
                                ret = _state.sent();
                                stats = ret || stats;
                                _state.label = 3;
                            case 3:
                                if (!disableEmit) {
                                    compilation.emitAsset(_this.fileName, new compiler.webpack.sources.RawSource(JSON.stringify(stats, null, 2)));
                                }
                                return [
                                    2,
                                    {
                                        stats: stats,
                                        filename: _this.fileName
                                    }
                                ];
                            case 4:
                                err = _state.sent();
                                throw err;
                            case 5:
                                return [
                                    2
                                ];
                        }
                    });
                })();
            }
        },
        {
            key: "validate",
            value: function validate(compiler) {
                var _compiler_options = compiler.options, publicPath = _compiler_options.output.publicPath;
                if (typeof publicPath !== 'string') {
                    console.warn(chalk__default["default"](_templateObject(), PLUGIN_IDENTIFIER, publicPath));
                    return false;
                } else if (publicPath === 'auto') {
                    console.warn(chalk__default["default"](_templateObject1(), PLUGIN_IDENTIFIER, publicPath));
                    return true;
                }
                return true;
            }
        }
    ]);
    return StatsManager;
}();

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
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return !!right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
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
var StatsPlugin = /*#__PURE__*/ function() {
    function StatsPlugin(options, param) {
        var pluginVersion = param.pluginVersion, bundler = param.bundler;
        _class_call_check(this, StatsPlugin);
        _define_property(this, "name", 'StatsPlugin');
        _define_property(this, "_options", {});
        _define_property(this, "_statsManager", new StatsManager());
        _define_property(this, "_manifestManager", new ManifestManager());
        _define_property(this, "_enable", true);
        _define_property(this, "_bundler", 'webpack');
        _define_property(this, "statsInfo", void 0);
        _define_property(this, "manifestInfo", void 0);
        _define_property(this, "disableEmit", void 0);
        try {
            this._options = options;
            this._bundler = bundler;
            this.disableEmit = Boolean(process.env['MF_DISABLE_EMIT_STATS']);
            this._statsManager.init(this._options, {
                pluginVersion: pluginVersion,
                bundler: bundler
            });
            this._manifestManager.init(this._options);
        } catch (err) {
            if (_instanceof(err, Error)) {
                err.message = "[ ".concat(PLUGIN_IDENTIFIER, " ]: Manifest will not generate, because: ").concat(err.message);
            }
            console.error(err);
            this._enable = false;
        }
    }
    _create_class(StatsPlugin, [
        {
            key: "apply",
            value: function apply(compiler) {
                var _this = this;
                if (!this._enable) {
                    return;
                }
                var res = this._statsManager.validate(compiler);
                if (!res) {
                    return;
                }
                compiler.hooks.thisCompilation.tap('generateStats', function(compilation) {
                    var _this1 = _this;
                    compilation.hooks.processAssets.tapPromise({
                        name: 'generateStats',
                        // @ts-ignore use runtime variable in case peer dep not installed
                        stage: compilation.constructor.PROCESS_ASSETS_STAGE_OPTIMIZE_TRANSFER
                    }, /*#__PURE__*/ _async_to_generator(function() {
                        return _ts_generator(this, function(_state) {
                            switch(_state.label){
                                case 0:
                                    if (!(_this1._options.manifest !== false)) return [
                                        3,
                                        3
                                    ];
                                    return [
                                        4,
                                        _this1._statsManager.generateStats(compiler, compilation, {
                                            disableEmit: _this1.disableEmit
                                        })
                                    ];
                                case 1:
                                    _this1.statsInfo = _state.sent();
                                    return [
                                        4,
                                        _this1._manifestManager.generateManifest({
                                            compilation: compilation,
                                            stats: _this1.statsInfo.stats,
                                            publicPath: _this1._statsManager.getPublicPath(compiler),
                                            compiler: compiler,
                                            bundler: _this1._bundler,
                                            additionalData: _type_of(_this1._options.manifest) === 'object' ? _this1._options.manifest.additionalData : undefined
                                        }, {
                                            disableEmit: _this1.disableEmit
                                        })
                                    ];
                                case 2:
                                    _this1.manifestInfo = _state.sent();
                                    _state.label = 3;
                                case 3:
                                    return [
                                        2
                                    ];
                            }
                        });
                    }));
                });
            }
        },
        {
            key: "resourceInfo",
            get: function get() {
                return {
                    stats: this.statsInfo,
                    manifest: this.manifestInfo
                };
            }
        }
    ]);
    return StatsPlugin;
}();

exports.ManifestManager = ManifestManager;
exports.StatsManager = StatsManager;
exports.StatsPlugin = StatsPlugin;
