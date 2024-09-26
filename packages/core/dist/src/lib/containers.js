"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerContainer = registerContainer;
exports.getContainerKey = getContainerKey;
exports.getContainer = getContainer;
exports.initContainer = initContainer;
const scopes_1 = require("./scopes");
/**
 * Creates a shell container on the common scope.
 */
function registerContainer(asyncContainer, remoteOptions) {
    const globalScope = (0, scopes_1.getScope)();
    const containerKey = getContainerKey(remoteOptions);
    globalScope[containerKey] ??= asyncContainer;
}
/**
 * Returns a standardize key for the container
 */
// TODO: @param remoteOptions -  Should string type be deprecated?
function getContainerKey(remoteOptions) {
    if (typeof remoteOptions === 'string') {
        return remoteOptions;
    }
    return remoteOptions.uniqueKey || remoteOptions.global;
}
/**
 * Returns a remote container if available.
 * @param remoteContainer
 * @returns
 */
// @param remoteContainer -  Should string type be deprecated?
async function getContainer(remoteContainer) {
    const globalScope = (0, scopes_1.getScope)();
    if (!remoteContainer) {
        throw Error(`Remote container options is empty`);
    }
    const uniqueKey = getContainerKey(remoteContainer);
    if (globalScope[uniqueKey]) {
        const container = globalScope[uniqueKey];
        return await container;
    }
    return undefined;
}
/**
 * Initializes a remote container with a shared scope.
 */
async function initContainer(asyncContainer, sharedScope) {
    const remoteContainer = await asyncContainer;
    if (!remoteContainer.__initialized && !remoteContainer.__initializing) {
        remoteContainer.__initializing = true;
        // TODO: check init tokens
        // todo: or remove await or type should be promise<void>
        remoteContainer.init(sharedScope.default);
        remoteContainer.__initialized = true;
        delete remoteContainer.__initializing;
    }
    return remoteContainer;
}
//# sourceMappingURL=containers.js.map