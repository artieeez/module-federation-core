export type SkipFn = (name: string) => boolean;
export type SkipListEntry = string | RegExp | SkipFn;
export type SkipList = SkipListEntry[];
export type PreparedSkipList = {
    strings: Set<string>;
    functions: SkipFn[];
    regexps: RegExp[];
};
export declare const DEFAULT_SKIP_LIST: SkipListEntry[];
export declare const PREPARED_DEFAULT_SKIP_LIST: PreparedSkipList;
export declare function prepareSkipList(skipList: SkipListEntry[]): PreparedSkipList;
export declare function isInSkipList(entry: string, skipList: PreparedSkipList): boolean;
