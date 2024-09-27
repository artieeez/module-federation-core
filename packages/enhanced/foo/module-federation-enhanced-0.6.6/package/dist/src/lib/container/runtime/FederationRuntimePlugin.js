"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const cli_1 = require("@module-federation/data-prefetch/cli");
const FederationRuntimeModule_1 = __importDefault(require("./FederationRuntimeModule"));
const utils_1 = require("./utils");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const constant_1 = require("../constant");
const EmbedFederationRuntimePlugin_1 = __importDefault(require("./EmbedFederationRuntimePlugin"));
const FederationModulesPlugin_1 = __importDefault(require("./FederationModulesPlugin"));
const HoistContainerReferencesPlugin_1 = __importDefault(require("../HoistContainerReferencesPlugin"));
const btoa_1 = __importDefault(require("btoa"));
const FederationRuntimeDependency_1 = __importDefault(require("./FederationRuntimeDependency"));
const ModuleDependency = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/dependencies/ModuleDependency'));
const { RuntimeGlobals, Template } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
const { mkdirpSync } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack/lib/util/fs'));
const RuntimeToolsPath = require.resolve('@module-federation/runtime-tools');
const BundlerRuntimePath = require.resolve('@module-federation/webpack-bundler-runtime', {
    paths: [RuntimeToolsPath],
});
const RuntimePath = require.resolve('@module-federation/runtime', {
    paths: [RuntimeToolsPath],
});
const EmbeddedRuntimePath = require.resolve('@module-federation/runtime/embedded', {
    paths: [RuntimeToolsPath],
});
const federationGlobal = (0, utils_1.getFederationGlobalScope)(RuntimeGlobals);
const onceForCompler = new WeakSet();
class FederationRuntimePlugin {
    constructor(options) {
        this.options = options ? { ...options } : undefined;
        this.entryFilePath = '';
        this.bundlerRuntimePath = BundlerRuntimePath;
        this.federationRuntimeDependency = undefined; // Initialize as undefined
    }
    static getTemplate(compiler, options, bundlerRuntimePath, experiments) {
        // internal runtime plugin
        const runtimePlugins = options.runtimePlugins;
        const normalizedBundlerRuntimePath = (0, utils_1.normalizeToPosixPath)(bundlerRuntimePath || BundlerRuntimePath);
        let runtimePluginTemplates = '';
        const runtimePluginNames = [];
        if (Array.isArray(runtimePlugins)) {
            runtimePlugins.forEach((runtimePlugin, index) => {
                const runtimePluginName = `plugin_${index}`;
                const runtimePluginPath = (0, utils_1.normalizeToPosixPath)(path_1.default.isAbsolute(runtimePlugin)
                    ? runtimePlugin
                    : path_1.default.join(process.cwd(), runtimePlugin));
                runtimePluginTemplates += `import ${runtimePluginName} from '${runtimePluginPath}';\n`;
                runtimePluginNames.push(runtimePluginName);
            });
        }
        const embedRuntimeLines = Template.asString([
            `if(!${federationGlobal}.runtime){`,
            Template.indent([
                `var prevFederation = ${federationGlobal};`,
                `${federationGlobal} = {}`,
                `for(var key in federation){`,
                Template.indent([`${federationGlobal}[key] = federation[key];`]),
                '}',
                `for(var key in prevFederation){`,
                Template.indent([`${federationGlobal}[key] = prevFederation[key];`]),
                '}',
            ]),
            '}',
        ]);
        return Template.asString([
            `import federation from '${normalizedBundlerRuntimePath}';`,
            runtimePluginTemplates,
            embedRuntimeLines,
            `if(!${federationGlobal}.instance){`,
            Template.indent([
                runtimePluginNames.length
                    ? Template.asString([
                        `var pluginsToAdd = [`,
                        Template.indent(runtimePluginNames.map((item) => `${item} ? (${item}.default || ${item})() : false,`)),
                        `].filter(Boolean);`,
                        `${federationGlobal}.initOptions.plugins = ${federationGlobal}.initOptions.plugins ? `,
                        `${federationGlobal}.initOptions.plugins.concat(pluginsToAdd) : pluginsToAdd;`,
                    ])
                    : '',
                `${federationGlobal}.instance = ${federationGlobal}.runtime.init(${federationGlobal}.initOptions);`,
                `if(${federationGlobal}.attachShareScopeMap){`,
                Template.indent([
                    `${federationGlobal}.attachShareScopeMap(${RuntimeGlobals.require})`,
                ]),
                '}',
                `if(${federationGlobal}.installInitialConsumes){`,
                Template.indent([`${federationGlobal}.installInitialConsumes()`]),
                '}',
            ]),
            cli_1.PrefetchPlugin.addRuntime(compiler, {
                name: options.name,
            }),
            '}',
        ]);
    }
    static getFilePath(compiler, options, bundlerRuntimePath, experiments) {
        const containerName = options.name;
        const hash = (0, utils_1.createHash)(`${containerName} ${FederationRuntimePlugin.getTemplate(compiler, options, bundlerRuntimePath, experiments)}`);
        return path_1.default.join(constant_1.TEMP_DIR, `entry.${hash}.js`);
    }
    getFilePath(compiler) {
        if (this.entryFilePath) {
            return this.entryFilePath;
        }
        if (!this.options) {
            return '';
        }
        if (!this.options?.virtualRuntimeEntry) {
            this.entryFilePath = FederationRuntimePlugin.getFilePath(compiler, this.options, this.bundlerRuntimePath, this.options.experiments);
        }
        else {
            this.entryFilePath = `data:text/javascript;charset=utf-8;base64,${(0, btoa_1.default)(FederationRuntimePlugin.getTemplate(compiler, this.options, this.bundlerRuntimePath, this.options.experiments))}`;
        }
        return this.entryFilePath;
    }
    ensureFile(compiler) {
        if (!this.options) {
            return;
        }
        const filePath = this.getFilePath(compiler);
        try {
            fs_1.default.readFileSync(filePath);
        }
        catch (err) {
            mkdirpSync(fs_1.default, constant_1.TEMP_DIR);
            fs_1.default.writeFileSync(filePath, FederationRuntimePlugin.getTemplate(compiler, this.options, this.bundlerRuntimePath, this.options.experiments));
        }
    }
    getDependency(compiler) {
        if (this.federationRuntimeDependency)
            return this.federationRuntimeDependency;
        this.federationRuntimeDependency = new FederationRuntimeDependency_1.default(this.getFilePath(compiler));
        return this.federationRuntimeDependency;
    }
    prependEntry(compiler) {
        if (!this.options?.virtualRuntimeEntry) {
            this.ensureFile(compiler);
        }
        //if using runtime experiment, use the new include method else patch entry
        if (this.options?.experiments?.federationRuntime) {
            compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation, { normalModuleFactory }) => {
                compilation.dependencyFactories.set(FederationRuntimeDependency_1.default, normalModuleFactory);
                compilation.dependencyTemplates.set(FederationRuntimeDependency_1.default, new ModuleDependency.Template());
            });
            compiler.hooks.make.tapAsync(this.constructor.name, (compilation, callback) => {
                const federationRuntimeDependency = this.getDependency(compiler);
                const hooks = FederationModulesPlugin_1.default.getCompilationHooks(compilation);
                compilation.addInclude(compiler.context, federationRuntimeDependency, { name: undefined }, (err, module) => {
                    if (err) {
                        return callback(err);
                    }
                    hooks.addFederationRuntimeModule.call(federationRuntimeDependency);
                    callback();
                });
            });
        }
        else {
            const entryFilePath = this.getFilePath(compiler);
            (0, utils_1.modifyEntry)({
                compiler,
                prependEntry: (entry) => {
                    Object.keys(entry).forEach((entryName) => {
                        const entryItem = entry[entryName];
                        if (!entryItem.import) {
                            // TODO: maybe set this variable as constant is better https://github.com/webpack/webpack/blob/main/lib/config/defaults.js#L176
                            entryItem.import = ['./src'];
                        }
                        if (!entryItem.import.includes(entryFilePath)) {
                            entryItem.import.unshift(entryFilePath);
                        }
                    });
                },
            });
        }
    }
    injectRuntime(compiler) {
        if (!this.options || !this.options.name) {
            return;
        }
        const name = this.options.name;
        const initOptionsWithoutShared = (0, utils_1.normalizeRuntimeInitOptionsWithOutShared)(this.options);
        const federationGlobal = (0, utils_1.getFederationGlobalScope)(RuntimeGlobals || {});
        compiler.hooks.thisCompilation.tap(this.constructor.name, (compilation) => {
            const handler = (chunk, runtimeRequirements) => {
                if (runtimeRequirements.has(federationGlobal))
                    return;
                runtimeRequirements.add(federationGlobal);
                runtimeRequirements.add(RuntimeGlobals.interceptModuleExecution);
                runtimeRequirements.add(RuntimeGlobals.moduleCache);
                runtimeRequirements.add(RuntimeGlobals.compatGetDefaultExport);
                compilation.addRuntimeModule(chunk, new FederationRuntimeModule_1.default(runtimeRequirements, name, initOptionsWithoutShared));
            };
            compilation.hooks.additionalTreeRuntimeRequirements.tap(this.constructor.name, (chunk, runtimeRequirements) => {
                if (!chunk.hasRuntime())
                    return;
                if (runtimeRequirements.has(RuntimeGlobals.initializeSharing))
                    return;
                if (runtimeRequirements.has(RuntimeGlobals.currentRemoteGetScope))
                    return;
                if (runtimeRequirements.has(RuntimeGlobals.shareScopeMap))
                    return;
                if (runtimeRequirements.has(federationGlobal))
                    return;
                handler(chunk, runtimeRequirements);
            });
            // if federation runtime requirements exist
            // attach runtime module to the chunk
            compilation.hooks.runtimeRequirementInTree
                .for(RuntimeGlobals.initializeSharing)
                .tap(this.constructor.name, handler);
            compilation.hooks.runtimeRequirementInTree
                .for(RuntimeGlobals.currentRemoteGetScope)
                .tap(this.constructor.name, handler);
            compilation.hooks.runtimeRequirementInTree
                .for(RuntimeGlobals.shareScopeMap)
                .tap(this.constructor.name, handler);
            compilation.hooks.runtimeRequirementInTree
                .for(federationGlobal)
                .tap(this.constructor.name, handler);
        });
    }
    setRuntimeAlias(compiler) {
        const { experiments, implementation } = this.options || {};
        const isHoisted = experiments?.federationRuntime === 'hoisted';
        let runtimePath = isHoisted ? EmbeddedRuntimePath : RuntimePath;
        if (implementation) {
            runtimePath = require.resolve(`@module-federation/runtime${isHoisted ? '/embedded' : ''}`, { paths: [implementation] });
        }
        if (isHoisted) {
            runtimePath = runtimePath.replace('.cjs', '.esm');
        }
        const alias = compiler.options.resolve.alias || {};
        alias['@module-federation/runtime$'] =
            alias['@module-federation/runtime$'] || runtimePath;
        alias['@module-federation/runtime-tools$'] =
            alias['@module-federation/runtime-tools$'] ||
                implementation ||
                RuntimeToolsPath;
        // Set up aliases for the federation runtime and tools
        // This ensures that the correct versions are used throughout the project
        compiler.options.resolve.alias = alias;
    }
    apply(compiler) {
        const useModuleFederationPlugin = compiler.options.plugins.find((p) => {
            if (typeof p !== 'object' || !p) {
                return false;
            }
            return p['name'] === 'ModuleFederationPlugin';
        });
        if (useModuleFederationPlugin && !this.options) {
            // @ts-ignore
            this.options = useModuleFederationPlugin._options;
        }
        const useContainerPlugin = compiler.options.plugins.find((p) => {
            if (typeof p !== 'object' || !p) {
                return false;
            }
            return p['name'] === 'ContainerPlugin';
        });
        if (useContainerPlugin && !this.options) {
            this.options = useContainerPlugin._options;
        }
        if (!useContainerPlugin && !useModuleFederationPlugin) {
            this.options = {
                remotes: {},
                ...this.options,
            };
        }
        if (this.options && !this.options?.name) {
            //! the instance may get the same one if the name is the same https://github.com/module-federation/core/blob/main/packages/runtime/src/index.ts#L18
            this.options.name =
                compiler.options.output.uniqueName || `container_${Date.now()}`;
        }
        if (this.options?.implementation) {
            this.bundlerRuntimePath = require.resolve('@module-federation/webpack-bundler-runtime', {
                paths: [this.options.implementation],
            });
        }
        if (this.options?.experiments?.federationRuntime === 'hoisted') {
            this.bundlerRuntimePath = this.bundlerRuntimePath.replace('.cjs.js', '.esm.js');
            new EmbedFederationRuntimePlugin_1.default().apply(compiler);
            new HoistContainerReferencesPlugin_1.default().apply(compiler);
            new compiler.webpack.NormalModuleReplacementPlugin(/@module-federation\/runtime/, (resolveData) => {
                if (/webpack-bundler-runtime/.test(resolveData.contextInfo.issuer)) {
                    resolveData.request = RuntimePath.replace('cjs', 'esm');
                    if (resolveData.createData) {
                        resolveData.createData.request = resolveData.request;
                    }
                }
            }).apply(compiler);
        }
        // dont run multiple times on every apply()
        if (!onceForCompler.has(compiler)) {
            this.prependEntry(compiler);
            this.injectRuntime(compiler);
            this.setRuntimeAlias(compiler);
            onceForCompler.add(compiler);
        }
    }
}
exports.default = FederationRuntimePlugin;
//# sourceMappingURL=FederationRuntimePlugin.js.map