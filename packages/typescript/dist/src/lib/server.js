"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.stopServer = exports.startServer = void 0;
const http_1 = __importDefault(require("http"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const activeServers = new Map();
const startServer = async ({ outputPath, port, host, logger, }) => {
    return new Promise((resolve) => {
        if (activeServers.get(port)) {
            resolve(1);
            return;
        }
        const server = http_1.default.createServer((req, res) => {
            const safeSuffix = path_1.default
                .normalize(req.url)
                .replace(/^(\.\.(\/|\\|$))+/, '');
            const fileName = path_1.default.join(outputPath, safeSuffix);
            try {
                // Ensure the requested file is within the specified directory
                if (!fileName.startsWith(outputPath)) {
                    res.writeHead(403, { 'Content-Type': 'text/plain' });
                    res.end('Forbidden');
                    return;
                }
                // Check if the file exists
                fs_1.default.stat(fileName, (err, stat) => {
                    if (err) {
                        logger.log(`Error reading file: ${err}`);
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    }
                    else {
                        if (stat.isFile()) {
                            res.writeHead(200, { 'Content-Type': 'text/plain' });
                            fs_1.default.createReadStream(fileName).pipe(res);
                        }
                        else {
                            // Handle non-file requests (e.g., directories)
                            res.writeHead(404, { 'Content-Type': 'text/plain' });
                            res.end('Not Found');
                        }
                    }
                });
            }
            catch (err) {
                logger.log(`Error reading file: ${err}`);
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            }
        });
        server.listen(port, host, () => {
            logger.log(`Federated Type Server listening on http://${host}:${port}`);
            resolve(1);
        });
        activeServers.set(port, server);
    });
};
exports.startServer = startServer;
const stopServer = ({ port, logger, }) => {
    if (!activeServers.get(port))
        return;
    logger.log('Stopping Federated Type Server');
    const server = activeServers.get(port);
    if (server) {
        server.close();
    }
};
exports.stopServer = stopServer;
//# sourceMappingURL=server.js.map