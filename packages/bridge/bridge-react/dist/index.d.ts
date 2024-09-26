import { ComponentType } from 'react';
import { default as default_2 } from 'react';
import { default as default_3 } from 'react-dom/client';
import { ErrorInfo } from 'react';
import { PropsWithChildren } from 'react';
import * as React_2 from 'react';

export declare function createBridgeComponent<T>(bridgeInfo: ProviderFnParams<T>): () => {
    render(info: RenderFnParams & any): Promise<void>;
    destroy(info: {
        dom: HTMLElement;
    }): Promise<void>;
    rawComponent: React_2.ComponentType<T>;
    __BRIDGE_FN__: (_args: T) => void;
};

export declare function createRemoteComponent<T, E extends keyof T>(info: {
    loader: () => Promise<T>;
    loading: default_2.ReactNode;
    fallback: ErrorBoundaryPropsWithComponent['FallbackComponent'];
    export?: E;
}): default_2.ForwardRefExoticComponent<default_2.PropsWithoutRef<ProviderParams & ("__BRIDGE_FN__" extends keyof (T[E] extends (...args: any) => any ? ReturnType<T[E]> : never) ? (T[E] extends (...args: any) => any ? ReturnType<T[E]> : never)["__BRIDGE_FN__"] extends (...args: any) => any ? Parameters<(T[E] extends (...args: any) => any ? ReturnType<T[E]> : never)["__BRIDGE_FN__"]>[0] : {} : {})> & default_2.RefAttributes<HTMLDivElement>>;

declare type ErrorBoundaryPropsWithComponent = ErrorBoundarySharedProps & {
    fallback?: never;
    FallbackComponent: ComponentType<FallbackProps>;
    fallbackRender?: never;
};

declare type ErrorBoundarySharedProps = PropsWithChildren<{
    onError?: (error: Error, info: ErrorInfo) => void;
    onReset?: (details: {
        reason: "imperative-api";
        args: any[];
    } | {
        reason: "keys";
        prev: any[] | undefined;
        next: any[] | undefined;
    }) => void;
    resetKeys?: any[];
}>;

declare type FallbackProps = {
    error: any;
    resetErrorBoundary: (...args: any[]) => void;
};

declare type ProviderFnParams<T> = {
    rootComponent: React_2.ComponentType<T>;
    render?: (App: React_2.ReactElement, id?: HTMLElement | string) => RootType | Promise<RootType>;
};

export declare interface ProviderParams {
    moduleName?: string;
    basename?: string;
    memoryRoute?: {
        entryPath: string;
    };
    style?: React.CSSProperties;
    className?: string;
}

export declare interface RenderFnParams extends ProviderParams {
    dom: HTMLElement;
}

declare type RootType = HTMLElement | default_3.Root;

export { }
