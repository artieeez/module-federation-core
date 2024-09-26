import type { containerPlugin, ManifestModuleInfos, moduleFederationPlugin } from '@module-federation/sdk';
import type { EntryObject } from 'webpack';
import { BasicPluginOptionsManager } from './BasicPluginOptionsManager';
declare class ContainerManager extends BasicPluginOptionsManager<moduleFederationPlugin.ModuleFederationPluginOptions> {
    private _manifestModuleInfos?;
    private _parsedOptions?;
    get enable(): boolean;
    get globalEntryName(): string | undefined;
    get containerPluginExposesOptions(): containerPlugin.ContainerPluginOptions['exposes'];
    get exposeFileNameImportMap(): Record<string, string[]>;
    get exposeObject(): Record<string, string>;
    get exposeFiles(): string[];
    get manifestModuleInfos(): ManifestModuleInfos;
    get webpackEntry(): EntryObject;
    private _parseOptions;
    init(options: moduleFederationPlugin.ModuleFederationPluginOptions): void;
    validate(name?: string): void;
}
export { ContainerManager };
