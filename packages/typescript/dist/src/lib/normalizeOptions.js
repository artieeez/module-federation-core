"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeOptions = exports.isObjectEmpty = exports.validateTypeServeOptions = exports.DEFAULT_FETCH_RETRY_DELAY = exports.DEFAULT_FETCH_MAX_RETRY_ATTEMPTS = exports.DEFAULT_FETCH_TIMEOUT = void 0;
const lodash_get_1 = __importDefault(require("lodash.get"));
const path_1 = __importDefault(require("path"));
const constants_1 = require("../constants");
exports.DEFAULT_FETCH_TIMEOUT = 3000;
exports.DEFAULT_FETCH_MAX_RETRY_ATTEMPTS = 3;
exports.DEFAULT_FETCH_RETRY_DELAY = 1000;
const defaultOptions = {
    compiler: 'tsc',
    disableDownloadingRemoteTypes: false,
    disableTypeCompilation: false,
    typescriptFolderName: constants_1.TYPESCRIPT_FOLDER_NAME,
    typescriptCompiledFolderName: constants_1.TYPESCRIPT_COMPILED_FOLDER_NAME,
    additionalFilesToCompile: [],
    typeFetchOptions: {
        downloadRemoteTypesTimeout: exports.DEFAULT_FETCH_TIMEOUT,
        maxRetryAttempts: exports.DEFAULT_FETCH_MAX_RETRY_ATTEMPTS,
        retryDelay: exports.DEFAULT_FETCH_RETRY_DELAY,
        shouldRetryOnTypesNotFound: true,
        shouldRetry: true,
    },
};
const validateTypeServeOptions = (options) => {
    if (!options) {
        throw new Error('TypeServeOptions is required');
    }
    if (!options.host) {
        throw new Error('TypeServeOptions.host is required');
    }
    if (!options.port || !Number.isInteger(options.port)) {
        throw new Error('TypeServeOptions.port is required');
    }
};
exports.validateTypeServeOptions = validateTypeServeOptions;
const isObjectEmpty = (obj) => {
    for (const x in obj) {
        return false;
    }
    return true;
};
exports.isObjectEmpty = isObjectEmpty;
const normalizeOptions = (options, compiler) => {
    const webpackCompilerOptions = compiler.options;
    const { context, watchOptions } = webpackCompilerOptions;
    const { federationConfig, typescriptFolderName, typescriptCompiledFolderName, ...restOptions } = {
        ...defaultOptions,
        ...options,
    };
    const typeFetchOptions = {
        ...defaultOptions.typeFetchOptions,
        ...(options.typeFetchOptions ?? {}),
    };
    const federationFileName = (federationConfig.filename ??
        'remoteEntry.js');
    const distPath = (0, lodash_get_1.default)(webpackCompilerOptions, 'devServer.static.directory') ||
        (0, lodash_get_1.default)(webpackCompilerOptions, 'output.path') ||
        'dist';
    const typesPath = federationFileName.substring(0, federationFileName.lastIndexOf('/'));
    const typesIndexJsonFilePath = path_1.default.join(typesPath, constants_1.TYPES_INDEX_JSON_FILE_NAME);
    const distDir = path_1.default.join(distPath, typesPath, typescriptFolderName);
    const tsCompilerOptions = {
        declaration: true,
        emitDeclarationOnly: true,
        outDir: path_1.default.join(distDir, `/${typescriptCompiledFolderName}/`),
        noEmit: false,
    };
    const webpackPublicPath = webpackCompilerOptions.output.publicPath;
    const publicPath = typeof webpackPublicPath === 'string'
        ? webpackPublicPath === 'auto'
            ? ''
            : webpackPublicPath
        : '';
    const watchOptionsToIgnore = [
        path_1.default.normalize(path_1.default.join(context, typescriptFolderName)),
    ];
    const ignoredWatchOptions = Array.isArray(watchOptions.ignored)
        ? [...watchOptions.ignored, ...watchOptionsToIgnore]
        : watchOptionsToIgnore;
    return {
        ...restOptions,
        typeFetchOptions,
        distDir,
        publicPath,
        tsCompilerOptions,
        typesIndexJsonFileName: constants_1.TYPES_INDEX_JSON_FILE_NAME,
        typesIndexJsonFilePath,
        typescriptFolderName,
        webpackCompilerOptions,
        ignoredWatchOptions,
    };
};
exports.normalizeOptions = normalizeOptions;
//# sourceMappingURL=normalizeOptions.js.map