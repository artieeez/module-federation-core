export declare function orderedUniq<T>(array: T[]): T[];
export declare function cachedReduce<S, T>(array: T[], reducer: (s: S, a: T) => S, s: S): (len: number) => S;
export declare const makeLegalIdentifier: (str: string) => string;
