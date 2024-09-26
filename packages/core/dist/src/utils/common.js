"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractUrlAndGlobal = extractUrlAndGlobal;
// split the @ syntax into url and global
function extractUrlAndGlobal(urlAndGlobal) {
    const index = urlAndGlobal?.indexOf('@');
    if (index === -1 || index === urlAndGlobal.length - 1) {
        throw new Error(`@mf-core: Invalid request "${urlAndGlobal}"`);
    }
    return [urlAndGlobal.substring(index + 1), urlAndGlobal.substring(0, index)];
}
//# sourceMappingURL=common.js.map