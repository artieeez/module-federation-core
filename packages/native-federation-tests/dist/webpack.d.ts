import { WebpackPluginInstance } from 'unplugin';
import { R as RemoteOptions, H as HostOptions } from './RemoteOptions-817643e7.js';
import 'tsup';

declare const NativeFederationTestsRemote: (options: RemoteOptions) => WebpackPluginInstance;
declare const NativeFederationTestsHost: (options: HostOptions) => WebpackPluginInstance;

export { NativeFederationTestsHost, NativeFederationTestsRemote };
