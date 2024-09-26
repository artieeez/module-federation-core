import { Compiler, RspackPluginInstance } from '@rspack/core';
import { moduleFederationPlugin } from '@module-federation/sdk';
export declare class ModuleFederationPlugin implements RspackPluginInstance {
    readonly name = "RspackModuleFederationPlugin";
    private _options;
    private _statsPlugin?;
    constructor(options: moduleFederationPlugin.ModuleFederationPluginOptions);
    private _patchBundlerConfig;
    private _checkSingleton;
    apply(compiler: Compiler): void;
    private _patchChunkSplit;
    get statsResourceInfo(): Partial<import("@module-federation/manifest").ResourceInfo> | undefined;
}
