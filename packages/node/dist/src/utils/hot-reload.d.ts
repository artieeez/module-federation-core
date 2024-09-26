declare global {
    var mfHashMap: Record<string, string> | undefined;
}
export declare const performReload: (shouldReload: any) => Promise<boolean>;
export declare const checkUnreachableRemote: (remoteScope: any) => boolean;
export declare const checkMedusaConfigChange: (remoteScope: any, fetchModule: any) => boolean;
export declare const checkFakeRemote: (remoteScope: any) => boolean;
export declare const createFetcher: (url: string, fetchModule: any, name: string, cb: (hash: string) => void) => any;
export declare const fetchRemote: (remoteScope: any, fetchModule: any) => Promise<boolean>;
export declare const revalidate: (fetchModule?: any, force?: boolean) => Promise<boolean>;
export declare function getFetchModule(): any;
