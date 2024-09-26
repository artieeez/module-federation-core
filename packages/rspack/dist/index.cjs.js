'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var sdk = require('@module-federation/sdk');
var manifest = require('@module-federation/manifest');
var managers = require('@module-federation/managers');
var dtsPlugin = require('@module-federation/dts-plugin');
var ReactBridgePlugin = require('@module-federation/bridge-react-webpack-plugin');
var path = require('node:path');
var fs = require('node:fs');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var ReactBridgePlugin__default = /*#__PURE__*/_interopDefaultLegacy(ReactBridgePlugin);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);

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
            _define_property(target, key, source[key]);
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
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
var RuntimeToolsPath = require.resolve('@module-federation/runtime-tools');
var ModuleFederationPlugin = /*#__PURE__*/ function() {
    function ModuleFederationPlugin(options) {
        _class_call_check(this, ModuleFederationPlugin);
        _define_property(this, "name", 'RspackModuleFederationPlugin');
        _define_property(this, "_options", void 0);
        _define_property(this, "_statsPlugin", void 0);
        this._options = options;
    }
    _create_class(ModuleFederationPlugin, [
        {
            key: "_patchBundlerConfig",
            value: function _patchBundlerConfig(compiler) {
                var name = this._options.name;
                if (name) {
                    new compiler.webpack.DefinePlugin({
                        FEDERATION_BUILD_IDENTIFIER: JSON.stringify(sdk.composeKeyWithSeparator(name, managers.utils.getBuildVersion()))
                    }).apply(compiler);
                }
            }
        },
        {
            key: "_checkSingleton",
            value: function _checkSingleton(compiler) {
                var _this = this;
                var count = 0;
                compiler.options.plugins.forEach(function(p) {
                    if (p.name === _this.name) {
                        count++;
                        if (count > 1) {
                            throw new Error("Detect duplicate register ".concat(_this.name, ",please ensure ").concat(_this.name, " is singleton!"));
                        }
                    }
                });
            }
        },
        {
            key: "apply",
            value: function apply(compiler) {
                var _this = this, options = _this._options;
                if (!options.name) {
                    throw new Error('[ ModuleFederationPlugin ]: name is required');
                }
                this._checkSingleton(compiler);
                this._patchBundlerConfig(compiler);
                this._patchChunkSplit(compiler, options.name);
                options.implementation = options.implementation || RuntimeToolsPath;
                var disableManifest = options.manifest === false;
                var disableDts = options.dts === false;
                if (!disableDts) {
                    // @ts-ignore
                    new dtsPlugin.DtsPlugin(options).apply(compiler);
                }
                if (!disableManifest && options.exposes) {
                    try {
                        var containerManager = new managers.ContainerManager();
                        containerManager.init(options);
                        options.exposes = containerManager.containerPluginExposesOptions;
                    } catch (err) {
                        if (_instanceof(err, Error)) {
                            err.message = "[ ModuleFederationPlugin ]: Manifest will not generate, because: ".concat(err.message);
                        }
                        console.warn(err);
                        disableManifest = true;
                    }
                }
                new compiler.webpack.container.ModuleFederationPlugin(options).apply(compiler);
                var runtimeESMPath = require.resolve('@module-federation/runtime/dist/index.esm.js', {
                    paths: [
                        options.implementation
                    ]
                });
                compiler.hooks.afterPlugins.tap('PatchAliasWebpackPlugin', function() {
                    compiler.options.resolve.alias = _object_spread_props(_object_spread({}, compiler.options.resolve.alias), {
                        '@module-federation/runtime$': runtimeESMPath
                    });
                });
                if (!disableManifest) {
                    this._statsPlugin = new manifest.StatsPlugin(options, {
                        pluginVersion: "0.6.6",
                        bundler: 'rspack'
                    });
                    // @ts-ignore
                    this._statsPlugin.apply(compiler);
                }
                // react bridge plugin
                var nodeModulesPath = path__default["default"].resolve(compiler.context, 'node_modules');
                var reactPath = path__default["default"].join(nodeModulesPath, '@module-federation/bridge-react');
                // Check whether react exists
                if (fs__default["default"].existsSync(reactPath)) {
                    new ReactBridgePlugin__default["default"]({
                        moduleFederationOptions: this._options
                    }).apply(compiler);
                }
            }
        },
        {
            key: "_patchChunkSplit",
            value: function _patchChunkSplit(compiler, name) {
                var splitChunks = compiler.options.optimization.splitChunks;
                var patchChunkSplit = function(cacheGroup) {
                    switch(typeof cacheGroup === "undefined" ? "undefined" : _type_of(cacheGroup)){
                        case 'boolean':
                        case 'string':
                        case 'function':
                            break;
                        //  cacheGroup.chunks will inherit splitChunks.chunks, so you only need to modify the chunks that are set separately
                        case 'object':
                            {
                                if (_instanceof(cacheGroup, RegExp)) {
                                    break;
                                }
                                if (!cacheGroup.chunks) {
                                    break;
                                }
                                if (typeof cacheGroup.chunks === 'function') {
                                    var prevChunks = cacheGroup.chunks;
                                    cacheGroup.chunks = function(chunk) {
                                        if (chunk.name && (chunk.name === name || chunk.name === name + '_partial')) {
                                            return false;
                                        }
                                        return prevChunks(chunk);
                                    };
                                    break;
                                }
                                if (cacheGroup.chunks === 'all') {
                                    cacheGroup.chunks = function(chunk) {
                                        if (chunk.name && (chunk.name === name || chunk.name === name + '_partial')) {
                                            return false;
                                        }
                                        return true;
                                    };
                                    break;
                                }
                                if (cacheGroup.chunks === 'initial') {
                                    cacheGroup.chunks = function(chunk) {
                                        if (chunk.name && (chunk.name === name || chunk.name === name + '_partial')) {
                                            return false;
                                        }
                                        return chunk.isOnlyInitial();
                                    };
                                    break;
                                }
                                break;
                            }
                    }
                };
                if (!splitChunks) {
                    return;
                }
                // 修改 splitChunk.chunks
                patchChunkSplit(splitChunks);
                var cacheGroups = splitChunks.cacheGroups;
                if (!cacheGroups) {
                    return;
                }
                // 修改 splitChunk.cacheGroups[key].chunks
                Object.keys(cacheGroups).forEach(function(cacheGroupKey) {
                    patchChunkSplit(cacheGroups[cacheGroupKey]);
                });
            }
        },
        {
            key: "statsResourceInfo",
            get: function get() {
                var _this__statsPlugin;
                return (_this__statsPlugin = this._statsPlugin) === null || _this__statsPlugin === void 0 ? void 0 : _this__statsPlugin.resourceInfo;
            }
        }
    ]);
    return ModuleFederationPlugin;
}();

exports.ModuleFederationPlugin = ModuleFederationPlugin;
