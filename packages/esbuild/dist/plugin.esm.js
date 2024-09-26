import fs__default, { promises } from 'fs';
import { init, parse as parse$1 } from 'es-module-lexer';
import { init as init$1, parse } from 'cjs-module-lexer';
import { promisify } from 'util';
import enhancedResolve from 'enhanced-resolve';
import path__default from 'path';
import { g as getExternals } from './get-externals.esm.js';

const resolve = promisify(enhancedResolve.create({
    mainFields: [
        'browser',
        'module',
        'main'
    ]
}));
async function getExports(modulePath) {
    await init;
    await init$1;
    try {
        const exports = [];
        const paths = [];
        const resolvedPath = await resolve(process.cwd(), modulePath);
        if (typeof resolvedPath === 'string') {
            paths.push(resolvedPath);
        }
        while(paths.length > 0){
            const currentPath = paths.pop();
            if (currentPath) {
                const content = await fs__default.promises.readFile(currentPath, 'utf8');
                try {
                    const { exports: cjsExports } = parse(content);
                    exports.push(...cjsExports);
                } catch (e) {
                    const [, esExports] = parse$1(content);
                    exports.push(...esExports.map((exp)=>exp.n));
                }
            // TODO: Handle re-exports
            }
        }
        if (!exports.includes('default')) {
            exports.push('default');
        }
        return exports;
    } catch (e) {
        console.log(e);
        return [
            'default'
        ];
    }
}

var version = "0.0.24";

