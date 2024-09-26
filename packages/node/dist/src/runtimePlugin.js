"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
function importNodeModule(name) {
    if (!name) {
        throw new Error('import specifier is required');
    }
    const importModule = new Function('name', `return import(name)`);
    return importModule(name)
        .then((res) => res.default)
        .catch((error) => {
        console.error(`Error importing module ${name}:`, error);
        throw error;
    });
}
function default_1() {
    return {
        name: 'node-federation-plugin',
        beforeInit(args) {
            // Patch webpack chunk loading handlers
            (() => {
                const resolveFile = (rootOutputDir, chunkId) => {
                    const path = __non_webpack_require__('path');
                    return path.join(__dirname, rootOutputDir + __webpack_require__.u(chunkId));
                };
                const resolveUrl = (remoteName, chunkName) => {
                    try {
                        return new URL(chunkName, __webpack_require__.p);
                    }
                    catch {
                        const entryUrl = returnFromCache(remoteName) ||
                            returnFromGlobalInstances(remoteName);
                        if (!entryUrl)
                            return null;
                        const url = new URL(entryUrl);
                        const path = __non_webpack_require__('path');
                        url.pathname = url.pathname.replace(path.basename(url.pathname), chunkName);
                        return url;
                    }
                };
                const returnFromCache = (remoteName) => {
                    const globalThisVal = new Function('return globalThis')();
                    const federationInstances = globalThisVal['__FEDERATION__']['__INSTANCES__'];
                    for (const instance of federationInstances) {
                        const moduleContainer = instance.moduleCache.get(remoteName);
                        if (moduleContainer?.remoteInfo)
                            return moduleContainer.remoteInfo.entry;
                    }
                    return null;
                };
                const returnFromGlobalInstances = (remoteName) => {
                    const globalThisVal = new Function('return globalThis')();
                    const federationInstances = globalThisVal['__FEDERATION__']['__INSTANCES__'];
                    for (const instance of federationInstances) {
                        for (const remote of instance.options.remotes) {
                            if (remote.name === remoteName || remote.alias === remoteName) {
                                console.log('Backup remote entry found:', remote.entry);
                                return remote.entry;
                            }
                        }
                    }
                    return null;
                };
                const loadFromFs = (filename, callback) => {
                    const fs = __non_webpack_require__('fs');
                    const path = __non_webpack_require__('path');
                    const vm = __non_webpack_require__('vm');
                    if (fs.existsSync(filename)) {
                        fs.readFile(filename, 'utf-8', (err, content) => {
                            if (err)
                                return callback(err, null);
                            const chunk = {};
                            try {
                                const script = new vm.Script(`(function(exports, require, __dirname, __filename) {${content}\n})`, {
                                    filename,
                                    importModuleDynamically: vm.constants?.USE_MAIN_CONTEXT_DEFAULT_LOADER ??
                                        importNodeModule,
                                });
                                script.runInThisContext()(chunk, __non_webpack_require__, path.dirname(filename), filename);
                                callback(null, chunk);
                            }
                            catch (e) {
                                console.log("'runInThisContext threw'", e);
                                callback(e, null);
                            }
                        });
                    }
                    else {
                        callback(new Error(`File ${filename} does not exist`), null);
                    }
                };
                const fetchAndRun = (url, chunkName, callback) => {
                    (typeof fetch === 'undefined'
                        ? importNodeModule('node-fetch').then((mod) => mod.default)
                        : Promise.resolve(fetch))
                        .then((fetchFunction) => {
                        return args.origin.loaderHook.lifecycle.fetch
                            .emit(url.href, {})
                            .then((res) => {
                            if (!res || !(res instanceof Response)) {
                                return fetchFunction(url.href).then((response) => response.text());
                            }
                            return res.text();
                        });
                    })
                        .then((data) => {
                        const chunk = {};
                        try {
                            eval(`(function(exports, require, __dirname, __filename) {${data}\n})`)(chunk, __non_webpack_require__, url.pathname.split('/').slice(0, -1).join('/'), chunkName);
                            callback(null, chunk);
                        }
                        catch (e) {
                            callback(e, null);
                        }
                    })
                        .catch((err) => callback(err, null));
                };
                const loadChunk = (strategy, chunkId, rootOutputDir, callback) => {
                    if (strategy === 'filesystem') {
                        return loadFromFs(resolveFile(rootOutputDir, chunkId), callback);
                    }
                    const url = resolveUrl(rootOutputDir, chunkId);
                    if (!url)
                        return callback(null, { modules: {}, ids: [], runtime: null });
                    fetchAndRun(url, chunkId, callback);
                };
                const installedChunks = {};
                const installChunk = (chunk) => {
                    for (const moduleId in chunk.modules) {
                        __webpack_require__.m[moduleId] = chunk.modules[moduleId];
                    }
                    if (chunk.runtime)
                        chunk.runtime(__webpack_require__);
                    for (const chunkId of chunk.ids) {
                        if (installedChunks[chunkId])
                            installedChunks[chunkId][0]();
                        installedChunks[chunkId] = 0;
                    }
                };
                __webpack_require__.l = (url, done, key, chunkId) => {
                    if (!key || chunkId)
                        throw new Error(`__webpack_require__.l name is required for ${url}`);
                    __webpack_require__.federation.runtime
                        .loadScriptNode(url, { attrs: { globalName: key } })
                        .then((res) => {
                        const enhancedRemote = __webpack_require__.federation.instance.initRawContainer(key, url, res);
                        new Function('return globalThis')()[key] = enhancedRemote;
                        done(enhancedRemote);
                    })
                        .catch(done);
                };
                if (__webpack_require__.f) {
                    const handle = (chunkId, promises) => {
                        let installedChunkData = installedChunks[chunkId];
                        if (installedChunkData !== 0) {
                            if (installedChunkData) {
                                promises.push(installedChunkData[2]);
                            }
                            else {
                                const matcher = __webpack_require__.federation.chunkMatcher
                                    ? __webpack_require__.federation.chunkMatcher(chunkId)
                                    : true;
                                if (matcher) {
                                    const promise = new Promise((resolve, reject) => {
                                        installedChunkData = installedChunks[chunkId] = [
                                            resolve,
                                            reject,
                                        ];
                                        const fs = typeof process !== 'undefined'
                                            ? __non_webpack_require__('fs')
                                            : false;
                                        const filename = typeof process !== 'undefined'
                                            ? resolveFile(__webpack_require__.federation.rootOutputDir || '', chunkId)
                                            : false;
                                        if (fs && fs.existsSync(filename)) {
                                            loadChunk('filesystem', chunkId, __webpack_require__.federation.rootOutputDir || '', (err, chunk) => {
                                                if (err)
                                                    return reject(err);
                                                if (chunk)
                                                    installChunk(chunk);
                                                resolve(chunk);
                                            });
                                        }
                                        else {
                                            const chunkName = __webpack_require__.u(chunkId);
                                            const loadingStrategy = typeof process === 'undefined'
                                                ? 'http-eval'
                                                : 'http-vm';
                                            loadChunk(loadingStrategy, chunkName, __webpack_require__.federation.initOptions.name, (err, chunk) => {
                                                if (err)
                                                    return reject(err);
                                                if (chunk)
                                                    installChunk(chunk);
                                                resolve(chunk);
                                            });
                                        }
                                    });
                                    promises.push((installedChunkData[2] = promise));
                                }
                                else {
                                    installedChunks[chunkId] = 0;
                                }
                            }
                        }
                    };
                    if (__webpack_require__.f.require) {
                        console.warn('\x1b[33m%s\x1b[0m', 'CAUTION: build target is not set to "async-node", attempting to patch additional chunk handlers. This may not work');
                        __webpack_require__.f.require = handle;
                    }
                    if (__webpack_require__.f.readFileVm) {
                        __webpack_require__.f.readFileVm = handle;
                    }
                }
            })();
            return args;
        },
    };
}
//# sourceMappingURL=runtimePlugin.js.map