import type { GetModuleOptions, GetModulesOptions, RemoteContainer, RemoteOptions } from '../types';
/**
 * Return initialized remote container
 *
 * @returns remote container
 */
export declare function loadAndInitializeRemote(remoteOptions: RemoteOptions): Promise<RemoteContainer>;
/**
 * Return remote module from container.
 * If you provide `exportName` it automatically return exact property value from module.
 */
export declare function getModule<T>({ remoteContainer, modulePath, exportName, }: GetModuleOptions): Promise<T | void>;
/**
 * Return remote modules from container (assumes default exports).
 */
export declare function getModules({ remoteContainer, modulePaths, }: GetModulesOptions): Promise<unknown[] | void>;
