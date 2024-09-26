import type { AsyncContainer, RemoteOptions, SharedScope } from '../../types';
export declare function initializeSharingScope(scopeName?: string): Promise<SharedScope>;
export declare function loadScript(containerKey: string, remoteOptions: RemoteOptions): AsyncContainer;
export declare function webpackLoadScript(containerKey: string, url: string): AsyncContainer;
