import { R as RemoteOptions, H as HostOptions } from './RemoteOptions-8173ef89.js';
import * as unplugin from 'unplugin';

declare const NativeFederationTypeScriptRemote: (options: RemoteOptions) => unplugin.RollupPlugin | unplugin.RollupPlugin[];
declare const NativeFederationTypeScriptHost: (options: HostOptions) => unplugin.RollupPlugin | unplugin.RollupPlugin[];

export { NativeFederationTypeScriptHost, NativeFederationTypeScriptRemote };
