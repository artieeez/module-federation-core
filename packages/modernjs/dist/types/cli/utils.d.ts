import type { webpack, UserConfig, AppTools, Rspack, Bundler } from '@modern-js/app-tools';
import { moduleFederationPlugin } from '@module-federation/sdk';
import { PluginOptions } from '../types';
import { BundlerConfig } from '../interfaces/bundler';
export type ConfigType<T> = T extends 'webpack' ? webpack.Configuration : T extends 'rspack' ? Rspack.Configuration : never;
export declare const getMFConfig: (userConfig: PluginOptions) => Promise<moduleFederationPlugin.ModuleFederationPluginOptions>;
export declare const patchMFConfig: (mfConfig: moduleFederationPlugin.ModuleFederationPluginOptions, isServer: boolean, remoteIpStrategy?: "ipv4" | "inherit") => moduleFederationPlugin.ModuleFederationPluginOptions;
export declare function patchIgnoreWarning<T extends Bundler>(bundlerConfig: BundlerConfig<T>): void;
export declare function patchBundlerConfig<T extends Bundler>(options: {
    bundlerConfig: BundlerConfig<T>;
    isServer: boolean;
    modernjsConfig: UserConfig<AppTools>;
    bundlerType: Bundler;
    mfConfig: moduleFederationPlugin.ModuleFederationPluginOptions;
}): void;
export declare const getIPV4: () => string;
