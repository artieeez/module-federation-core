export declare const resolve: (arg1: string, arg2: string) => Promise<string | false | undefined>;
export declare const resolvePackageJson: (packageName: string, callback: (err: Error | null, result?: string) => void) => Promise<void>;
export declare function getExports(modulePath: string): Promise<string[]>;
