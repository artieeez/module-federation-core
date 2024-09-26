export interface MappedPath {
    key: string;
    path: string;
}
export interface GetMappedPathsParams {
    rootTsConfigPath: string;
    sharedMappings?: string[];
    rootPath?: string;
}
export declare function getMappedPaths({ rootTsConfigPath, sharedMappings, rootPath, }: GetMappedPathsParams): MappedPath[];
