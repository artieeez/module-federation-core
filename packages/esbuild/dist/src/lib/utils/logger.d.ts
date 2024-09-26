interface Logger {
    error: (msg: string) => void;
    warn: (msg: string) => void;
    notice: (msg: string) => void;
    info: (msg: string) => void;
    verbose: (msg: string) => void;
    debug: (msg: string) => void;
}
export declare const logger: Logger;
export declare const setLogLevel: (level: string) => void;
export {};
