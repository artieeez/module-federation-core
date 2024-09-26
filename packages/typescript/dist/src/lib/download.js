"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = download;
const fs_1 = __importDefault(require("fs"));
const node_fetch_1 = __importDefault(require("node-fetch"));
const path_1 = __importDefault(require("path"));
const util_1 = __importDefault(require("util"));
const stream_1 = require("stream");
const pipelineAsync = util_1.default.promisify(stream_1.pipeline);
/**
 * Downloads a file from a URL and saves it to disk.
 *
 * @param options Download options.
 */
async function download(options) {
    const { url, destination, filename } = options;
    const response = await (0, node_fetch_1.default)(url);
    if (!response.ok) {
        throw new Error(`Error ${response.status}. Failed to fetch types for URL: ${url}`);
    }
    const fileDest = path_1.default.normalize(path_1.default.join(destination, filename));
    // Create the dir path. This doesn't do anything if dir already exists.
    await fs_1.default.promises.mkdir(path_1.default.dirname(fileDest), {
        recursive: true,
    });
    await pipelineAsync(response.body, fs_1.default.createWriteStream(fileDest, {
        flags: 'w',
    }));
}
//# sourceMappingURL=download.js.map