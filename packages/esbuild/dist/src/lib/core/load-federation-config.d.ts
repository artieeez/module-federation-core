interface FederationOptions {
    workspaceRoot: string;
    federationConfig: string;
}
export declare function loadFederationConfig(fedOptions: FederationOptions): Promise<any>;
export {};
