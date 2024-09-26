'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var getExternals = require('./get-externals.cjs.js');
var path = require('path');
var fs = require('fs');
var process = require('process');
var npmlog = require('npmlog');
require('json5');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
  if (e && e.__esModule) return e;
  var n = Object.create(null);
  if (e) {
    Object.keys(e).forEach(function (k) {
      if (k !== 'default') {
        var d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: function () { return e[k]; }
        });
      }
    });
  }
  n["default"] = e;
  return Object.freeze(n);
}

var path__namespace = /*#__PURE__*/_interopNamespace(path);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var process__default = /*#__PURE__*/_interopDefaultLegacy(process);
var npmlog__default = /*#__PURE__*/_interopDefaultLegacy(npmlog);

async function loadFederationConfig(fedOptions) {
    const fullConfigPath = path__namespace.join(fedOptions.workspaceRoot, fedOptions.federationConfig);
    if (!fs__namespace.existsSync(fullConfigPath)) {
        throw new Error('Expected ' + fullConfigPath);
    }
    const config = await (function (t) { return Promise.resolve().then(function () { return /*#__PURE__*/_interopNamespace(require(t)); }); })(`${fullConfigPath}`);
    return config;
}

const DEFAULT_SKIP_LIST = [
    '@module-federation/native-federation-runtime',
    '@module-federation/native-federation',
    '@module-federation/native-federation-core',
    '@module-federation/native-federation-esbuild',
    '@angular-architects/native-federation',
    '@angular-architects/native-federation-runtime',
    'es-module-shims',
    'zone.js',
    'tslib/',
    '@angular/localize',
    '@angular/localize/init',
    '@angular/localize/tools',
    '@angular/platform-server',
    '@angular/platform-server/init',
    '@angular/ssr',
    'express',
    /\/schematics(\/|$)/,
    /^@nx\/angular/,
    (pkg)=>pkg.startsWith('@angular/') && !!pkg.match(/\/testing(\/|$)/),
    (pkg)=>pkg.startsWith('@types/'),
    (pkg)=>pkg.startsWith('@module-federation/')
];
const PREPARED_DEFAULT_SKIP_LIST = prepareSkipList(DEFAULT_SKIP_LIST);
function prepareSkipList(skipList) {
    return {
        strings: new Set(skipList.filter((e)=>typeof e === 'string')),
        functions: skipList.filter((e)=>typeof e === 'function'),
        regexps: skipList.filter((e)=>e instanceof RegExp)
    };
}
function isInSkipList(entry, skipList) {
    if (skipList.strings.has(entry)) {
        return true;
    }
    if (skipList.functions.some((f)=>f(entry))) {
        return true;
    }
    if (skipList.regexps.some((r)=>r.test(entry))) {
        return true;
    }
    return false;
}

let _context = {};
function getConfigContext() {
    return _context;
}

/* eslint-disable @typescript-eslint/no-explicit-any */ //@ts-ignore
const levels = npmlog__default["default"].levels;
npmlog__default["default"].addLevel('error', levels.error, {
    fg: 'brightWhite',
    bg: 'red'
}, ' ERR! ');
npmlog__default["default"].addLevel('warn', levels.info, {
    fg: 'brightWhite',
    bg: 'yellow'
}, ' WARN ');
npmlog__default["default"].addLevel('info', levels.warn, {
    fg: 'brightWhite',
    bg: 'green'
}, ' INFO ');
npmlog__default["default"].addLevel('notice', levels.notice, {
    fg: 'black',
    bg: 'brightYellow'
}, ' NOTE ');
npmlog__default["default"].addLevel('verbose', levels.verbose, {
    fg: 'brightWhite',
    bg: 'brightBlue'
}, ' VRB! ');
npmlog__default["default"].addLevel('silly', levels.silly, {
    fg: 'black',
    bg: 'white'
}, ' DBG! ');
const logger = {
    error: (msg)=>npmlog__default["default"].error('', msg),
    warn: (msg)=>npmlog__default["default"].warn('', msg),
    notice: (msg)=>npmlog__default["default"].notice('', msg),
    info: (msg)=>npmlog__default["default"].info('', msg),
    verbose: (msg)=>npmlog__default["default"].verbose('', msg),
    debug: (msg)=>npmlog__default["default"].silly('', msg)
};
const setLogLevel = (level)=>{
    npmlog__default["default"].level = level === 'debug' ? 'silly' : level;
};
setLogLevel('info');

function normalize(path, trailingSlash) {
    let cand = path.replace(/\\/g, '/');
    if (typeof trailingSlash === 'undefined') {
        return cand;
    }
    while(cand.endsWith('/')){
        cand = cand.substring(0, cand.length - 1);
    }
    if (trailingSlash) {
        return cand + '/';
    }
    return cand;
}

