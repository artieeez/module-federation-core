import { SharedConfig } from './federation-config';
import { SkipListEntry } from '../core/default-skip-list';
type IncludeSecondariesOptions = {
    skip: string | string[];
} | boolean;
type CustomSharedConfig = SharedConfig & {
    includeSecondaries?: IncludeSecondariesOptions;
};
type ConfigObject = Record<string, CustomSharedConfig>;
type Config = (string | ConfigObject)[] | ConfigObject;
export declare const DEFAULT_SECONARIES_SKIP_LIST: string[];
export declare function findRootTsConfigJson(): string;
export declare function findPackageJson(folder: string): string;
export declare function lookupVersion(key: string, workspaceRoot: string): string;
export declare function lookupVersionInMap(key: string, versions: Record<string, string>): string | null;
export declare function _findSecondaries(libPath: string, excludes: string[], shareObject: Record<string, any>, acc: Record<string, any>): void;
export declare function findSecondaries(libPath: string, excludes: string[], shareObject: Record<string, any>): Record<string, any>;
export declare function getSecondaries(includeSecondaries: boolean | {
    skip?: string | string[];
}, libPath: string, key: string, shareObject: Record<string, any>): Record<string, any>;
export declare function readConfiguredSecondaries(parent: string, libPath: string, exclude: string[], shareObject: Record<string, any>): Record<string, any> | null;
export declare function getDefaultEntry(exports: {
    [key: string]: any;
}, key: string): string;
export declare function shareAll(config: CustomSharedConfig, skip?: SkipListEntry[], projectPath?: string): Config;
export declare function setInferVersion(infer: boolean): void;
export declare function share(shareObjects: Record<string, any>, projectPath?: string): Record<string, any>;
export declare function addSecondaries(secondaries: Record<string, any>, result: Record<string, any>): void;
export {};
