import { Configuration } from 'webpack';
import { ModuleFederationConfig } from '@nx/webpack';
declare const withModuleFederation: (options: ModuleFederationConfig) => Promise<(config: Configuration) => Configuration>;
export default withModuleFederation;
