interface TransformInput {
    code: string;
    importMap?: string;
    filename: string;
    target?: string;
}
export declare function transform(input: TransformInput): Promise<string>;
export {};
