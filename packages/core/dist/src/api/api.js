"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadAndInitializeRemote = loadAndInitializeRemote;
exports.getModule = getModule;
exports.getModules = getModules;
const webpack_1 = require("../integrations/webpack");
const lib_1 = require("../lib");
const scopes_1 = require("../lib/scopes");
/**
 * Return initialized remote container
 *
 * @returns remote container
 */
async function loadAndInitializeRemote(remoteOptions) {
    const globalScope = (0, scopes_1.getScope)();
    const containerKey = (0, lib_1.getContainerKey)(remoteOptions);
    // TODO: Make this generic, possibly the runtime?
    const asyncContainer = (0, webpack_1.loadScript)(containerKey, remoteOptions);
    if (!asyncContainer) {
        throw new Error('Unable to load remote container');
    }
    // TODO: look at init tokens, pass to getSharingScope
    if (!globalScope.__sharing_scope__) {
        // TODO: Make this generic, possibly the runtime?
        globalScope.__sharing_scope__ = await (0, webpack_1.initializeSharingScope)();
    }
    return (0, lib_1.initContainer)(asyncContainer, globalScope.__sharing_scope__);
}
/**
 * Return remote module from container.
 * If you provide `exportName` it automatically return exact property value from module.
 */
async function getModule({ remoteContainer, modulePath, exportName, }) {
    if (!remoteContainer) {
        return;
    }
    try {
        const modFactory = await remoteContainer?.get(modulePath);
        if (!modFactory) {
            return undefined;
        }
        const mod = modFactory();
        if (!exportName) {
            return mod;
        }
        if (mod && typeof mod === 'object') {
            return mod[exportName];
        }
    }
    catch (error) {
        console.log('[mf] - Unable to getModule', error);
    }
}
/**
 * Return remote modules from container (assumes default exports).
 */
async function getModules({ remoteContainer, modulePaths, }) {
    if (!remoteContainer) {
        return;
    }
    try {
        const moduleFactories = await Promise.all(modulePaths.map(remoteContainer.get, remoteContainer));
        return moduleFactories.filter(Boolean).map((modFactory) => modFactory());
    }
    catch (error) {
        console.error('[mf] - Unable to getModules', error);
    }
}
//# sourceMappingURL=api.js.map