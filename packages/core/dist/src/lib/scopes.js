"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getScope = getScope;
/**
 *
 * @returns Returns the window or global object.
 */
function getScope() {
    return (typeof window !== 'undefined'
        ? window
        : //@ts-ignore
            global.__remote_scope__);
}
//# sourceMappingURL=scopes.js.map