import type * as IndexModule from './index';
export declare const registerGlobalPlugins: typeof IndexModule.registerGlobalPlugins;
export declare const getRemoteEntry: typeof IndexModule.getRemoteEntry;
export declare const getRemoteInfo: typeof IndexModule.getRemoteInfo;
export declare const loadScript: typeof IndexModule.loadScript;
export declare const loadScriptNode: typeof IndexModule.loadScriptNode;
export declare const init: typeof IndexModule.init;
export declare const loadRemote: typeof IndexModule.loadRemote;
export declare const loadShare: typeof IndexModule.loadShare;
export declare const loadShareSync: typeof IndexModule.loadShareSync;
export declare const preloadRemote: typeof IndexModule.preloadRemote;
export declare const registerRemotes: typeof IndexModule.registerRemotes;
export declare const registerPlugins: typeof IndexModule.registerPlugins;
export declare const getInstance: typeof IndexModule.getInstance;
export declare class FederationHost implements IndexModule.FederationHost {
    private _instance;
    private _args;
    constructor(...args: ConstructorParameters<typeof IndexModule.FederationHost>);
    private _getInstance;
    get options(): import("./type").Options;
    set options(value: import("./type").Options);
    get hooks(): import("./utils/hooks").PluginSystem<{
        beforeInit: import("./utils/hooks").SyncWaterfallHook<{
            userOptions: import("./type").UserOptions;
            options: import("./type").Options;
            origin: IndexModule.FederationHost;
            shareInfo: import("./type").ShareInfos;
        }>;
        init: import("./utils/hooks").SyncHook<[{
            options: import("./type").Options;
            origin: IndexModule.FederationHost;
        }], void>;
        beforeInitContainer: import("./utils/hooks").AsyncWaterfallHook<{
            shareScope: import("./type").ShareScopeMap[string];
            initScope: import("./type").InitScope;
            remoteEntryInitOptions: import("./type").RemoteEntryInitOptions;
            remoteInfo: import("./type").RemoteInfo;
            origin: IndexModule.FederationHost;
        }>;
        initContainer: import("./utils/hooks").AsyncWaterfallHook<{
            shareScope: import("./type").ShareScopeMap[string];
            initScope: import("./type").InitScope;
            remoteEntryInitOptions: import("./type").RemoteEntryInitOptions;
            remoteInfo: import("./type").RemoteInfo;
            remoteEntryExports: import("./type").RemoteEntryExports;
            origin: IndexModule.FederationHost;
            id: string;
            remoteSnapshot?: import("packages/sdk/dist/src").ModuleInfo;
        }>;
    }>;
    get version(): string;
    get name(): string;
    get moduleCache(): Map<string, IndexModule.Module>;
    get snapshotHandler(): import("./plugins/snapshot/SnapshotHandler").SnapshotHandler;
    get sharedHandler(): import("./shared").SharedHandler;
    get remoteHandler(): import("./remote").RemoteHandler;
    get shareScopeMap(): import("./type").ShareScopeMap;
    get loaderHook(): import("./utils/hooks").PluginSystem<{
        getModuleInfo: import("./utils/hooks").SyncHook<[{
            target: Record<string, any>;
            key: any;
        }], void | {
            value: any | undefined;
            key: string;
        }>;
        createScript: import("./utils/hooks").SyncHook<[{
            url: string;
            attrs?: Record<string, any>;
        }], import("packages/sdk/dist/src").CreateScriptHookReturn>;
        createLink: import("./utils/hooks").SyncHook<[{
            url: string;
            attrs?: Record<string, any>;
        }], void | HTMLLinkElement>;
        fetch: import("./utils/hooks").AsyncHook<[string, RequestInit], false | void | Promise<Response>>;
    }>;
    initOptions(...args: Parameters<IndexModule.FederationHost['initOptions']>): import("./type").Options;
    loadShare<T>(...args: Parameters<IndexModule.FederationHost['loadShare']>): Promise<false | (() => T | undefined)>;
    loadShareSync<T>(...args: Parameters<IndexModule.FederationHost['loadShareSync']>): () => T | never;
    initializeSharing(...args: Parameters<IndexModule.FederationHost['initializeSharing']>): Promise<void>[];
    initRawContainer(...args: Parameters<IndexModule.FederationHost['initRawContainer']>): IndexModule.Module;
    loadRemote<T>(...args: Parameters<IndexModule.FederationHost['loadRemote']>): Promise<T | null>;
    preloadRemote(...args: Parameters<IndexModule.FederationHost['preloadRemote']>): Promise<void>;
    initShareScopeMap(...args: Parameters<IndexModule.FederationHost['initShareScopeMap']>): void;
    registerPlugins(...args: Parameters<IndexModule.FederationHost['registerPlugins']>): void;
    registerRemotes(...args: Parameters<IndexModule.FederationHost['registerRemotes']>): void;
    formatOptions(...args: Parameters<IndexModule.FederationHost['formatOptions']>): import("./type").Options;
}
export interface ModuleInterface {
    remoteInfo: IndexModule.Module['remoteInfo'];
    inited: IndexModule.Module['inited'];
    lib: IndexModule.Module['lib'];
    host: IndexModule.Module['host'];
    getEntry(...args: Parameters<IndexModule.Module['getEntry']>): ReturnType<IndexModule.Module['getEntry']>;
    get(...args: Parameters<IndexModule.Module['get']>): ReturnType<IndexModule.Module['get']>;
}
export declare class Module implements ModuleInterface {
    private _instance;
    private _args;
    constructor(...args: ConstructorParameters<typeof IndexModule.Module>);
    private _getInstance;
    get remoteInfo(): import("./type").RemoteInfo;
    set remoteInfo(value: import("./type").RemoteInfo);
    get inited(): boolean;
    set inited(value: boolean);
    get lib(): import("./type").RemoteEntryExports | undefined;
    set lib(value: import("./type").RemoteEntryExports | undefined);
    get host(): IndexModule.FederationHost;
    set host(value: IndexModule.FederationHost);
    getEntry(...args: Parameters<IndexModule.Module['getEntry']>): Promise<import("./type").RemoteEntryExports>;
    get(...args: Parameters<IndexModule.Module['get']>): Promise<any>;
    private wraperFactory;
}
