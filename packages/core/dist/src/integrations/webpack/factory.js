"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeSharingScope = initializeSharingScope;
exports.loadScript = loadScript;
exports.webpackLoadScript = webpackLoadScript;
const scopes_1 = require("../../lib/scopes");
async function initializeSharingScope(scopeName = 'default') {
    const webpackShareScopes = __webpack_share_scopes__;
    if (!webpackShareScopes?.default) {
        await __webpack_init_sharing__(scopeName);
    }
    // TODO: Why would we reference __webpack_require and not __webpack_share_scopes__ ?
    return __webpack_require__
        .S;
}
function loadScript(containerKey, remoteOptions) {
    return webpackLoadScript(containerKey, remoteOptions.url);
}
async function webpackLoadScript(containerKey, url) {
    const scope = (0, scopes_1.getScope)();
    return new Promise(function (resolve, reject) {
        function resolveRemoteGlobal() {
            const asyncContainer = scope[containerKey];
            return resolve(asyncContainer);
        }
        if (typeof scope[containerKey] !== 'undefined') {
            return resolveRemoteGlobal();
        }
        __webpack_require__.l(url, function (event) {
            if (typeof scope[containerKey] !== 'undefined') {
                return resolveRemoteGlobal();
            }
            const errorType = event && (event.type === 'load' ? 'missing' : event.type);
            const realSrc = event?.target?.src;
            const __webpack_error__ = Object.assign(new Error(), {
                message: `@mf-core: script failed to load. (${errorType}: ${realSrc} or global var ${containerKey} not exists)`,
                name: 'ScriptExternalLoadError',
                type: errorType,
                request: realSrc,
            });
            reject(__webpack_error__);
        }, containerKey);
    });
}
//# sourceMappingURL=factory.js.map