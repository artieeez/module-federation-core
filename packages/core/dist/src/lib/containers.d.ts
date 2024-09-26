import type { AsyncContainer, RemoteContainer, RemoteOptions, SharedScope } from '../types';
/**
 * Creates a shell container on the common scope.
 */
export declare function registerContainer(asyncContainer: AsyncContainer, remoteOptions: RemoteOptions): void;
/**
 * Returns a standardize key for the container
 */
export declare function getContainerKey(remoteOptions: string | RemoteOptions): string;
/**
 * Returns a remote container if available.
 * @param remoteContainer
 * @returns
 */
export declare function getContainer(remoteContainer: string | RemoteOptions): Promise<RemoteContainer | undefined>;
/**
 * Initializes a remote container with a shared scope.
 */
export declare function initContainer(asyncContainer: AsyncContainer, sharedScope: SharedScope): Promise<RemoteContainer>;
