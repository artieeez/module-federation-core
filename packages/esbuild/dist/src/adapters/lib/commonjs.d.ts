import type { Plugin } from 'esbuild';
export interface CommonJSOptions {
    /**
     * The regexp passed to onLoad() to match commonjs files.
     *
     * @default /\.c?js$/
     */
    filter?: RegExp;
    /**
     * _Experimental_: Transform commonjs to es modules. You have to install
     * `cjs-module-lexer` to let it work.
     *
     * When `true`, the plugin tries to wrap the commonjs module into:
     *
     * ```js
     * var exports = {}, module = { exports };
     * {
     *   // ... original content ...
     * }
     * exports = module.exports;
     * // the exported names are extracted by cjs-module-lexer
     * export default exports;
     * var { something, "a-b" as a_b } = exports;
     * export { something, a_b as "a-b" };
     * ```
     *
     * @default false
     */
    transform?: boolean | ((path: string) => boolean | TransformConfig | null | void);
    /**
     * _Experimental_: This options acts as a fallback of the `transform` option above.
     */
    transformConfig?: Pick<TransformConfig, 'behavior' | 'sideEffects'>;
    /**
     * Controls which style of import should be used. By default, it transforms:
     *
     * ```js
     * // input
     * const foo = require("foo")
     * // output
     * import foo from "foo"
     * ```
     *
     * The above case is often correct when 'foo' is also a commonjs module.
     * But if 'foo' has es module exports, it is better to use:
     *
     * ```js
     * // output
     * import * as foo from "foo"
     * ```
     *
     * In which case you can set `requireReturnsDefault` to `false` to get the above output.
     * Or use the callback style to control the behavior for each module.
     *
     * @default true
     */
    requireReturnsDefault?: boolean | ((path: string) => boolean);
    /**
     * Don't replace require("ignored-modules"). Note that this will cause
     * esbuild generates the __require() wrapper which throw error at runtime.
     */
    ignore?: string[] | ((path: string) => boolean);
}
export interface TransformConfig {
    /**
     * If `"babel"`, it will check if there be `exports.__esModule`,
     * then export `exports.default`. i.e. The wrapper code becomes:
     *
     * ```js
     * export default exports.__esModule ? exports.default : exports;
     * ```
     *
     * @default "node"
     */
    behavior?: 'babel' | 'node';
    /**
     * Also include these named exports if they aren't recognized automatically.
     *
     * @example ["something"]
     */
    exports?: string[];
    /**
     * If `false`, slightly change the result to make it side-effect free.
     * But it doesn't actually remove many code. So you maybe not need this.
     *
     * ```js
     * var mod;
     * var exports = /\*#__PURE__*\/ ((exports, module) => {
     *   // ... original content ...
     *   return module.exports;
     * })((mod = { exports: {} }).exports, mod);
     * export default exports;
     * var a_b = /\*#__PURE__*\/ (() => exports['a-b'])();
     * var something = /\*#__PURE__*\/ (() => exports.something)();
     * export { a_b as "a-b", something };
     * ```
     */
    sideEffects?: boolean;
}
export declare function commonjs({ filter, transform, transformConfig, requireReturnsDefault, ignore, }?: CommonJSOptions): Plugin;
export default commonjs;
