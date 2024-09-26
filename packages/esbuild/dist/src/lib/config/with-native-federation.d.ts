interface FederationConfig {
    name?: string;
    filename?: string;
    exposes?: Record<string, string>;
    remotes?: Record<string, string>;
    shared?: Record<string, SharedConfig>;
    skip?: string[];
}
interface SharedConfig {
    requiredVersion?: string;
    singleton?: boolean;
    strictVersion?: boolean;
    version?: string;
    includeSecondaries?: boolean;
}
export declare function withFederation(config: FederationConfig): {
    name: string;
    filename: string;
    exposes: Record<string, string>;
    remotes: Record<string, string>;
    shared: Record<string, SharedConfig>;
};
export {};
