"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// packages/retry-plugin/src/index.ts
var src_exports = {};
__export(src_exports, {
  RetryPlugin: () => RetryPlugin
});
module.exports = __toCommonJS(src_exports);

// packages/retry-plugin/src/constant.ts
var defaultRetries = 3;
var defaultRetryDelay = 1e3;
var loadStatus = {
  success: "success",
  error: "error"
};

// packages/retry-plugin/src/fetch-retry.ts
async function fetchWithRetry({ url, options = {}, retryTimes = defaultRetries, retryDelay = defaultRetryDelay, fallback }) {
  try {
    const response = await fetch(url, options);
    const responseClone = response.clone();
    if (!response.ok) {
      throw new Error(`Server error\uFF1A${response.status}`);
    }
    await responseClone.json().catch((error) => {
      throw new Error(`Json parse error: ${error}, url is: ${url}`);
    });
    return response;
  } catch (error) {
    if (retryTimes <= 0) {
      console.log(`>>>>>>>>> \u3010Module Federation RetryPlugin\u3011: retry failed after ${retryTimes} times for url: ${url}, now will try fallbackUrl url <<<<<<<<<`);
      if (fallback && typeof fallback === "function") {
        return fetchWithRetry({
          url: fallback(),
          options,
          retryTimes: 0,
          retryDelay: 0
        });
      }
      if (error instanceof Error && error.message.includes("Json parse error")) {
        throw error;
      }
      throw new Error("\u3010Module Federation RetryPlugin\u3011: The request failed three times and has now been abandoned");
    } else {
      retryDelay > 0 && await new Promise((resolve) => setTimeout(resolve, retryDelay));
      console.log(`\u3010Module Federation RetryPlugin\u3011: Trying again. Number of retries available\uFF1A${retryTimes - 1}`);
      return await fetchWithRetry({
        url,
        options,
        retryTimes: retryTimes - 1,
        retryDelay,
        fallback
      });
    }
  }
}
__name(fetchWithRetry, "fetchWithRetry");

// packages/retry-plugin/src/script-retry.ts
var defaultCreateScript = /* @__PURE__ */ __name((url, attrs) => {
  let script = document.createElement("script");
  script.src = url;
  Object.keys(attrs).forEach((key) => {
    if (key === "async" || key === "defer") {
      script[key] = attrs[key];
    } else if (!script.getAttribute(key)) {
      script.setAttribute(key, attrs[key]);
    }
  });
  return script;
}, "defaultCreateScript");
var getScript = /* @__PURE__ */ __name((url, attrs, customCreateScript) => {
  let script = null;
  if (customCreateScript && typeof customCreateScript === "function") {
    script = customCreateScript(url, attrs);
  }
  if (!script) {
    script = defaultCreateScript(url, attrs);
  }
  return script;
}, "getScript");
async function loadScript(url, attrs, maxRetries = defaultRetries, retryDelay = defaultRetryDelay, customCreateScript) {
  let retries = 0;
  function attemptLoad() {
    return new Promise((resolve, reject) => {
      const script = getScript(url, attrs, customCreateScript);
      script.onload = (event) => {
        resolve({
          status: loadStatus.success,
          event
        });
      };
      script.onerror = (event) => {
        if (retries < maxRetries) {
          retries++;
          console.warn(`\u3010Module Federation RetryPlugin\u3011: Failed to load script. Retrying... (${retries}/${maxRetries})`);
          retryDelay > 0 && setTimeout(() => {
            resolve(attemptLoad());
          }, retryDelay);
        } else {
          console.error("\u3010Module Federation RetryPlugin\u3011: Failed to load script after maximum retries. the url is:", url);
          resolve({
            status: loadStatus.error,
            event
          });
        }
      };
      document.head.appendChild(script);
    });
  }
  __name(attemptLoad, "attemptLoad");
  return attemptLoad();
}
__name(loadScript, "loadScript");
function scriptWithRetry({ url, attrs = {}, retryTimes = defaultRetries, retryDelay = defaultRetryDelay, customCreateScript }) {
  const script = getScript(url, attrs, customCreateScript);
  const originOnerror = script.onerror;
  const originOnLoad = script.onload;
  script.onerror = async (event) => {
    console.warn(`\u3010Module Federation RetryPlugin\u3011: Script load failed, retrying (${retryTimes + 1}/${defaultRetries}): ${url}`);
    const scriptLoader = await loadScript(url, attrs, retryTimes, retryDelay, customCreateScript);
    if (scriptLoader.status === loadStatus.success) {
      originOnLoad?.call(script, scriptLoader?.event);
      return;
    } else {
      originOnerror?.call(script, scriptLoader?.event);
    }
    return;
  };
  return script;
}
__name(scriptWithRetry, "scriptWithRetry");

// packages/retry-plugin/src/index.ts
var RetryPlugin = /* @__PURE__ */ __name(({ fetch: fetchOption, script: scriptOption }) => ({
  name: "retry-plugin",
  async fetch(url, options) {
    const _options = {
      ...options,
      ...fetchOption?.options
    };
    if (fetchOption) {
      if (fetchOption.url) {
        if (url === fetchOption?.url) {
          return fetchWithRetry({
            url: fetchOption.url,
            options: _options,
            retryTimes: fetchOption?.retryTimes,
            fallback: fetchOption?.fallback
          });
        }
      } else {
        return fetchWithRetry({
          url,
          options: _options,
          retryTimes: fetchOption?.retryTimes,
          fallback: fetchOption?.fallback
        });
      }
    }
    return fetch(url, options);
  },
  createScript({ url, attrs }) {
    const scriptAttrs = scriptOption?.attrs ? {
      ...attrs,
      ...scriptOption.attrs
    } : attrs;
    if (scriptOption) {
      if (scriptOption?.url) {
        if (url === scriptOption?.url) {
          return scriptWithRetry({
            url: scriptOption?.url,
            attrs: scriptAttrs,
            retryTimes: scriptOption?.retryTimes,
            customCreateScript: scriptOption?.customCreateScript ? scriptOption.customCreateScript : void 0
          });
        }
      } else {
        return scriptWithRetry({
          url,
          attrs: scriptAttrs,
          retryTimes: scriptOption?.retryTimes,
          customCreateScript: scriptOption?.customCreateScript ? scriptOption.customCreateScript : void 0
        });
      }
    }
    return {};
  }
}), "RetryPlugin");
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  RetryPlugin
});
