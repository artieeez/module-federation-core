"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.revalidate = exports.fetchRemote = exports.createFetcher = exports.checkFakeRemote = exports.checkMedusaConfigChange = exports.checkUnreachableRemote = exports.performReload = void 0;
exports.getFetchModule = getFetchModule;
const flush_chunks_1 = require("./flush-chunks");
const crypto_1 = __importDefault(require("crypto"));
const hashmap = globalThis.mfHashMap || {};
const requireCacheRegex = /(remote|server|hot-reload|react-loadable-manifest|runtime|styled-jsx)/;
const performReload = async (shouldReload) => {
    if (!shouldReload) {
        return false;
    }
    let req;
    //@ts-ignore
    if (typeof __non_webpack_require__ === 'undefined') {
        req = require;
    }
    else {
        //@ts-ignore
        req = __non_webpack_require__;
    }
    const gs = new Function('return globalThis')();
    const entries = Array.from(gs.entryChunkCache || []);
    if (!gs.entryChunkCache) {
        Object.keys(req.cache).forEach((key) => {
            //delete req.cache[key];
            if (requireCacheRegex.test(key)) {
                delete req.cache[key];
            }
        });
    }
    else {
        gs.entryChunkCache.clear();
    }
    gs.__GLOBAL_LOADING_REMOTE_ENTRY__ = {};
    //@ts-ignore
    gs.__FEDERATION__.__INSTANCES__.map((i) => {
        //@ts-ignore
        i.moduleCache.forEach((mc) => {
            if (mc.remoteInfo && mc.remoteInfo.entryGlobalName) {
                delete gs[mc.remoteInfo.entryGlobalName];
            }
        });
        i.moduleCache.clear();
        if (gs[i.name]) {
            delete gs[i.name];
        }
    });
    //@ts-ignore
    __webpack_require__.federation.instance.moduleCache.clear();
    gs.__FEDERATION__.__INSTANCES__ = [];
    for (const entry of entries) {
        //@ts-ignore
        delete __non_webpack_require__.cache[entry];
    }
    //reload entries again
    for (const entry of entries) {
        await __non_webpack_require__(entry);
    }
    return true;
};
exports.performReload = performReload;
const checkUnreachableRemote = (remoteScope) => {
    for (const property in remoteScope.remotes) {
        if (!remoteScope[property]) {
            console.error('unreachable remote found', property, 'hot reloading to refetch');
            return true;
        }
    }
    return false;
};
exports.checkUnreachableRemote = checkUnreachableRemote;
const checkMedusaConfigChange = (remoteScope, fetchModule) => {
    //@ts-ignore
    if (remoteScope._medusa) {
        //@ts-ignore
        for (const property in remoteScope._medusa) {
            fetchModule(property)
                .then((res) => res.json())
                .then((medusaResponse) => {
                if (medusaResponse.version !==
                    //@ts-ignore
                    remoteScope?._medusa[property].version) {
                    console.log('medusa config changed', property, 'hot reloading to refetch');
                    (0, exports.performReload)(true);
                    return true;
                }
            });
        }
    }
    return false;
};
exports.checkMedusaConfigChange = checkMedusaConfigChange;
const checkFakeRemote = (remoteScope) => {
    for (const property in remoteScope._config) {
        let remote = remoteScope._config[property];
        const resolveRemote = async () => {
            remote = await remote();
        };
        if (typeof remote === 'function') {
            resolveRemote();
        }
        if (remote.fake) {
            console.log('fake remote found', property, 'hot reloading to refetch');
            return true;
        }
    }
    return false;
};
exports.checkFakeRemote = checkFakeRemote;
const createFetcher = (url, fetchModule, name, cb) => {
    return fetchModule(url)
        .then((re) => {
        if (!re.ok) {
            throw new Error(`Error loading remote: status: ${re.status}, content-type: ${re.headers.get('content-type')}`);
        }
        return re.text();
    })
        .then((contents) => {
        const hash = crypto_1.default.createHash('md5').update(contents).digest('hex');
        cb(hash);
    })
        .catch((e) => {
        console.error('Remote', name, url, 'Failed to load or is not online', e);
    });
};
exports.createFetcher = createFetcher;
const fetchRemote = (remoteScope, fetchModule) => {
    const fetches = [];
    let needReload = false;
    for (const property in remoteScope) {
        const name = property;
        const container = remoteScope[property];
        const url = container.entry;
        const fetcher = (0, exports.createFetcher)(url, fetchModule, name, (hash) => {
            if (hashmap[name]) {
                if (hashmap[name] !== hash) {
                    hashmap[name] = hash;
                    needReload = true;
                    console.log(name, 'hash is different - must hot reload server');
                }
            }
            else {
                hashmap[name] = hash;
            }
        });
        fetches.push(fetcher);
    }
    return Promise.all(fetches).then(() => {
        return needReload;
    });
};
exports.fetchRemote = fetchRemote;
//@ts-ignore
const revalidate = async (fetchModule = getFetchModule() || (() => { }), force = false) => {
    const remotesFromAPI = (0, flush_chunks_1.getAllKnownRemotes)();
    //@ts-ignore
    return new Promise((res) => {
        if (force) {
            if (Object.keys(hashmap).length !== 0) {
                res(true);
                return;
            }
        }
        if ((0, exports.checkMedusaConfigChange)(remotesFromAPI, fetchModule)) {
            res(true);
        }
        if ((0, exports.checkFakeRemote)(remotesFromAPI)) {
            res(true);
        }
        (0, exports.fetchRemote)(remotesFromAPI, fetchModule).then((val) => {
            res(val);
        });
    }).then((shouldReload) => {
        return (0, exports.performReload)(shouldReload);
    });
};
exports.revalidate = revalidate;
function getFetchModule() {
    //@ts-ignore
    const loadedModule = 
    //@ts-ignore
    globalThis.webpackChunkLoad || global.webpackChunkLoad || global.fetch;
    if (loadedModule) {
        return loadedModule;
    }
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const nodeFetch = require('node-fetch');
    return nodeFetch.default || nodeFetch;
}
//# sourceMappingURL=hot-reload.js.map