"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
class Logger {
    static get logger() {
        return this.loggerInstance;
    }
    static set logger(logger) {
        // todo: consumer should be able to disable logging
        this.loggerInstance = logger || console;
    }
}
exports.Logger = Logger;
Logger.loggerInstance = console;
//# sourceMappingURL=Logger.js.map