function _extends$1() {
    _extends$1 = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends$1.apply(this, arguments);
}
const writeRemoteManifest = async (config, result)=>{
    var _result_metafile, _result_metafile1;
    if (result.errors && result.errors.length > 0) {
        console.warn('Build errors detected, skipping writeRemoteManifest.');
        return;
    }
    let packageJson;
    try {
        const packageJsonPath = await resolve(process.cwd(), '/package.json') || '';
        packageJson = require(packageJsonPath);
    } catch (e) {
        packageJson = {
            name: config.name
        };
    }
    var _process_env_NODE_ENV;
    const envType = process.env['NODE_ENV'] === 'development' ? 'local' : (_process_env_NODE_ENV = process.env['NODE_ENV']) != null ? _process_env_NODE_ENV : '';
    const publicPath = config.publicPath || 'auto';
    let containerName = '';
    const outputMap = Object.entries(((_result_metafile = result.metafile) == null ? void 0 : _result_metafile.outputs) || {}).reduce((acc, [chunkKey, chunkValue])=>{
        const { entryPoint } = chunkValue;
        const key = entryPoint || chunkKey;
        if (key.startsWith('container:') && key.endsWith(config.filename)) {
            containerName = key;
        }
        acc[key] = _extends$1({}, chunkValue, {
            chunk: chunkKey
        });
        return acc;
    }, {});
    if (!outputMap[containerName]) return;
    const outputMapWithoutExt = Object.entries(((_result_metafile1 = result.metafile) == null ? void 0 : _result_metafile1.outputs) || {}).reduce((acc, [chunkKey, chunkValue])=>{
        const { entryPoint } = chunkValue;
        const key = entryPoint || chunkKey;
        const trimKey = key.substring(0, key.lastIndexOf('.')) || key;
        acc[trimKey] = _extends$1({}, chunkValue, {
            chunk: chunkKey
        });
        return acc;
    }, {});
    const getChunks = (meta, outputMap)=>{
        const assets = {
            js: {
                async: [],
                sync: []
            },
            css: {
                async: [],
                sync: []
            }
        };
        if (meta == null ? void 0 : meta.imports) {
            meta.imports.forEach((imp)=>{
                const importMeta = outputMap[imp.path];
                if (importMeta && importMeta.kind !== 'dynamic-import') {
                    const childAssets = getChunks(importMeta, outputMap);
                    assets.js.async.push(...childAssets.js.async);
                    assets.js.sync.push(...childAssets.js.sync);
                    assets.css.async.push(...childAssets.css.async);
                    assets.css.sync.push(...childAssets.css.sync);
                }
            });
            const assetType = meta.chunk.endsWith('.js') ? 'js' : 'css';
            const syncOrAsync = meta.kind === 'dynamic-import' ? 'async' : 'sync';
            assets[assetType][syncOrAsync].push(meta.chunk);
        }
        return assets;
    };
    const shared = config.shared ? await Promise.all(Object.entries(config.shared).map(async ([pkg, config])=>{
        const meta = outputMap['esm-shares:' + pkg];
        const chunks = getChunks(meta, outputMap);
        let { version } = config;
        if (!version) {
            try {
                const packageJsonPath = await resolve(process.cwd(), `${pkg}/package.json`);
                if (packageJsonPath) {
                    version = JSON.parse(fs__default.readFileSync(packageJsonPath, 'utf-8')).version;
                }
            } catch (e) {
                console.warn(`Can't resolve ${pkg} version automatically, consider setting "version" manually`);
            }
        }
        return {
            id: `${config.name}:${pkg}`,
            name: pkg,
            version: version || config.version,
            singleton: config.singleton || false,
            requiredVersion: config.requiredVersion || '*',
            assets: chunks
        };
    })) : [];
    const remotes = config.remotes ? Object.entries(config.remotes).map(([alias, remote])=>{
        const [federationContainerName, entry] = remote.includes('@') ? remote.split('@') : [
            alias,
            remote
        ];
        return {
            federationContainerName,
            moduleName: '',
            alias,
            entry
        };
    }) : [];
    const exposes = config.exposes ? await Promise.all(Object.entries(config.exposes).map(async ([expose, value])=>{
        const exposedFound = outputMapWithoutExt[value.replace('./', '')];
        const chunks = getChunks(exposedFound, outputMap);
        return {
            id: `${config.name}:${expose.replace(/^\.\//, '')}`,
            name: expose.replace(/^\.\//, ''),
            assets: chunks,
            path: expose
        };
    })) : [];
    const types = {
        path: '',
        name: '',
        zip: '@mf-types.zip',
        api: '@mf-types.d.ts'
    };
    var _packageJson_name;
    const manifest = {
        id: config.name,
        name: config.name,
        metaData: {
            name: config.name,
            type: 'app',
            buildInfo: {
                buildVersion: envType,
                buildName: ((_packageJson_name = packageJson.name) != null ? _packageJson_name : 'default').replace(/[^a-zA-Z0-9]/g, '_')
            },
            remoteEntry: {
                name: config.filename,
                path: outputMap[containerName] ? path__default.dirname(outputMap[containerName].chunk) : '',
                type: 'esm'
            },
            types,
            globalName: config.name,
            pluginVersion: version,
            publicPath
        },
        shared,
        remotes,
        exposes
    };
    const manifestPath = path__default.join(path__default.dirname(outputMap[containerName].chunk), 'mf-manifest.json');
    fs__default.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');
};

const createContainerCode = `
import bundler_runtime_base from '@module-federation/webpack-bundler-runtime';
// import instantiatePatch from "./federation.js";

const createContainer = (federationOptions) => {
  // await instantiatePatch(federationOptions, true);
  const {exposes, name, remotes = [], shared, plugins} = federationOptions;

  const __webpack_modules__ = {
    "./node_modules/.federation/entry.1f2288102e035e2ed66b2efaf60ad043.js": (module, __webpack_exports__, __webpack_require__) => {
      __webpack_require__.r(__webpack_exports__);
      const bundler_runtime = __webpack_require__.n(bundler_runtime_base);
      const prevFederation = __webpack_require__.federation;
      __webpack_require__.federation = {};
      for (const key in bundler_runtime()) {
        __webpack_require__.federation[key] = bundler_runtime()[key];
      }
      for (const key in prevFederation) {
        __webpack_require__.federation[key] = prevFederation[key];
      }
      if (!__webpack_require__.federation.instance) {
        const pluginsToAdd = plugins || [];
        __webpack_require__.federation.initOptions.plugins = __webpack_require__.federation.initOptions.plugins ?
          __webpack_require__.federation.initOptions.plugins.concat(pluginsToAdd) : pluginsToAdd;
        __webpack_require__.federation.instance = __webpack_require__.federation.runtime.init(__webpack_require__.federation.initOptions);
        if (__webpack_require__.federation.attachShareScopeMap) {
          __webpack_require__.federation.attachShareScopeMap(__webpack_require__);
        }
        if (__webpack_require__.federation.installInitialConsumes) {
          __webpack_require__.federation.installInitialConsumes();
        }
      }
    },

    "webpack/container/entry/createContainer": (module, exports, __webpack_require__) => {
      const moduleMap = {};
      for (const key in exposes) {
        if (Object.prototype.hasOwnProperty.call(exposes, key)) {
          moduleMap[key] = () => Promise.resolve(exposes[key]()).then(m => () => m);
        }
      }

      const get = (module, getScope) => {
        __webpack_require__.R = getScope;
        getScope = (
          __webpack_require__.o(moduleMap, module)
            ? moduleMap[module]()
            : Promise.resolve().then(() => {
              throw new Error("Module '" + module + "' does not exist in container.");
            })
        );
        __webpack_require__.R = undefined;
        return getScope;
      };
      const init = (shareScope, initScope, remoteEntryInitOptions) => {
        return __webpack_require__.federation.bundlerRuntime.initContainerEntry({
          webpackRequire: __webpack_require__,
          shareScope: shareScope,
          initScope: initScope,
          remoteEntryInitOptions: remoteEntryInitOptions,
          shareScopeKey: "default"
        });
      };
      __webpack_require__("./node_modules/.federation/entry.1f2288102e035e2ed66b2efaf60ad043.js");

      // This exports getters to disallow modifications
      __webpack_require__.d(exports, {
        get: () => get,
        init: () => init,
        moduleMap: () => moduleMap,
      });
    }
  };

  const __webpack_module_cache__ = {};

  const __webpack_require__ = (moduleId) => {
    let cachedModule = __webpack_module_cache__[moduleId];
    if (cachedModule !== undefined) {
      return cachedModule.exports;
    }
    let module = __webpack_module_cache__[moduleId] = {
      id: moduleId,
      loaded: false,
      exports: {}
    };

    const execOptions = {
      id: moduleId,
      module: module,
      factory: __webpack_modules__[moduleId],
      require: __webpack_require__
    };
    __webpack_require__.i.forEach(handler => {
      handler(execOptions);
    });
    module = execOptions.module;
    execOptions.factory.call(module.exports, module, module.exports, execOptions.require);

    module.loaded = true;

    return module.exports;
  };

  __webpack_require__.m = __webpack_modules__;
  __webpack_require__.c = __webpack_module_cache__;
  __webpack_require__.i = [];

  if (!__webpack_require__.federation) {
    __webpack_require__.federation = {
      initOptions: {
        "name": name,
        "remotes": remotes.map(remote => ({
          "type": remote.type,
          "alias": remote.alias,
          "name": remote.name,
          "entry": remote.entry,
          "shareScope": remote.shareScope || "default"
        }))
      },
      chunkMatcher: () => true,
      rootOutputDir: "",
      initialConsumes: undefined,
      bundlerRuntimeOptions: {}
    };
  }

  __webpack_require__.n = (module) => {
    const getter = module && module.__esModule ? () => module['default'] : () => module;
    __webpack_require__.d(getter, {a: getter});
    return getter;
  };

  __webpack_require__.d = (exports, definition) => {
    for (const key in definition) {
      if (__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
        Object.defineProperty(exports, key, {enumerable: true, get: definition[key]});
      }
    }
  };

  __webpack_require__.f = {};

  __webpack_require__.g = (() => {
    if (typeof globalThis === 'object') return globalThis;
    try {
      return this || new Function('return this')();
    } catch (e) {
      if (typeof window === 'object') return window;
    }
  })();

  __webpack_require__.o = (obj, prop) => Object.prototype.hasOwnProperty.call(obj, prop);

  __webpack_require__.r = (exports) => {
    if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
      Object.defineProperty(exports, Symbol.toStringTag, {value: 'Module'});
    }
    Object.defineProperty(exports, '__esModule', {value: true});
  };

  __webpack_require__.federation.initOptions.shared = shared;
  __webpack_require__.S = {};
  const initPromises = {};
  const initTokens = {};
  __webpack_require__.I = (name, initScope) => {
    return __webpack_require__.federation.bundlerRuntime.I({
      shareScopeName: name,
      webpackRequire: __webpack_require__,
      initPromises: initPromises,
      initTokens: initTokens,
      initScope: initScope,
    });
  };

  const __webpack_exports__ = __webpack_require__("webpack/container/entry/createContainer");
  const __webpack_exports__get = __webpack_exports__.get;
  const __webpack_exports__init = __webpack_exports__.init;
  const __webpack_exports__moduleMap = __webpack_exports__.moduleMap;
  return __webpack_exports__;
}`;

const buildContainerHost = (config)=>{
    const { name, remotes = {}, shared = {}, exposes = {} } = config;
    const remoteConfigs = Object.entries(remotes).map(([remoteAlias, remote])=>({
            type: 'esm',
            name: remoteAlias,
            entry: remote.entry,
            alias: remoteAlias
        }));
    const sharedConfig = Object.entries(shared).reduce((acc, [pkg, config])=>{
        var _config_requiredVersion;
        const version = ((_config_requiredVersion = config.requiredVersion) == null ? void 0 : _config_requiredVersion.replace(/^[^0-9]/, '')) || '';
        acc += `${JSON.stringify(pkg)}: {
      "package": "${pkg}",
      "version": "${version}",
      "scope": "default",
      "get": async () => import('federationShare/${pkg}'),
      "shareConfig": {
        "singleton": ${config.singleton},
        "requiredVersion": "${config.requiredVersion}",
        "eager": ${config.eager},
        "strictVersion": ${config.strictVersion}
      }
    },\n`;
        return acc;
    }, '{') + '}';
    let exposesConfig = Object.entries(exposes).map(([exposeName, exposePath])=>`${JSON.stringify(exposeName)}: async () => await import('${exposePath}')`).join(',\n');
    exposesConfig = `{${exposesConfig}}`;
    const injectedContent = `
    export const moduleMap = '__MODULE_MAP__';

    function appendImportMap(importMap) {
      const script = document.createElement('script');
      script.type = 'importmap-shim';
      script.innerHTML = JSON.stringify(importMap);
      document.head.appendChild(script);
    }

    export const createVirtualRemoteModule = (name, ref, exports) => {
      const genExports = exports.map(e =>
        e === 'default' ? 'export default mfLsZJ92.default' : \`export const \${e} = mfLsZJ92[\${JSON.stringify(e)}];\`
      ).join('');

      const loadRef = \`const mfLsZJ92 = await container.loadRemote(\${JSON.stringify(ref)});\`;

      return \`
        const container = __FEDERATION__.__INSTANCES__.find(container => container.name === name) || __FEDERATION__.__INSTANCES__[0];
        \${loadRef}
        \${genExports}
      \`;
    };

    function encodeInlineESM(code) {
      const encodedCode = encodeURIComponent(code);
      return \`data:text/javascript;charset=utf-8,\${encodedCode}\`;
    }

    const runtimePlugin = () => ({
        name: 'import-maps-plugin',
        async init(args) {

            const remotePrefetch = args.options.remotes.map(async (remote) => {
                if (remote.type === 'esm') {
                    await import(remote.entry);
                }
            });


            await Promise.all(remotePrefetch);

            const map = Object.keys(moduleMap).reduce((acc, expose) => {
                const importMap = importShim.getImportMap().imports;
                const key = args.origin.name + expose.replace('.', '');
                if (!importMap[key]) {
                    const encodedModule = encodeInlineESM(
                        createVirtualRemoteModule(args.origin.name, key, moduleMap[expose].exports)
                    );
                    acc[key] = encodedModule;
                }
                return acc;
            }, {});
            await importShim.addImportMap({ imports: map });

            return args;
        }
    });

    const createdContainer = await createContainer({
      name: ${JSON.stringify(name)},
      exposes: ${exposesConfig},
      remotes: ${JSON.stringify(remoteConfigs)},
      shared: ${sharedConfig},
      plugins: [runtimePlugin()],
    });

    export const get = createdContainer.get;
    export const init = createdContainer.init;
  `;
    //replace with createContainer from bundler runtime - import it in the string as a dep etc
    return [
        createContainerCode,
        injectedContent
    ].join('\n');
};
const createContainerPlugin = (config)=>({
        name: 'createContainer',
        setup (build) {
            const { filename } = config;
            const filter = new RegExp([
                filename
            ].map((name)=>`${name}$`).join('|'));
            const hasShared = Object.keys(config.shared || {}).length;
            const shared = Object.keys(config.shared || {}).map((name)=>`${name}$`).join('|');
            const sharedExternals = new RegExp(shared);
            build.onResolve({
                filter
            }, async (args)=>({
                    path: args.path,
                    namespace: 'container',
                    pluginData: {
                        kind: args.kind,
                        resolveDir: args.resolveDir
                    }
                }));
            build.onResolve({
                filter: /^federationShare/
            }, async (args)=>({
                    path: args.path.replace('federationShare/', ''),
                    namespace: 'esm-shares',
                    pluginData: {
                        kind: args.kind,
                        resolveDir: args.resolveDir
                    }
                }));
            if (hasShared) {
                build.onResolve({
                    filter: sharedExternals
                }, (args)=>{
                    if (args.namespace === 'esm-shares') return null;
                    return {
                        path: args.path,
                        namespace: 'virtual-share-module',
                        pluginData: {
                            kind: args.kind,
                            resolveDir: args.resolveDir
                        }
                    };
                });
                build.onResolve({
                    filter: /.*/,
                    namespace: 'esm-shares'
                }, async (args)=>{
                    if (sharedExternals.test(args.path)) {
                        return {
                            path: args.path,
                            namespace: 'virtual-share-module',
                            pluginData: {
                                kind: args.kind,
                                resolveDir: args.resolveDir
                            }
                        };
                    }
                    return undefined;
                });
            }
            build.onLoad({
                filter,
                namespace: 'container'
            }, async (args)=>({
                    contents: buildContainerHost(config),
                    loader: 'js',
                    resolveDir: args.pluginData.resolveDir
                }));
        }
    });

// Builds the federation host code
const buildFederationHost = (config)=>{
    const { name, remotes, shared } = config;
    const remoteConfigs = remotes ? JSON.stringify(Object.entries(remotes).map(([remoteAlias, remote])=>({
            name: remoteAlias,
            entry: remote,
            alias: remoteAlias,
            type: 'esm'
        }))) : '[]';
    const sharedConfig = Object.entries(shared != null ? shared : {}).reduce((acc, [pkg, config])=>{
        var _config_requiredVersion;
        const version = ((_config_requiredVersion = config.requiredVersion) == null ? void 0 : _config_requiredVersion.replace(/^[^0-9]/, '')) || '';
        acc += `${JSON.stringify(pkg)}: {
      "package": "${pkg}",
      "version": "${version}",
      "scope": "default",
      "get": async () => await import('federationShare/${pkg}'),
      "shareConfig": {
        "singleton": ${config.singleton},
        "requiredVersion": "${config.requiredVersion}",
        "eager": ${config.eager},
        "strictVersion": ${config.strictVersion}
      }
    },\n`;
        return acc;
    }, '{') + '}';
    return `
    import { init as initFederationHost } from "@module-federation/runtime";

    const createVirtualRemoteModule = (name, ref, exports) => {
      const genExports = exports.map(e =>
        e === 'default'
          ? 'export default mfLsZJ92.default;'
          : \`export const \${e} = mfLsZJ92[\${JSON.stringify(e)}];\`
      ).join('');

      const loadRef = \`const mfLsZJ92 = await container.loadRemote(\${JSON.stringify(ref)});\`;

      return \`
        const container = __FEDERATION__.__INSTANCES__.find(container => container.name === name) || __FEDERATION__.__INSTANCES__[0];
        \${loadRef}
        \${genExports}
      \`;
    };

    function encodeInlineESM(code) {
      return 'data:text/javascript;charset=utf-8,' + encodeURIComponent(code);
    }

    const runtimePlugin = () => ({
      name: 'import-maps-plugin',
      async init(args) {
        const remotePrefetch = args.options.remotes.map(async (remote) => {
          console.log('remote', remote);
          if (remote.type === 'esm') {
            await import(remote.entry);
          }
        });

        await Promise.all(remotePrefetch);
        if (typeof moduleMap !== 'undefined') {
          const map = Object.keys(moduleMap).reduce((acc, expose) => {
            const importMap = importShim.getImportMap().imports;
            const key = args.origin.name + expose.replace('.', '');
            if (!importMap[key]) {
              const encodedModule = encodeInlineESM(
                createVirtualRemoteModule(args.origin.name, key, moduleMap[expose].exports)
              );
              acc[key] = encodedModule;
            }
            return acc;
          }, {});

          await importShim.addImportMap({ imports: map });
        }

        return args;
      }
    });

     const mfHoZJ92 = initFederationHost({
      name: ${JSON.stringify(name)},
      remotes: ${remoteConfigs},
      shared: ${sharedConfig},
      plugins: [runtimePlugin()],
    });

    await Promise.all(mfHoZJ92.initializeSharing('default', 'version-first'));


  `;
};
const initializeHostPlugin = (config)=>({
        name: 'host-initialization',
        setup (build) {
            build.onResolve({
                filter: /federation-host/
            }, (args)=>({
                    path: args.path,
                    namespace: 'federation-host',
                    pluginData: {
                        kind: args.kind,
                        resolveDir: args.resolveDir
                    }
                }));
            build.onLoad({
                filter: /.*/,
                namespace: 'federation-host'
            }, async (args)=>({
                    contents: buildFederationHost(config),
                    resolveDir: args.pluginData.resolveDir
                }));
            // Add custom loaders
            const loaders = build.initialOptions.loader || {};
            // Apply custom loaders
            for (const [ext, loader] of Object.entries(loaders)){
                build.onLoad({
                    filter: new RegExp(`\\${ext}$`),
                    namespace: 'file'
                }, async (args)=>{
                    const contents = await fs__default.promises.readFile(args.path, 'utf8');
                    return {
                        contents: buildFederationHost(config) + contents,
                        loader
                    };
                });
            }
            // Fallback loader for files not matched by custom loaders
            const fallbackFilter = new RegExp(Object.keys(loaders).map((ext)=>`\\${ext}$`).join('|'));
            build.onLoad({
                filter: /.*\.(ts|js|mjs)$/,
                namespace: 'file'
            }, //@ts-ignore
            async (args)=>{
                if (!fallbackFilter.test(args.path)) {
                    if (!build.initialOptions.entryPoints.some((e)=>args.path.includes(e))) {
                        return;
                    }
                    const contents = await fs__default.promises.readFile(args.path, 'utf8');
                    return {
                        contents: 'import "federation-host"; \n ' + contents
                    };
                }
            });
        }
    });

// relys on import map since i dont know the named exports of a remote to return.
const createVirtualRemoteModule$1 = (name, ref)=>`
export * from ${JSON.stringify('federationRemote/' + ref)}
`;
const linkRemotesPlugin = (config)=>({
        name: 'linkRemotes',
        setup (build) {
            const remotes = config.remotes || {};
            const filter = new RegExp(Object.keys(remotes).reduce((acc, key)=>{
                if (!key) return acc;
                acc.push(`^${key}`);
                return acc;
            }, []).join('|'));
            build.onResolve({
                filter: filter
            }, async (args)=>{
                return {
                    path: args.path,
                    namespace: 'remote-module'
                };
            });
            build.onResolve({
                filter: /^federationRemote/
            }, async (args)=>{
                return {
                    path: args.path.replace('federationRemote/', ''),
                    external: true,
                    namespace: 'externals'
                };
            });
            build.onLoad({
                filter,
                namespace: 'remote-module'
            }, async (args)=>{
                return {
                    contents: createVirtualRemoteModule$1(config.name, args.path),
                    loader: 'js',
                    resolveDir: path__default.dirname(args.path)
                };
            });
        }
    });

// simplified from acorn (MIT license)
function isNewLine(code) {
    return code === 10 || code === 13 || code === 0x2028 || code === 0x2029;
}
function codePointToString(ch) {
    if (ch <= 0xffff) return String.fromCharCode(ch);
    ch -= 0x10000;
    return String.fromCharCode((ch >> 10) + 0xd800, (ch & 0x03ff) + 0xdc00);
}
class Lexer {
    readString(input, pos) {
        if (pos >= input.length) return null;
        this.input = input;
        this.pos = pos;
        const quote = this.input.charCodeAt(pos);
        if (!(quote === 34 || quote === 39)) return null;
        let out = '';
        let chunkStart = ++this.pos;
        //eslint-disable-next-line no-constant-condition
        while(true){
            if (this.pos >= this.input.length) return null;
            const ch = this.input.charCodeAt(this.pos);
            if (ch === quote) break;
            if (ch === 92) {
                out += this.input.slice(chunkStart, this.pos);
                const escaped = this.readEscapedChar();
                if (escaped === null) return null;
                out += escaped;
                chunkStart = this.pos;
            } else {
                if (isNewLine(ch)) return null;
                ++this.pos;
            }
        }
        out += this.input.slice(chunkStart, this.pos++);
        return out;
    }
    readEscapedChar() {
        const ch = this.input.charCodeAt(++this.pos);
        let code;
        ++this.pos;
        switch(ch){
            case 110:
                return '\n';
            case 114:
                return '\r';
            case 120:
                code = this.readHexChar(2);
                if (code === null) return null;
                return String.fromCharCode(code);
            case 117:
                code = this.readCodePoint();
                if (code === null) return null;
                return codePointToString(code);
            case 116:
                return '\t';
            case 98:
                return '\b';
            case 118:
                return '\u000b';
            case 102:
                return '\f';
            //@ts-ignore
            case 13:
                if (this.input.charCodeAt(this.pos) === 10) {
                    ++this.pos;
                }
            // fall through
            case 10:
                return '';
            case 56:
            case 57:
                return null;
            default:
                if (ch >= 48 && ch <= 55) {
                    const match = this.input.slice(this.pos - 1, this.pos + 2).match(/^[0-7]+/);
                    if (match === null) return null;
                    let octalStr = match[0];
                    let octal = parseInt(octalStr, 8);
                    if (octal > 255) {
                        octalStr = octalStr.slice(0, -1);
                        octal = parseInt(octalStr, 8);
                    }
                    this.pos += octalStr.length - 1;
                    const nextCh = this.input.charCodeAt(this.pos);
                    if (octalStr !== '0' || nextCh === 56 || nextCh === 57) return null;
                    return String.fromCharCode(octal);
                }
                if (isNewLine(ch)) return '';
                return String.fromCharCode(ch);
        }
    }
    readInt(radix, len) {
        const start = this.pos;
        let total = 0;
        for(let i = 0; i < len; ++i, ++this.pos){
            const code = this.input.charCodeAt(this.pos);
            let val;
            if (code >= 97) {
                val = code - 97 + 10;
            } else if (code >= 65) {
                val = code - 65 + 10;
            } else if (code >= 48 && code <= 57) {
                val = code - 48;
            } else {
                val = Infinity;
            }
            if (val >= radix) break;
            total = total * radix + val;
        }
        if (this.pos === start || len != null && this.pos - start !== len) return null;
        return total;
    }
    readHexChar(len) {
        return this.readInt(16, len);
    }
    readCodePoint() {
        const ch = this.input.charCodeAt(this.pos);
        let code;
        if (ch === 123) {
            ++this.pos;
            code = this.readHexChar(this.input.indexOf('}', this.pos) - this.pos);
            ++this.pos;
            if (code && code > 0x10ffff) return null;
        } else {
            code = this.readHexChar(4);
        }
        return code;
    }
    constructor(){
        this.input = '';
        this.pos = 0;
    }
}

function orderedUniq(array) {
    // prettier-ignore
    const ret = [], visited = new Set();
    for (const val of array)if (!visited.has(val)) visited.add(val), ret.push(val);
    return ret;
}
function cachedReduce(array, reducer, s) {
    // prettier-ignore
    const cache = [
        s
    ];
    let cacheLen = 1, last = s;
    return (len)=>{
        while(cacheLen <= len)cacheLen = cache.push(last = reducer(last, array[cacheLen - 1]));
        return cache[len];
    };
}
// from @rollup/pluginutils
const reservedWords = 'break case class catch const continue debugger default delete do else export extends finally for function if import in instanceof let new return super switch this throw try typeof var void while with yield enum await implements package protected static interface private public';
const builtin = 'arguments Infinity NaN undefined null true false eval uneval isFinite isNaN parseFloat parseInt decodeURI decodeURIComponent encodeURI encodeURIComponent escape unescape Object Function Boolean Symbol Error EvalError InternalError RangeError ReferenceError SyntaxError TypeError URIError Number Math Date String RegExp Array Int8Array Uint8Array Uint8ClampedArray Int16Array Uint16Array Int32Array Uint32Array Float32Array Float64Array Map Set WeakMap WeakSet SIMD ArrayBuffer DataView JSON Promise Generator GeneratorFunction Reflect Proxy Intl';
const forbiddenIdentifiers = new Set(`${reservedWords} ${builtin}`.split(' '));
forbiddenIdentifiers.add('');
const makeLegalIdentifier = function makeLegalIdentifier(str) {
    let identifier = str.replace(/-(\w)/g, (_, letter)=>letter.toUpperCase()).replace(/[^$_a-zA-Z0-9]/g, '_');
    if (/\d/.test(identifier[0]) || forbiddenIdentifiers.has(identifier)) {
        identifier = `_${identifier}`;
    }
    return identifier || '_';
};

function commonjs({ filter = /\.c?js$/, transform = true, transformConfig, requireReturnsDefault = true, ignore } = {}) {
    const init_cjs_module_lexer = transform ? import('cjs-module-lexer') : undefined;
    const use_default_export = typeof requireReturnsDefault === 'function' ? requireReturnsDefault : (_path)=>requireReturnsDefault;
    const is_ignored = typeof ignore === 'function' ? ignore : Array.isArray(ignore) ? (path)=>ignore.includes(path) : ()=>false;
    return {
        name: 'commonjs',
        setup ({ onLoad, esbuild, initialOptions }) {
            let esbuild_shim;
            const require_esbuild = ()=>esbuild || esbuild_shim || (esbuild_shim = require('esbuild'));
            const read = promises.readFile;
            const lexer = new Lexer();
            //@ts-ignore
            onLoad({
                filter: filter
            }, async (args)=>{
                let parseCJS;
                if (init_cjs_module_lexer) {
                    const { init, parse } = await init_cjs_module_lexer;
                    await init();
                    parseCJS = parse;
                }
                let contents;
                try {
                    //@ts-ignore
                    contents = await read(args.path, 'utf8');
                } catch (e) {
                    return null;
                }
                const willTransform = transform === true || typeof transform === 'function' && transform(args.path);
                let cjsExports;
                try {
                    if (parseCJS && willTransform) {
                        // move sourcemap to the end of the transformed file
                        const sourcemapIndex = contents.lastIndexOf('//# sourceMappingURL=');
                        let sourcemap;
                        if (sourcemapIndex !== -1) {
                            sourcemap = contents.slice(sourcemapIndex);
                            const sourcemapEnd = sourcemap.indexOf('\n');
                            if (sourcemapEnd !== -1 && sourcemap.slice(sourcemapEnd + 1).trimStart().length > 0) {
                                // if there's code after sourcemap, it is invalid, don't do this.
                                sourcemap = undefined;
                            } else {
                                contents = contents.slice(0, sourcemapIndex);
                            }
                        }
                        // transform commonjs to es modules, easy mode
                        cjsExports = parseCJS(contents);
                        let { behavior, exports, sideEffects } = typeof willTransform === 'object' ? willTransform : {};
                        var _transformConfig_behavior;
                        behavior != null ? behavior : behavior = (_transformConfig_behavior = transformConfig == null ? void 0 : transformConfig.behavior) != null ? _transformConfig_behavior : 'node';
                        exports = orderedUniq(cjsExports.exports.concat(exports != null ? exports : []));
                        var _transformConfig_sideEffects;
                        sideEffects != null ? sideEffects : sideEffects = (_transformConfig_sideEffects = transformConfig == null ? void 0 : transformConfig.sideEffects) != null ? _transformConfig_sideEffects : true;
                        let exportDefault = behavior === 'node' ? 'export default exports;' : 'export default exports.__esModule ? exports.default : exports;';
                        let exportsMap = exports.map((e)=>[
                                e,
                                makeLegalIdentifier(e)
                            ]);
                        if (exportsMap.some(([e])=>e === 'default')) {
                            if (behavior === 'node') {
                                exportsMap = exportsMap.filter(([e])=>e !== 'default');
                            } else {
                                exportDefault = '';
                            }
                        }
                        const reexports = cjsExports.reexports.map((e)=>`export * from ${JSON.stringify(e)};`).join('');
                        let transformed;
                        if (sideEffects === false) {
                            transformed = [
                                // make sure we don't manipulate the first line so that sourcemap is fine
                                reexports + 'var mod, exports = /* @__PURE__ */ ((exports, module) => {' + contents,
                                'return module.exports})((mod = { exports: {} }).exports, mod); ' + exportDefault
                            ];
                            if (exportsMap.length > 0) {
                                for (const [e, name] of exportsMap){
                                    transformed.push(`var ${name} = /* @__PURE__ */ (() => exports[${JSON.stringify(e)}])();`);
                                }
                                transformed.push(`export { ${exportsMap.map(([e, name])=>e === name ? e : `${name} as ${JSON.stringify(e)}`).join(', ')} };`);
                            }
                        } else {
                            transformed = [
                                reexports + 'var exports = {}, module = { exports }; {' + contents,
                                '}; exports = module.exports; ' + exportDefault
                            ];
                            if (exportsMap.length > 0) {
                                transformed.push(`var { ${exportsMap.map(([e, name])=>e === name ? e : `${JSON.stringify(e)}: ${name}`).join(', ')} } = exports;`, `export { ${exportsMap.map(([e, name])=>e === name ? e : `${name} as ${JSON.stringify(e)}`).join(', ')} };`);
                            }
                        }
                        contents = transformed.join('\n') + (sourcemap ? '\n' + sourcemap : '');
                    }
                } catch (e) {
                    return null;
                }
                function makeName(path) {
                    let name = `__import_${makeLegalIdentifier(path)}`;
                    if (contents.includes(name)) {
                        let suffix = 2;
                        while(contents.includes(`${name}${suffix}`))suffix++;
                        name = `${name}${suffix}`;
                    }
                    return name;
                }
                let warnings;
                try {
                    ({ warnings } = await require_esbuild().transform(contents, {
                        format: 'esm',
                        logLevel: 'silent'
                    }));
                } catch (err) {
                    ({ warnings } = err);
                }
                const lines = contents.split('\n');
                const getOffset = cachedReduce(lines, (a, b)=>a + 1 + b.length, 0);
                if (warnings && (warnings = warnings.filter((e)=>e.text.includes('"require" to "esm"'))).length) {
                    const edits = [];
                    let imports = [];
                    for (const { location } of warnings){
                        if (location === null) continue;
                        const { line, lineText, column, length } = location;
                        const leftBrace = column + length + 1;
                        const path = lexer.readString(lineText, leftBrace);
                        if (path === null || is_ignored(path)) continue;
                        const rightBrace = lineText.indexOf(')', leftBrace + 2 + path.length) + 1;
                        const name = makeName(path);
                        let import_statement;
                        if (use_default_export(path)) {
                            import_statement = `import ${name} from ${JSON.stringify(path)};`;
                        } else {
                            import_statement = `import * as ${name} from ${JSON.stringify(path)};`;
                        }
                        const offset = getOffset(line - 1);
                        edits.push([
                            offset + column,
                            offset + rightBrace,
                            name
                        ]);
                        imports.push(import_statement);
                    }
                    if (imports.length === 0) return null;
                    imports = orderedUniq(imports);
                    let offset = 0;
                    for (const [start, end, name] of edits){
                        contents = contents.slice(0, start + offset) + name + contents.slice(end + offset);
                        offset += name.length - (end - start);
                    }
                    // if we have transformed this module (i.e. having `cjsExports`), don't make the file commonjs
                    contents = [
                        ...imports,
                        cjsExports ? 'exports;' : '',
                        contents
                    ].join('');
                    return {
                        contents
                    };
                }
            });
        }
    };
}

function _extends() {
    _extends = Object.assign || function(target) {
        for(var i = 1; i < arguments.length; i++){
            var source = arguments[i];
            for(var key in source){
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }
        return target;
    };
    return _extends.apply(this, arguments);
}
// Creates a virtual module for sharing dependencies
const createVirtualShareModule = (name, ref, exports)=>`
  const container = __FEDERATION__.__INSTANCES__.find(container => container.name === ${JSON.stringify(name)}) || __FEDERATION__.__INSTANCES__[0]

  const mfLsZJ92 = await container.loadShare(${JSON.stringify(ref)})

  ${exports.map((e)=>e === 'default' ? `export default mfLsZJ92.default` : `export const ${e} = mfLsZJ92[${JSON.stringify(e)}];`).join('\n')}
`;
const createVirtualRemoteModule = (name, ref)=>`
export * from ${JSON.stringify('federationRemote/' + ref)}
`;
// Plugin to transform CommonJS modules to ESM
const cjsToEsmPlugin = {
    name: 'cjs-to-esm',
    setup (build) {
        build.onLoad({
            filter: /.*/,
            namespace: 'esm-shares'
        }, async (args)=>{
            var _build_initialOptions_external;
            let esbuild_shim;
            const require_esbuild = ()=>build.esbuild || esbuild_shim || (esbuild_shim = require('esbuild'));
            const packageBuilder = await require_esbuild().build(_extends({}, build.initialOptions, {
                external: (_build_initialOptions_external = build.initialOptions.external) == null ? void 0 : _build_initialOptions_external.filter((e)=>{
                    if (e.includes('*')) {
                        const prefix = e.split('*')[0];
                        return !args.path.startsWith(prefix);
                    }
                    return e !== args.path;
                }),
                entryPoints: [
                    args.path
                ],
                plugins: [
                    commonjs({
                        filter: /.*/
                    })
                ],
                write: false
            }));
            return {
                contents: packageBuilder.outputFiles[0].text,
                loader: 'js',
                resolveDir: args.pluginData.resolveDir
            };
        });
    }
};
// Plugin to link shared dependencies
const linkSharedPlugin = (config)=>({
        name: 'linkShared',
        setup (build) {
            const filter = new RegExp(Object.keys(config.shared || {}).map((name)=>`${name}$`).join('|'));
            build.onResolve({
                filter
            }, (args)=>{
                if (args.namespace === 'esm-shares') return null;
                return {
                    path: args.path,
                    namespace: 'virtual-share-module',
                    pluginData: {
                        kind: args.kind,
                        resolveDir: args.resolveDir
                    }
                };
            });
            build.onResolve({
                filter: /.*/,
                namespace: 'esm-shares'
            }, (args)=>{
                if (filter.test(args.path)) {
                    return {
                        path: args.path,
                        namespace: 'virtual-share-module',
                        pluginData: {
                            kind: args.kind,
                            resolveDir: args.resolveDir
                        }
                    };
                }
                if (filter.test(args.importer)) {
                    return {
                        path: args.path,
                        namespace: 'esm-shares',
                        pluginData: {
                            kind: args.kind,
                            resolveDir: args.resolveDir
                        }
                    };
                }
                return undefined;
            });
            build.onResolve({
                filter: /^federationShare/
            }, async (args)=>({
                    path: args.path.replace('federationShare/', ''),
                    namespace: 'esm-shares',
                    pluginData: {
                        kind: args.kind,
                        resolveDir: args.resolveDir
                    }
                }));
            build.onLoad({
                filter,
                namespace: 'virtual-share-module'
            }, async (args)=>{
                const exp = await getExports(args.path);
                return {
                    contents: createVirtualShareModule(config.name, args.path, exp),
                    loader: 'js',
                    resolveDir: path__default.dirname(args.path)
                };
            });
        }
    });
// Main module federation plugin
const moduleFederationPlugin = (config)=>({
        name: 'module-federation',
        setup (build) {
            build.initialOptions.metafile = true;
            const externals = getExternals(config);
            if (build.initialOptions.external) {
                build.initialOptions.external = [
                    ...new Set([
                        ...build.initialOptions.external,
                        ...externals
                    ])
                ];
            } else {
                build.initialOptions.external = externals;
            }
            const pluginStack = [];
            const remotes = Object.keys(config.remotes || {}).length;
            const shared = Object.keys(config.shared || {}).length;
            const exposes = Object.keys(config.exposes || {}).length;
            const entryPoints = build.initialOptions.entryPoints;
            const filename = config.filename || 'remoteEntry.js';
            if (remotes) {
                pluginStack.push(linkRemotesPlugin(config));
            }
            if (shared) {
                pluginStack.push(linkSharedPlugin(config));
            }
            if (!entryPoints) {
                build.initialOptions.entryPoints = [];
            }
            if (exposes) {
                if (Array.isArray(entryPoints)) {
                    entryPoints.push(filename);
                } else if (entryPoints && typeof entryPoints === 'object') {
                    entryPoints[filename] = filename;
                } else {
                    build.initialOptions.entryPoints = [
                        filename
                    ];
                }
            }
            [
                initializeHostPlugin(config),
                createContainerPlugin(config),
                cjsToEsmPlugin,
                ...pluginStack
            ].forEach((plugin)=>plugin.setup(build));
            build.onEnd(async (result)=>{
                if (!result.metafile) return;
                if (exposes) {
                    const exposedConfig = config.exposes || {};
                    const remoteFile = config.filename;
                    const exposedEntries = {};
                    const outputMapWithoutExt = Object.entries(result.metafile.outputs).reduce((acc, [chunkKey, chunkValue])=>{
                        //@ts-ignore
                        const { entryPoint } = chunkValue;
                        const key = entryPoint || chunkKey;
                        const trimKey = key.substring(0, key.lastIndexOf('.')) || key;
                        //@ts-ignore
                        acc[trimKey] = _extends({}, chunkValue, {
                            chunk: chunkKey
                        });
                        return acc;
                    }, {});
                    for (const [expose, value] of Object.entries(exposedConfig)){
                        const exposedFound = //@ts-ignore
                        outputMapWithoutExt[value.replace('./', '')] || //@ts-ignore
                        outputMapWithoutExt[expose.replace('./', '')];
                        if (exposedFound) {
                            exposedEntries[expose] = {
                                entryPoint: exposedFound.entryPoint,
                                exports: exposedFound.exports
                            };
                        }
                    }
                    for (const [outputPath, value] of Object.entries(result.metafile.outputs)){
                        if (!value.entryPoint) continue;
                        if (!value.entryPoint.startsWith('container:')) continue;
                        if (!value.entryPoint.endsWith(remoteFile)) continue;
                        const container = fs__default.readFileSync(outputPath, 'utf-8');
                        const withExports = container.replace('"__MODULE_MAP__"', `${JSON.stringify(exposedEntries)}`).replace("'__MODULE_MAP__'", `${JSON.stringify(exposedEntries)}`);
                        fs__default.writeFileSync(outputPath, withExports, 'utf-8');
                    }
                }
                await writeRemoteManifest(config, result);
                console.log(`build ended with ${result.errors.length} errors`);
            });
        }
    });

export { createVirtualRemoteModule, createVirtualShareModule, moduleFederationPlugin };
