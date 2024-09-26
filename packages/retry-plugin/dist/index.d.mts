import { FederationRuntimePlugin } from '@module-federation/runtime/types';

interface FetchWithRetryOptions {
  url?: string;
  options?: RequestInit;
  retryTimes?: number;
  retryDelay?: number;
  fallback?: () => string;
}

interface ScriptWithRetryOptions {
  url?: string;
  attrs?: Record<string, string>;
  retryTimes?: number;
  retryDelay?: number;
  customCreateScript?: CreateScriptFunc;
}

type RetryPluginParams = {
  fetch?: FetchWithRetryOptions; // fetch retry options
  script?: ScriptWithRetryOptions; // script retry options
};

type CreateScriptFunc = (
  url: string,
  attrs: Record<string, any>,
) => HTMLScriptElement;

declare const RetryPlugin: (params: RetryPluginParams) => FederationRuntimePlugin;

export { FetchWithRetryOptions, RetryPlugin, RetryPluginParams, ScriptWithRetryOptions };
