"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypesCache = void 0;
const fs_1 = __importDefault(require("fs"));
class TypesCache {
    static getFsFiles(directory) {
        // Simple caching mechanism to improve performance reading the file system
        if (this.fsCache.has(directory)) {
            return this.fsCache.get(directory);
        }
        const files = fs_1.default.readdirSync(directory);
        this.fsCache.set(directory, files);
        return files;
    }
    static getCacheBustedFiles(remote, statsJson) {
        const stats = this.typesCache.get(remote);
        if (!stats) {
            this.typesCache.set(remote, statsJson);
        }
        const cachedFiles = stats?.files;
        const { files } = statsJson;
        const filesToCacheBust = [];
        const filesToDelete = [];
        // No 'cached files' => No types downloaded
        // Go head and download all the files, no need to cache bust
        if (!cachedFiles) {
            return {
                filesToCacheBust: Object.keys(files),
                filesToDelete,
            };
        }
        Object.entries(cachedFiles).forEach(([filename, hash]) => {
            const remoteFileHash = files[filename];
            if (remoteFileHash) {
                if (remoteFileHash !== hash) {
                    filesToCacheBust.push(filename);
                }
            }
            else {
                filesToDelete.push(filename);
            }
        });
        return {
            filesToCacheBust,
            filesToDelete,
        };
    }
}
exports.TypesCache = TypesCache;
TypesCache.fsCache = new Map();
TypesCache.typesCache = new Map();
//# sourceMappingURL=Caching.js.map