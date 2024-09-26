"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.webpack = exports.withModuleFederation = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const process = __importStar(require("process"));
const webpack_virtual_modules_1 = __importDefault(require("webpack-virtual-modules"));
const webpack_1 = require("webpack");
const node_logger_1 = require("@storybook/node-logger");
const core_common_1 = require("@storybook/core-common");
const with_module_federation_1 = __importDefault(require("../utils/with-module-federation"));
exports.withModuleFederation = with_module_federation_1.default;
const correctImportPath_1 = require("../utils/correctImportPath");
const { ModuleFederationPlugin } = webpack_1.container;
const webpack = async (webpackConfig, options) => {
    const { plugins = [], context: webpackContext } = webpackConfig;
    const { moduleFederationConfig, presets, nxModuleFederationConfig } = options;
    const context = webpackContext || process.cwd();
    // Detect webpack version. More about storybook webpack config https://storybook.js.org/docs/react/addons/writing-presets#webpack
    const webpackVersion = await presets.apply('webpackVersion');
    node_logger_1.logger.info(`=> [MF] Webpack ${webpackVersion} version detected`);
    if (webpackVersion !== '5') {
        throw new Error('Webpack 5 required: Configure Storybook to use the webpack5 builder');
    }
    if (nxModuleFederationConfig) {
        node_logger_1.logger.info(`=> [MF] Detect NX configuration`);
        const wmf = await (0, with_module_federation_1.default)(nxModuleFederationConfig);
        webpackConfig = {
            ...webpackConfig,
            ...wmf(webpackConfig),
        };
    }
    if (moduleFederationConfig) {
        node_logger_1.logger.info(`=> [MF] Push Module Federation plugin`);
        // @ts-ignore enhanced add new remoteType 'module-import'
        plugins.push(new ModuleFederationPlugin(moduleFederationConfig));
    }
    const entries = await presets.apply('entries');
    const bootstrap = entries.map((entryFile) => `import '${(0, correctImportPath_1.correctImportPath)(context, entryFile)}';`);
    const index = plugins.findIndex(
    //@ts-ignore
    (plugin) => plugin.constructor.name === 'VirtualModulesPlugin');
    if (index !== -1) {
        node_logger_1.logger.info(`=> [MF] Detected plugin VirtualModulesPlugin`);
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        const plugin = plugins[index];
        const virtualEntries = plugin._staticModules; // TODO: Exist another way to get virtual modules? Or maybe it's good idea to open a PR adding a method to get modules?
        const virtualEntriesPaths = Object.keys(virtualEntries);
        node_logger_1.logger.info(`=> [MF] Write files from VirtualModulesPlugin`);
        for (const virtualEntryPath of virtualEntriesPaths) {
            const nodeModulesPath = '/node_modules/';
            const filePathFromProjectRootDir = virtualEntryPath.replace(context, '');
            let sourceCode = virtualEntries[virtualEntryPath];
            let finalPath = virtualEntryPath;
            let finalDir = (0, path_1.dirname)(virtualEntryPath);
            // If virtual file is not in directory node_modules, move file in directory node_modules/.cache/storybook
            if (!filePathFromProjectRootDir.startsWith(nodeModulesPath)) {
                finalPath = (0, path_1.join)(context, nodeModulesPath, '.cache', 'storybook', filePathFromProjectRootDir);
                finalDir = (0, path_1.dirname)(finalPath);
                // Fix storybook stories' path in virtual module
                if (
                // For storybook version before 7
                filePathFromProjectRootDir === '/generated-stories-entry.cjs' ||
                    // For storybook version 7
                    filePathFromProjectRootDir === '/storybook-stories.js') {
                    const isStorybookVersion7 = filePathFromProjectRootDir === '/storybook-stories.js';
                    const nonNormalizedStories = await presets.apply('stories');
                    const stories = (0, core_common_1.normalizeStories)(nonNormalizedStories, {
                        configDir: options.configDir,
                        workingDir: context,
                    });
                    // For each story fix the import path
                    stories.forEach((story) => {
                        // Go up 3 times because the file was moved in /node_modules/.cache/storybook
                        const newDirectory = (0, path_1.join)('..', '..', '..', story.directory);
                        // Adding trailing slash for story directory in storybook v7
                        const oldSrc = isStorybookVersion7
                            ? `'${story.directory}/'`
                            : `'${story.directory}'`;
                        const newSrc = isStorybookVersion7
                            ? `'${newDirectory}/'`
                            : `'${newDirectory}'`;
                        // Fix story directory
                        sourceCode = sourceCode.replace(oldSrc, newSrc);
                    });
                }
            }
            if (!fs_1.default.existsSync(finalDir)) {
                fs_1.default.mkdirSync(finalDir, { recursive: true });
            }
            fs_1.default.writeFileSync(finalPath, sourceCode);
            bootstrap.push(`import '${(0, correctImportPath_1.correctImportPath)(context, finalPath)}';`);
        }
    }
    /**
     * Create a new VirtualModulesPlugin plugin to fix error "Shared module is not available for eager consumption"
     * Entry file content is moved in bootstrap file. More details in the webpack documentation:
     * https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption
     * */
    const virtualModulePlugin = new webpack_virtual_modules_1.default({
        './__entry.js': `import('./__bootstrap.js');`,
        './__bootstrap.js': bootstrap.join('\n'),
    });
    let action = 'Push';
    if (index === -1) {
        plugins.push(virtualModulePlugin);
    }
    else {
        plugins[index] = virtualModulePlugin;
        action = 'Replace';
    }
    node_logger_1.logger.info(`=> [MF] ${action} plugin VirtualModulesPlugin to bootstrap entry point`);
    return {
        ...webpackConfig,
        entry: ['./__entry.js'],
        plugins,
    };
};
exports.webpack = webpack;
//# sourceMappingURL=storybook-addon.js.map