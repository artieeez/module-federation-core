"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const normalize_webpack_path_1 = require("@module-federation/sdk/normalize-webpack-path");
const { RuntimeModule, Template } = require((0, normalize_webpack_path_1.normalizeWebpackPath)('webpack'));
class EmbedFederationRuntimeModule extends RuntimeModule {
    constructor(containerEntrySet) {
        super('embed federation', RuntimeModule.STAGE_ATTACH);
        this.containerEntrySet = containerEntrySet;
    }
    identifier() {
        return 'webpack/runtime/embed/federation';
    }
    generate() {
        const { compilation, chunk, chunkGraph } = this;
        if (!chunk || !chunkGraph || !compilation) {
            return null;
        }
        let found;
        if (chunk.name) {
            for (const dep of this.containerEntrySet) {
                const mod = compilation.moduleGraph.getModule(dep);
                if (mod && compilation.chunkGraph.isModuleInChunk(mod, chunk)) {
                    found = mod;
                    break;
                }
            }
        }
        if (!found) {
            return null;
        }
        const initRuntimeModuleGetter = compilation.runtimeTemplate.moduleRaw({
            module: found,
            chunkGraph,
            request: found.request,
            weak: false,
            runtimeRequirements: new Set(),
        });
        return Template.asString([`${initRuntimeModuleGetter}`]);
    }
}
exports.default = EmbedFederationRuntimeModule;
//# sourceMappingURL=EmbedFederationRuntimeModule.js.map