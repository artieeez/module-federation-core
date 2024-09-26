import type { CliPlugin, AppTools, UserConfig, Bundler } from '@modern-js/app-tools';
import type { BundlerConfig } from '../interfaces/bundler';
import type { InternalModernPluginOptions } from '../types';
import { moduleFederationPlugin } from '@module-federation/sdk';
export declare function setEnv(enableSSR: boolean): void;
export declare function modifyBundlerConfig<T extends Bundler>(options: {
    bundlerType: Bundler;
    mfConfig: moduleFederationPlugin.ModuleFederationPluginOptions;
    config: BundlerConfig<T>;
    isServer: boolean;
    modernjsConfig: UserConfig<AppTools>;
    remoteIpStrategy?: 'ipv4' | 'inherit';
}): void;
export declare const moduleFederationConfigPlugin: (userConfig: InternalModernPluginOptions) => CliPlugin<AppTools>;
export default moduleFederationConfigPlugin;
