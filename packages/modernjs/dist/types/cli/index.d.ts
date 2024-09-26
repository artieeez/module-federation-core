import type { CliPlugin, AppTools } from '@modern-js/app-tools';
import type { PluginOptions } from '../types';
export declare const moduleFederationPlugin: (userConfig?: PluginOptions) => CliPlugin<AppTools>;
export default moduleFederationPlugin;
export { createModuleFederationConfig } from '@module-federation/enhanced';
