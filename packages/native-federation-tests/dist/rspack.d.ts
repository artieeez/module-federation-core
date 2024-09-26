import { R as RemoteOptions, H as HostOptions } from './RemoteOptions-817643e7.js';
import * as unplugin from 'unplugin';
import 'tsup';

declare const NativeFederationTestsRemote: (options: RemoteOptions) => unplugin.RspackPluginInstance;
declare const NativeFederationTestsHost: (options: HostOptions) => unplugin.RspackPluginInstance;

export { NativeFederationTestsHost, NativeFederationTestsRemote };
