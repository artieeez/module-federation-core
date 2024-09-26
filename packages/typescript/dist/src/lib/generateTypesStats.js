"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypesStats = void 0;
const crypto_1 = __importDefault(require("crypto"));
const generateTypesStats = (filesMap, normalizeOptions) => {
    return Object.entries(filesMap).reduce((acc, [path, contents]) => {
        const filename = path.slice(path.indexOf(normalizeOptions.distDir) +
            `${normalizeOptions.distDir}/`.length);
        return {
            ...acc,
            [filename]: crypto_1.default.createHash('md5').update(contents).digest('hex'),
        };
    }, {});
};
exports.generateTypesStats = generateTypesStats;
//# sourceMappingURL=generateTypesStats.js.map