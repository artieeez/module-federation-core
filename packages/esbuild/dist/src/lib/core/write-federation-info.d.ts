interface FederationInfo {
    [key: string]: any;
}
interface FedOptions {
    workspaceRoot: string;
    outputPath: string;
}
export declare function writeFederationInfo(federationInfo: FederationInfo, fedOptions: FedOptions): void;
export {};
