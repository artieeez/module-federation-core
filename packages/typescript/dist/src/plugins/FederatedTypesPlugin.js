"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FederatedTypesPlugin = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const axios_1 = __importDefault(require("axios"));
const server_1 = require("../lib/server");
const TypescriptCompiler_1 = require("../lib/TypescriptCompiler");
const normalizeOptions_1 = require("../lib/normalizeOptions");
const Caching_1 = require("../lib/Caching");
const download_1 = __importDefault(require("../lib/download"));
const Logger_1 = require("../Logger");
const generateTypesStats_1 = require("../lib/generateTypesStats");
const PLUGIN_NAME = 'FederatedTypesPlugin';
const SUPPORTED_PLUGINS = ['ModuleFederationPlugin', 'NextFederationPlugin'];
let isServe = false;
let typeDownloadCompleted = false;
class FederatedTypesPlugin {
    constructor(options) {
        this.options = options;
    }
    apply(compiler) {
        this.logger = Logger_1.Logger.setLogger(compiler.getInfrastructureLogger(PLUGIN_NAME));
        if (!compiler.options.plugins.some((p) => SUPPORTED_PLUGINS.indexOf(p?.constructor.name ?? '') !== -1)) {
            this.logger.error('Unable to find the Module Federation Plugin, this is plugin no longer provides it by default. Please add it to your webpack config.');
            throw new Error('Unable to find the Module Federation Plugin');
        }
        this.normalizeOptions = (0, normalizeOptions_1.normalizeOptions)(this.options, compiler);
        const { disableDownloadingRemoteTypes, disableTypeCompilation } = this.normalizeOptions;
        // Bail if both 'disableDownloadingRemoteTypes' & 'disableTypeCompilation' are 'truthy'
        if (disableDownloadingRemoteTypes && disableTypeCompilation) {
            return;
        }
        compiler.options.watchOptions.ignored =
            this.normalizeOptions.ignoredWatchOptions;
        if (!disableTypeCompilation) {
            compiler.hooks.beforeCompile.tap(PLUGIN_NAME, (_) => {
                this.generateTypes({ outputPath: compiler.outputPath });
            });
            this.handleTypeServing(compiler, this.normalizeOptions.typeServeOptions);
            // TODO - this is not ideal, but it will repopulate types if clean is enabled
            if (compiler.options.output.clean) {
                compiler.hooks.afterEmit.tap(PLUGIN_NAME, () => {
                    this.generateTypes({ outputPath: compiler.outputPath });
                });
            }
        }
        if (!disableDownloadingRemoteTypes) {
            compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, async (params, callback) => {
                if (typeDownloadCompleted) {
                    callback();
                    return;
                }
                try {
                    this.logger.log('Preparing to download types from remotes on startup');
                    await this.importRemoteTypes();
                    callback();
                }
                catch (error) {
                    callback(this.getError(error));
                }
            });
        }
    }
    handleTypeServing(compiler, typeServeOptions) {
        if (typeServeOptions) {
            compiler.hooks.watchRun.tap(PLUGIN_NAME, () => {
                isServe = true;
            });
            compiler.hooks.beforeCompile.tapAsync(PLUGIN_NAME, async (params, callback) => {
                this.logger.log('Preparing to serve types');
                try {
                    (0, normalizeOptions_1.validateTypeServeOptions)(typeServeOptions);
                }
                catch (error) {
                    callback(error);
                    return;
                }
                this.logger.log('Starting Federated Types server');
                await (0, server_1.startServer)({
                    outputPath: compiler.outputPath,
                    host: typeServeOptions.host,
                    port: typeServeOptions.port,
                    logger: this.logger,
                });
                if (!isServe) {
                    compiler.hooks.failed.tap(PLUGIN_NAME, () => {
                        (0, server_1.stopServer)({ port: typeServeOptions.port, logger: this.logger });
                    });
                    compiler.hooks.done.tap(PLUGIN_NAME, () => {
                        (0, server_1.stopServer)({ port: typeServeOptions.port, logger: this.logger });
                    });
                }
                callback();
            });
        }
    }
    generateTypes({ outputPath }) {
        this.logger.log('Generating types');
        const federatedTypesMap = this.compileTypes();
        const { typesIndexJsonFilePath, publicPath } = this.normalizeOptions;
        const statsJson = {
            publicPath,
            files: (0, generateTypesStats_1.generateTypesStats)(federatedTypesMap, this.normalizeOptions),
        };
        if (Object.entries(statsJson.files).length === 0) {
            return;
        }
        const dest = path_1.default.join(outputPath, typesIndexJsonFilePath);
        fs_1.default.writeFileSync(dest, JSON.stringify(statsJson));
    }
    compileTypes() {
        const exposedComponents = this.options.federationConfig.exposes;
        if (!exposedComponents) {
            return {};
        }
        // './Component': 'path/to/component' -> ['./Component', 'path/to/component']
        const compiler = new TypescriptCompiler_1.TypescriptCompiler(this.normalizeOptions);
        try {
            return compiler.generateDeclarationFiles(exposedComponents, this.options.additionalFilesToCompile);
        }
        catch (error) {
            this.logger.error(error);
            throw error;
        }
    }
    async delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }
    parseRemoteUrls(remoteComponents) {
        if (!remoteComponents ||
            (remoteComponents && (0, normalizeOptions_1.isObjectEmpty)(remoteComponents))) {
            this.logger.log('No Remote components configured');
            return [];
        }
        return Object.entries(remoteComponents).map(([remote, entry]) => {
            let urlEndIndex = entry.length;
            if (entry.endsWith('.js')) {
                urlEndIndex = entry.lastIndexOf('/');
            }
            const remoteUrl = entry.substring(0, urlEndIndex);
            const splitIndex = remoteUrl.indexOf('@');
            const url = remoteUrl.substring(splitIndex + 1);
            return {
                origin: url ?? remoteUrl,
                remote,
            };
        });
    }
    async importRemoteTypes() {
        const remoteUrls = this.parseRemoteUrls(this.options.federationConfig.remotes);
        if (remoteUrls.length === 0) {
            return;
        }
        for (const { origin, remote } of remoteUrls) {
            const { typescriptFolderName, typeFetchOptions } = this.normalizeOptions;
            const { shouldRetryOnTypesNotFound, downloadRemoteTypesTimeout, retryDelay, maxRetryAttempts, shouldRetry, } = typeFetchOptions;
            const isRetrying = shouldRetry || shouldRetryOnTypesNotFound;
            const maxRetryCount = !isRetrying ? 0 : maxRetryAttempts;
            let retryCount = 0;
            let delay = retryDelay;
            while (retryCount < maxRetryCount) {
                try {
                    await this.downloadTypesFromRemote(remote, origin, downloadRemoteTypesTimeout, shouldRetryOnTypesNotFound, typescriptFolderName);
                    break;
                }
                catch (error) {
                    this.logger.error(`Unable to download types from remote '${remote}'`);
                    this.logger.log(error);
                    if (isRetrying) {
                        retryCount++;
                        if (retryCount < maxRetryCount) {
                            delay = retryDelay * retryCount;
                            this.logger.log(`Retrying download of types from remote '${remote}' in ${delay}ms`);
                            await this.delay(delay);
                        }
                    }
                }
            }
            typeDownloadCompleted = true;
        }
    }
    async downloadTypesFromRemote(remote, origin, downloadRemoteTypesTimeout, shouldRetryOnTypesNotFound, typescriptFolderName) {
        try {
            this.logger.log(`Getting types index for remote '${remote}'`);
            const indexTypesUrl = new URL(origin);
            indexTypesUrl.pathname = path_1.default.join(indexTypesUrl.pathname, this.normalizeOptions.typesIndexJsonFileName);
            const resp = await axios_1.default.get(indexTypesUrl.toString(), {
                timeout: downloadRemoteTypesTimeout,
            });
            const statsJson = resp.data;
            if (statsJson?.files) {
                this.logger.log(`Checking with Cache entries`);
                const { filesToCacheBust, filesToDelete } = Caching_1.TypesCache.getCacheBustedFiles(remote, statsJson);
                this.logger.log('filesToCacheBust', filesToCacheBust);
                this.logger.log('filesToDelete', filesToDelete);
                if (filesToDelete.length > 0) {
                    filesToDelete.forEach((file) => {
                        fs_1.default.unlinkSync(path_1.default.resolve(this.normalizeOptions.webpackCompilerOptions.context, typescriptFolderName, remote, file));
                    });
                }
                if (filesToCacheBust.length > 0) {
                    await Promise.all(filesToCacheBust.filter(Boolean).map((file) => {
                        const url = new URL(path_1.default.join(origin, typescriptFolderName, file)).toString();
                        const destination = path_1.default.join(this.normalizeOptions.webpackCompilerOptions.context, typescriptFolderName, remote);
                        this.logger.log('Downloading types...');
                        return (0, download_1.default)({
                            url,
                            destination,
                            filename: file,
                        });
                    }));
                    this.logger.log('downloading complete');
                }
            }
            else {
                this.logger.log(`No types index found for remote '${remote}'`);
                if (shouldRetryOnTypesNotFound) {
                    throw new Error(`shouldRetryOnTypesNotFound is enabled, retrying...`);
                }
            }
        }
        catch (error) {
            this.logger.error(`Unable to download '${remote}' remote types index file: `, error.message);
            throw error;
        }
    }
    getError(error) {
        if (error instanceof Error) {
            return error;
        }
        return new Error(error);
    }
}
exports.FederatedTypesPlugin = FederatedTypesPlugin;
//# sourceMappingURL=FederatedTypesPlugin.js.map