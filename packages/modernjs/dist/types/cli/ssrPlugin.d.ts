import type { CliPlugin, AppTools } from '@modern-js/app-tools';
import type { InternalModernPluginOptions } from '../types';
export declare function setEnv(): void;
export declare const moduleFederationSSRPlugin: (userConfig: Required<InternalModernPluginOptions>) => CliPlugin<AppTools>;
export default moduleFederationSSRPlugin;
