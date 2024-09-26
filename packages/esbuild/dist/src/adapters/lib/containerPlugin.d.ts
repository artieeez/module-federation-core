import { PluginBuild } from 'esbuild';
import { NormalizedFederationConfig } from '../../lib/config/federation-config.js';
export declare const createContainerPlugin: (config: NormalizedFederationConfig) => {
    name: string;
    setup(build: PluginBuild): void;
};