function _extends$2() {
    _extends$2 = Object.assign || function(target) {
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
    return _extends$2.apply(this, arguments);
}
const packageCache = {};
function findPackageJsonFiles(project, workspace) {
    return expandFolders(project, workspace).map((f)=>path__namespace.join(f, 'package.json')).filter((f)=>fs__namespace.existsSync(f));
}
function expandFolders(child, parent) {
    const result = [];
    parent = normalize(parent, true);
    child = normalize(child, true);
    if (!child.startsWith(parent)) {
        throw new Error(`Workspace folder ${parent} needs to be a parent of the project folder ${child}`);
    }
    let current = child;
    while(current !== parent){
        result.push(current);
        const cand = normalize(path__namespace.dirname(current), true);
        if (cand === current) {
            break;
        }
        current = cand;
    }
    result.push(parent);
    return result;
}
function getVersionMapCacheKey(project, workspace) {
    return `${project}**${workspace}`;
}
function getVersionMaps(project, workspace) {
    return getPackageJsonFiles(project, workspace).map((json)=>_extends$2({}, json.content['dependencies']));
}
function getPackageJsonFiles(project, workspace) {
    const cacheKey = getVersionMapCacheKey(project, workspace);
    let maps = packageCache[cacheKey];
    if (maps) {
        return maps;
    }
    maps = findPackageJsonFiles(project, workspace).map((f)=>{
        const content = JSON.parse(fs__namespace.readFileSync(f, 'utf-8'));
        const directory = normalize(path__namespace.dirname(f), true);
        const result = {
            content,
            directory
        };
        return result;
    });
    packageCache[cacheKey] = maps;
    return maps;
}
function findDepPackageJson(packageName, projectRoot) {
    const mainPkgName = getPkgFolder(packageName);
    let mainPkgPath = path__namespace.join(projectRoot, 'node_modules', mainPkgName);
    let mainPkgJsonPath = path__namespace.join(mainPkgPath, 'package.json');
    let directory = projectRoot;
    while(path__namespace.dirname(directory) !== directory){
        if (fs__namespace.existsSync(mainPkgJsonPath)) {
            break;
        }
        directory = normalize(path__namespace.dirname(directory), true);
        mainPkgPath = path__namespace.join(directory, 'node_modules', mainPkgName);
        mainPkgJsonPath = path__namespace.join(mainPkgPath, 'package.json');
    }
    if (!fs__namespace.existsSync(mainPkgJsonPath)) {
        logger.verbose('No package.json found for ' + packageName + ' in ' + mainPkgPath);
        return null;
    }
    return mainPkgJsonPath;
}
function getPkgFolder(packageName) {
    const parts = packageName.split('/');
    let folder = parts[0];
    if (folder.startsWith('@')) {
        folder += '/' + parts[1];
    }
    return folder;
}

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
let inferVersion = false;
const DEFAULT_SECONARIES_SKIP_LIST = [
    '@angular/router/upgrade',
    '@angular/common/upgrade'
];
function findRootTsConfigJson() {
    const packageJson = findPackageJson(process__default["default"].cwd());
    const projectRoot = path__default["default"].dirname(packageJson);
    const tsConfigBaseJson = path__default["default"].join(projectRoot, 'tsconfig.base.json');
    const tsConfigJson = path__default["default"].join(projectRoot, 'tsconfig.json');
    if (fs__default["default"].existsSync(tsConfigBaseJson)) {
        return tsConfigBaseJson;
    } else if (fs__default["default"].existsSync(tsConfigJson)) {
        return tsConfigJson;
    }
    throw new Error('Neither a tsconfig.json nor a tsconfig.base.json was found');
}
function findPackageJson(folder) {
    while(!fs__default["default"].existsSync(path__default["default"].join(folder, 'package.json')) && path__default["default"].dirname(folder) !== folder){
        folder = path__default["default"].dirname(folder);
    }
    const filePath = path__default["default"].join(folder, 'package.json');
    if (fs__default["default"].existsSync(filePath)) {
        return filePath;
    }
    throw new Error(`No package.json found. Searched the following folder and all parents: ${folder}`);
}
function lookupVersion(key, workspaceRoot) {
    const versionMaps = getVersionMaps(workspaceRoot, workspaceRoot);
    for (const versionMap of versionMaps){
        const version = lookupVersionInMap(key, versionMap);
        if (version) {
            return version;
        }
    }
    throw new Error(`Shared Dependency ${key} has requiredVersion:'auto'. However, this dependency is not found in your package.json`);
}
function lookupVersionInMap(key, versions) {
    const parts = key.split('/');
    if (parts.length >= 2 && parts[0].startsWith('@')) {
        key = `${parts[0]}/${parts[1]}`;
    } else {
        key = parts[0];
    }
    if (key.toLowerCase() === '@angular-architects/module-federation-runtime') {
        key = '@angular-architects/module-federation';
    }
    return versions[key] || null;
}
function _findSecondaries(libPath, excludes, shareObject, acc) {
    const files = fs__default["default"].readdirSync(libPath);
    const dirs = files.map((f)=>path__default["default"].join(libPath, f)).filter((f)=>fs__default["default"].lstatSync(f).isDirectory() && f !== 'node_modules');
    const secondaries = dirs.filter((d)=>fs__default["default"].existsSync(path__default["default"].join(d, 'package.json')));
    for (const s of secondaries){
        const secondaryLibName = s.replace(/\\/g, '/').replace(/^.*node_modules[/]/, '');
        if (excludes.includes(secondaryLibName)) {
            continue;
        }
        if (isInSkipList(secondaryLibName, PREPARED_DEFAULT_SKIP_LIST)) {
            continue;
        }
        acc[secondaryLibName] = _extends$1({}, shareObject);
        _findSecondaries(s, excludes, shareObject, acc);
    }
}
function findSecondaries(libPath, excludes, shareObject) {
    const acc = {};
    _findSecondaries(libPath, excludes, shareObject, acc);
    return acc;
}
function getSecondaries(includeSecondaries, libPath, key, shareObject) {
    let exclude = [
        ...DEFAULT_SECONARIES_SKIP_LIST
    ];
    if (typeof includeSecondaries === 'object') {
        if (Array.isArray(includeSecondaries.skip)) {
            exclude = includeSecondaries.skip;
        } else if (typeof includeSecondaries.skip === 'string') {
            exclude = [
                includeSecondaries.skip
            ];
        }
    }
    if (!fs__default["default"].existsSync(libPath)) {
        return {};
    }
    const configured = readConfiguredSecondaries(key, libPath, exclude, shareObject);
    if (configured) {
        return configured;
    }
    // Fallback: Search folders
    return findSecondaries(libPath, exclude, shareObject);
}
function readConfiguredSecondaries(parent, libPath, exclude, shareObject) {
    const libPackageJson = path__default["default"].join(libPath, 'package.json');
    if (!fs__default["default"].existsSync(libPackageJson)) {
        return null;
    }
    const packageJson = JSON.parse(fs__default["default"].readFileSync(libPackageJson, 'utf-8'));
    const exports = packageJson['exports'];
    if (!exports) {
        return null;
    }
    const keys = Object.keys(exports).filter((key)=>key !== '.' && key !== './package.json' && !key.endsWith('*') && (exports[key]['default'] || typeof exports[key] === 'string'));
    const result = {};
    for (const key of keys){
        const secondaryName = path__default["default"].join(parent, key).replace(/\\/g, '/');
        if (exclude.includes(secondaryName)) {
            continue;
        }
        if (isInSkipList(secondaryName, PREPARED_DEFAULT_SKIP_LIST)) {
            continue;
        }
        const entry = getDefaultEntry(exports, key);
        if (typeof entry !== 'string') {
            console.log(`No entry point found for ${secondaryName}`);
            continue;
        }
        if ([
            '.css',
            '.scss',
            '.less'
        ].some((ext)=>entry.endsWith(ext))) {
            continue;
        }
        result[secondaryName] = _extends$1({}, shareObject);
    }
    return result;
}
function getDefaultEntry(exports, key) {
    let entry;
    if (typeof exports[key] === 'string') {
        entry = exports[key];
    } else {
        var _exports_key;
        entry = (_exports_key = exports[key]) == null ? void 0 : _exports_key['default'];
        if (typeof entry === 'object') {
            entry = entry['default'];
        }
    }
    return entry;
}
function shareAll(config, skip = DEFAULT_SKIP_LIST, projectPath = '') {
    projectPath = inferProjectPath(projectPath);
    const versionMaps = getVersionMaps(projectPath, projectPath);
    const shareConfig = {};
    for (const versions of versionMaps){
        const preparedSkipList = prepareSkipList(skip);
        for(const key in versions){
            if (isInSkipList(key, preparedSkipList)) {
                continue;
            }
            const inferVersion = !config.requiredVersion || config.requiredVersion === 'auto';
            const requiredVersion = inferVersion ? versions[key] : config.requiredVersion;
            if (!shareConfig[key]) {
                shareConfig[key] = _extends$1({}, config, {
                    requiredVersion
                });
            }
        }
    }
    return share(share, projectPath);
}
function inferProjectPath(projectPath) {
    if (!projectPath) {
        projectPath = path__default["default"].dirname(getConfigContext().packageJson || '');
    }
    if (!projectPath && getConfigContext().workspaceRoot) {
        projectPath = getConfigContext().workspaceRoot || '';
    }
    if (!projectPath) {
        projectPath = process__default["default"].cwd();
    }
    return projectPath;
}
function setInferVersion(infer) {
    inferVersion = infer;
}
function share(shareObjects, projectPath = '') {
    projectPath = inferProjectPath(projectPath);
    const packagePath = findPackageJson(projectPath);
    const result = {};
    let includeSecondaries;
    for(const key in shareObjects){
        includeSecondaries = false;
        const shareObject = shareObjects[key];
        if (shareObject.requiredVersion === 'auto' || inferVersion && typeof shareObject.requiredVersion === 'undefined') {
            const version = lookupVersion(key, projectPath);
            shareObject.requiredVersion = version;
            shareObject.version = version.replace(/^\D*/, '');
        }
        if (typeof shareObject.includeSecondaries === 'undefined') {
            shareObject.includeSecondaries = true;
        }
        if (shareObject.includeSecondaries) {
            includeSecondaries = shareObject.includeSecondaries;
            delete shareObject.includeSecondaries;
        }
        result[key] = shareObject;
        if (includeSecondaries) {
            const libPackageJson = findDepPackageJson(key, path__default["default"].dirname(packagePath));
            if (!libPackageJson) {
                logger.error(`Could not find folder containing dep ${key}`);
                continue;
            }
            const libPath = path__default["default"].dirname(libPackageJson);
            const secondaries = getSecondaries(includeSecondaries, libPath, key, shareObject);
            if (secondaries) {
                addSecondaries(secondaries, result);
            }
        }
    }
    return result;
}
function addSecondaries(secondaries, result) {
    Object.assign(result, secondaries);
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
function withFederation(config) {
    var _config_skip;
    const skip = prepareSkipList((_config_skip = config.skip) != null ? _config_skip : []);
    var _config_name, _config_filename, _config_exposes, _config_remotes;
    return {
        name: (_config_name = config.name) != null ? _config_name : '',
        filename: (_config_filename = config.filename) != null ? _config_filename : 'remoteEntry',
        exposes: (_config_exposes = config.exposes) != null ? _config_exposes : {},
        remotes: (_config_remotes = config.remotes) != null ? _config_remotes : {},
        shared: normalizeShared(config, skip)
    };
}
function normalizeShared(config, skip) {
    let result = {};
    const shared = config.shared;
    if (!shared) {
        result = shareAll({
            singleton: true,
            strictVersion: true,
            requiredVersion: 'auto'
        });
    } else {
        result = Object.keys(shared).reduce((acc, cur)=>{
            var _shared_cur_requiredVersion, _shared_cur_singleton, _shared_cur_strictVersion;
            return _extends({}, acc, {
                [cur]: {
                    requiredVersion: (_shared_cur_requiredVersion = shared[cur].requiredVersion) != null ? _shared_cur_requiredVersion : 'auto',
                    singleton: (_shared_cur_singleton = shared[cur].singleton) != null ? _shared_cur_singleton : false,
                    strictVersion: (_shared_cur_strictVersion = shared[cur].strictVersion) != null ? _shared_cur_strictVersion : false,
                    version: shared[cur].version,
                    includeSecondaries: shared[cur].includeSecondaries
                }
            });
        }, {});
    }
    result = Object.keys(result).filter((key)=>!isInSkipList(key, skip)).reduce((acc, cur)=>_extends({}, acc, {
            [cur]: result[cur]
        }), {});
    return result;
}

exports.getExternals = getExternals.getExternals;
exports.DEFAULT_SECONARIES_SKIP_LIST = DEFAULT_SECONARIES_SKIP_LIST;
exports._findSecondaries = _findSecondaries;
exports.addSecondaries = addSecondaries;
exports.findPackageJson = findPackageJson;
exports.findRootTsConfigJson = findRootTsConfigJson;
exports.findSecondaries = findSecondaries;
exports.getDefaultEntry = getDefaultEntry;
exports.getSecondaries = getSecondaries;
exports.loadFederationConfig = loadFederationConfig;
exports.logger = logger;
exports.lookupVersion = lookupVersion;
exports.lookupVersionInMap = lookupVersionInMap;
exports.readConfiguredSecondaries = readConfiguredSecondaries;
exports.setInferVersion = setInferVersion;
exports.setLogLevel = setLogLevel;
exports.share = share;
exports.shareAll = shareAll;
exports.withFederation = withFederation;
