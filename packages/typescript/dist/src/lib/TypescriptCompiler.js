"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypescriptCompiler = void 0;
const typescript_1 = __importDefault(require("typescript"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const Caching_1 = require("./Caching");
const Logger_1 = require("../Logger");
let vueTs;
try {
    vueTs = require('vue-tsc');
}
catch {
    // vue-tsc is an optional dependency.
}
class TypescriptCompiler {
    constructor(options) {
        this.options = options;
        this.tsDefinitionFilesObj = {};
        this.logger = Logger_1.Logger.getLogger();
        const tsConfigCompilerOptions = this.getTSConfigCompilerOptions();
        this.compilerOptions = {
            ...tsConfigCompilerOptions,
            ...options.tsCompilerOptions,
        };
    }
    generateDeclarationFiles(exposedComponents, additionalFilesToCompile = []) {
        const exposeSrcToDestMap = {};
        const normalizedExposedComponents = this.normalizeFiles(Object.entries(exposedComponents), ([exposeDest, exposeSrc]) => {
            const pathWithExt = this.getNormalizedPathWithExt(exposeSrc);
            exposeSrcToDestMap[pathWithExt] = exposeDest;
            return pathWithExt;
        });
        const normalizedAdditionalFiles = this.normalizeFiles(additionalFilesToCompile, this.getNormalizedPathWithExt.bind(this));
        const host = this.createHost(exposeSrcToDestMap);
        const rootNames = [
            ...normalizedAdditionalFiles,
            ...normalizedExposedComponents,
        ];
        const program = this.getCompilerProgram({
            rootNames,
            options: this.compilerOptions,
            host,
        });
        const { diagnostics, emitSkipped } = program.emit();
        if (!emitSkipped) {
            return this.tsDefinitionFilesObj;
        }
        diagnostics.forEach(this.reportCompileDiagnostic.bind(this));
        throw new Error('something went wrong generating declaration files');
    }
    getCompilerProgram(programOptions) {
        const { compiler } = this.options;
        switch (compiler) {
            case 'vue-tsc':
                if (!vueTs) {
                    throw new Error('vue-tsc must be installed when using the vue-tsc compiler option');
                }
                return vueTs.createProgram(programOptions);
            case 'tsc':
            default:
                return typescript_1.default.createProgram(programOptions);
        }
    }
    normalizeFiles(files, mapFn) {
        return files.map(mapFn).filter((entry) => /\.tsx?$/.test(entry));
    }
    getNormalizedPathWithExt(exposeSrc) {
        const cwd = this.options.webpackCompilerOptions.context || process.cwd();
        const [rootDir, entry] = exposeSrc.split(/\/(?=[^/]+$)/);
        const normalizedRootDir = path_1.default.resolve(cwd, rootDir);
        const filenameWithExt = this.getFilenameWithExtension(normalizedRootDir, entry);
        const pathWithExt = path_1.default.resolve(normalizedRootDir, filenameWithExt);
        return path_1.default.normalize(pathWithExt);
    }
    createHost(exposeSrcToDestMap) {
        const host = typescript_1.default.createCompilerHost(this.compilerOptions);
        const originalWriteFile = host.writeFile;
        host.writeFile = (filepath, text, writeOrderByteMark, onError, sourceFiles, data) => {
            this.tsDefinitionFilesObj[filepath] = text;
            originalWriteFile(filepath, text, writeOrderByteMark, onError, sourceFiles, data);
            // create exports matching the `exposes` config
            const sourceFilename = path_1.default.normalize(sourceFiles?.[0].fileName || '');
            const exposedDestFilePath = exposeSrcToDestMap[sourceFilename];
            // create reexport file only if the file was marked for exposing
            if (exposedDestFilePath) {
                const normalizedExposedDestFilePath = path_1.default.resolve(this.options.distDir, `${exposedDestFilePath}.d.ts`);
                const relativePathToCompiledFile = path_1.default.relative(path_1.default.dirname(normalizedExposedDestFilePath), filepath);
                // add ./ so it's always relative, remove d.ts because it's not needed and can throw warnings
                const importPath = './' +
                    relativePathToCompiledFile
                        .replace(/\.d\.ts$/, '')
                        .split(path_1.default.sep) // Windows platform-specific file system path fix
                        .join('/');
                const reexport = `export * from '${importPath}';\nexport { default } from '${importPath}';`;
                this.tsDefinitionFilesObj[normalizedExposedDestFilePath] = reexport;
                // reuse originalWriteFile as it creates folders if they don't exist
                originalWriteFile(normalizedExposedDestFilePath, reexport, writeOrderByteMark);
            }
        };
        return host;
    }
    reportCompileDiagnostic(diagnostic) {
        const { line } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
        this.logger.log('TS Error', diagnostic.code, ':', typescript_1.default.flattenDiagnosticMessageText(diagnostic.messageText, typescript_1.default.sys.newLine));
        this.logger.log('         at', `${diagnostic.file.fileName}:${line + 1}`, typescript_1.default.sys.newLine);
    }
    getTSConfigCompilerOptions() {
        const context = this.options.webpackCompilerOptions.context;
        const tsconfigPath = typescript_1.default.findConfigFile(context, typescript_1.default.sys.fileExists, 'tsconfig.json');
        if (!tsconfigPath) {
            this.logger.error('ERROR: Could not find a valid tsconfig.json');
            process.exit(1);
        }
        const readResult = typescript_1.default.readConfigFile(tsconfigPath, typescript_1.default.sys.readFile);
        const configContent = typescript_1.default.parseJsonConfigFileContent(readResult.config, typescript_1.default.sys, context);
        return configContent.options;
    }
    getFilenameWithExtension(rootDir, entry) {
        // Check path exists and it's a directory
        if (!fs_1.default.existsSync(rootDir) || !fs_1.default.lstatSync(rootDir).isDirectory()) {
            throw new Error('rootDir must be a directory');
        }
        let filename;
        try {
            // Try to resolve exposed component using index
            const files = Caching_1.TypesCache.getFsFiles(path_1.default.join(rootDir, entry));
            filename = files?.find((file) => file.split('.')[0] === 'index');
            if (!filename) {
                throw new Error(`filename ${filename} not found`);
            }
            return `${entry}/${filename}`;
        }
        catch (err) {
            const files = Caching_1.TypesCache.getFsFiles(rootDir);
            // Handle case where directory contains similar filenames
            // or where a filename like `Component.base.tsx` is used
            filename = files?.find((file) => {
                const baseFile = path_1.default.basename(file, path_1.default.extname(file));
                const baseEntry = path_1.default.basename(entry, path_1.default.extname(entry));
                return baseFile === baseEntry;
            });
            if (!filename) {
                throw new Error(`filename ${filename} not found`);
            }
            return filename;
        }
    }
}
exports.TypescriptCompiler = TypescriptCompiler;
//# sourceMappingURL=TypescriptCompiler.js.map