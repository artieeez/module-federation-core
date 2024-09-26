import { NormalizedFederationConfig } from '../../lib/config/federation-config';
export declare const buildFederationHost: (config: NormalizedFederationConfig) => string;
export declare const initializeHostPlugin: (config: NormalizedFederationConfig) => {
    name: string;
    setup(build: any): void;
};
