import { NormalizedFederationConfig } from '../../lib/config/federation-config';
export declare const createVirtualRemoteModule: (name: string, ref: string) => string;
export declare const linkRemotesPlugin: (config: NormalizedFederationConfig) => {
    name: string;
    setup(build: any): void;
};
