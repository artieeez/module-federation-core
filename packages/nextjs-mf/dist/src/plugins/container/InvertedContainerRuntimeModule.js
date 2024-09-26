"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const enhanced_1 = require("@module-federation/enhanced");
const { RuntimeModule, Template, RuntimeGlobals } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
class InvertedContainerRuntimeModule extends RuntimeModule {
    constructor(options) {
        super('inverted container startup', RuntimeModule.STAGE_TRIGGER);
        this.options = options;
    }
    findEntryModuleOfContainer() {
        if (!this.chunk || !this.chunkGraph)
            return undefined;
        const modules = this.chunkGraph.getChunkModules(this.chunk);
        return Array.from(modules).find((module) => module instanceof enhanced_1.container.ContainerEntryModule);
    }
    generate() {
        const { compilation, chunk, chunkGraph } = this;
        if (!compilation || !chunk || !chunkGraph) {
            return '';
        }
        if (chunk.runtime === 'webpack-api-runtime') {
            return '';
        }
        let containerEntryModule;
        for (const containerDep of this.options.containers) {
            const mod = compilation.moduleGraph.getModule(containerDep);
            if (!mod)
                continue;
            if (chunkGraph.isModuleInChunk(mod, chunk)) {
                containerEntryModule = mod;
            }
        }
        if (!containerEntryModule)
            return '';
        const initRuntimeModuleGetter = compilation.runtimeTemplate.moduleRaw({
            module: containerEntryModule,
            chunkGraph,
            weak: false,
            runtimeRequirements: new Set(),
        });
        //@ts-ignore
        const nameJSON = JSON.stringify(containerEntryModule._name);
        return Template.asString([
            `var innerRemote;`,
            `function attachRemote () {`,
            Template.indent([
                `innerRemote = ${initRuntimeModuleGetter};`,
                `var gs = ${RuntimeGlobals.global} || globalThis`,
                `gs[${nameJSON}] = innerRemote`,
                `return innerRemote;`,
            ]),
            `};`,
            `attachRemote();`,
        ]);
    }
}
exports.default = InvertedContainerRuntimeModule;
//# sourceMappingURL=InvertedContainerRuntimeModule.js.map