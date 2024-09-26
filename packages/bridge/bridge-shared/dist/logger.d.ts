export declare class Logger {
    private name;
    private isDebugEnabled;
    private color;
    constructor(name: string);
    log(...messages: any[]): void;
    private stringToColor;
}
