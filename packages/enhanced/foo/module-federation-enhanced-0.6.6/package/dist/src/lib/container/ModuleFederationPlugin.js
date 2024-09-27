/*
    MIT License http://www.opensource.org/licenses/mit-license.php
    Author Tobias Koppers @sokra and Zackary Jackson @ScriptedAlchemy
*/
'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dts_plugin_1 = require("@module-federation/dts-plugin");
const managers_1 = require("@module-federation/managers");
const manifest_1 = require("@module-federation/manifest");
const sdk_1 = require("@module-federation/sdk");
const cli_1 = require("@module-federation/data-prefetch/cli");
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const SharePlugin_1 = __importDefault(require("../sharing/SharePlugin"));
const ContainerPlugin_1 = __importDefault(require("./ContainerPlugin"));
const ContainerReferencePlugin_1 = __importDefault(require("./ContainerReferencePlugin"));
const FederationRuntimePlugin_1 = __importDefault(require("./runtime/FederationRuntimePlugin"));
const RemoteEntryPlugin_1 = require("./runtime/RemoteEntryPlugin");
const MfStartupChunkDependenciesPlugin_1 = __importDefault(require("../startup/MfStartupChunkDependenciesPlugin"));
const FederationModulesPlugin_1 = __importDefault(require("./runtime/FederationModulesPlugin"));
const isValidExternalsType = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/schemas/plugins/container/ExternalsType.check.js'));
class ModuleFederationPlugin {
    /**
     * @param {moduleFederationPlugin.ModuleFederationPluginOptions} options options
     */
    constructor(options) {
        this._options = options;
    }
    _patchBundlerConfig(compiler) {
        const { name } = this._options;
        const MFPluginNum = compiler.options.plugins.filter((p) => p && p['name'] === 'ModuleFederationPlugin').length;
        if (name && MFPluginNum < 2) {
            new compiler.webpack.DefinePlugin({
                FEDERATION_BUILD_IDENTIFIER: JSON.stringify((0, sdk_1.composeKeyWithSeparator)(name, managers_1.utils.getBuildVersion())),
            }).apply(compiler);
        }
    }
    /**
     * Apply the plugin
     * @param {Compiler} compiler the compiler instance
     * @returns {void}
     */
    apply(compiler) {
        const { _options: options } = this;
        // must before ModuleFederationPlugin
        if (options.getPublicPath && options.name) {
            new RemoteEntryPlugin_1.RemoteEntryPlugin(options.name, options.getPublicPath).apply(compiler);
        }
        if (options.experiments?.federationRuntime) {
            new FederationModulesPlugin_1.default().apply(compiler);
            new MfStartupChunkDependenciesPlugin_1.default({
                asyncChunkLoading: true,
            }).apply(compiler);
        }
        if (options.dts !== false) {
            new dts_plugin_1.DtsPlugin(options).apply(compiler);
        }
        new cli_1.PrefetchPlugin(options).apply(compiler);
        new FederationRuntimePlugin_1.default(options).apply(compiler);
        const library = options.library || { type: 'var', name: options.name };
        const remoteType = options.remoteType ||
            (options.library && isValidExternalsType(options.library.type)
                ? options.library.type
                : 'script');
        const useContainerPlugin = options.exposes &&
            (Array.isArray(options.exposes)
                ? options.exposes.length > 0
                : Object.keys(options.exposes).length > 0);
        let disableManifest = options.manifest === false;
        if (useContainerPlugin) {
            ContainerPlugin_1.default.patchChunkSplit(compiler, this._options.name);
        }
        this._patchBundlerConfig(compiler);
        if (!disableManifest && useContainerPlugin) {
            try {
                const containerManager = new managers_1.ContainerManager();
                containerManager.init(options);
                options.exposes = containerManager.containerPluginExposesOptions;
            }
            catch (err) {
                if (err instanceof Error) {
                    err.message = `[ ModuleFederationPlugin ]: Manifest will not generate, because: ${err.message}`;
                }
                console.warn(err);
                disableManifest = true;
            }
        }
        if (library &&
            !compiler.options.output.enabledLibraryTypes?.includes(library.type)) {
            compiler.options.output.enabledLibraryTypes?.push(library.type);
        }
        compiler.hooks.afterPlugins.tap('ModuleFederationPlugin', () => {
            if (useContainerPlugin) {
                new ContainerPlugin_1.default({
                    name: options.name,
                    library,
                    filename: options.filename,
                    runtime: options.runtime,
                    shareScope: options.shareScope,
                    exposes: options.exposes,
                    runtimePlugins: options.runtimePlugins,
                    experiments: options.experiments,
                }).apply(compiler);
            }
            if (options.remotes &&
                (Array.isArray(options.remotes)
                    ? options.remotes.length > 0
                    : Object.keys(options.remotes).length > 0)) {
                new ContainerReferencePlugin_1.default({
                    remoteType,
                    shareScope: options.shareScope,
                    remotes: options.remotes,
                }).apply(compiler);
            }
            if (options.shared) {
                new SharePlugin_1.default({
                    shared: options.shared,
                    shareScope: options.shareScope,
                }).apply(compiler);
            }
        });
        if (!disableManifest) {
            const pkg = require('../../../../package.json');
            this._statsPlugin = new manifest_1.StatsPlugin(options, {
                pluginVersion: pkg.version,
                bundler: 'webpack',
            });
            this._statsPlugin.apply(compiler);
        }
    }
    get statsResourceInfo() {
        return this._statsPlugin?.resourceInfo;
    }
}
exports.default = ModuleFederationPlugin;
//# sourceMappingURL=ModuleFederationPlugin.js.map