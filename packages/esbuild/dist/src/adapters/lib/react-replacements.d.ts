interface Replacement {
    file: string;
}
interface ReactReplacements {
    dev: Record<string, Replacement>;
    prod: Record<string, Replacement>;
}
export declare const reactReplacements: ReactReplacements;
export {};
