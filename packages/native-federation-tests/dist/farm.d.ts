import { R as RemoteOptions, H as HostOptions } from './RemoteOptions-817643e7.js';
import 'tsup';

declare const NativeFederationTestsRemote: (options: RemoteOptions) => JsPlugin;
declare const NativeFederationTestsHost: (options: HostOptions) => JsPlugin;

export { NativeFederationTestsHost, NativeFederationTestsRemote };
