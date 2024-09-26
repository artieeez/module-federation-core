import React from 'react';
import { ErrorBoundaryPropsWithComponent } from 'react-error-boundary';
type IProps = {
    id: string;
    injectScript?: boolean;
    injectLink?: boolean;
};
type ReactKey = {
    key?: React.Key | null;
};
export declare function collectSSRAssets(options: IProps): React.ReactNode[];
export declare function createRemoteSSRComponent<T, E extends keyof T>(info: {
    loader: () => Promise<T>;
    loading: React.ReactNode;
    fallback: ErrorBoundaryPropsWithComponent['FallbackComponent'];
    export?: E;
}): (props: T[E] extends (...args: any) => any ? Parameters<T[E]>[0] extends undefined ? ReactKey : Parameters<T[E]>[0] & ReactKey : ReactKey) => React.JSX.Element;
export {};
