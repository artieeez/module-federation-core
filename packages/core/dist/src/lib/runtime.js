"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createModuleFederationRuntime = createModuleFederationRuntime;
const webpack_1 = require("../integrations/webpack");
function createModuleFederationRuntime(options) {
    const scriptFactory = options?.scriptFactory ?? { loadScript: webpack_1.loadScript };
    const sharingScopeFactory = options?.sharingScopeFactory ?? {
        initializeSharingScope: webpack_1.initializeSharingScope,
    };
    return {
        scriptFactory,
        sharingScopeFactory,
        remotes: {},
        sharingScope: {
            default: {},
        },
    };
}
//# sourceMappingURL=runtime.js.map