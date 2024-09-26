import { PluginBuild } from 'esbuild';
import { NormalizedFederationConfig } from '../../lib/config/federation-config.js';
export declare const createVirtualShareModule: (name: string, ref: string, exports: string[]) => string;
export declare const createVirtualRemoteModule: (name: string, ref: string) => string;
export declare const moduleFederationPlugin: (config: NormalizedFederationConfig) => {
    name: string;
    setup(build: PluginBuild): void;
};
