import type { Compilation } from 'webpack';
export type LoggerInstance = Compilation['logger'] | Console;
export declare class Logger {
    private static loggerInstance;
    static get logger(): LoggerInstance;
    static set logger(logger: Compilation['logger']);
}
