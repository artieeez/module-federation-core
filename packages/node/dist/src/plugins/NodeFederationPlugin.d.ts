import type { Compiler, container } from 'webpack';
import type { ModuleFederationPluginOptions } from '../types';
/**
 * Interface for NodeFederationOptions which extends ModuleFederationPluginOptions
 * @interface
 * @property {boolean} debug - Optional debug flag
 */
interface NodeFederationOptions extends ModuleFederationPluginOptions {
    debug?: boolean;
    useRuntimePlugin?: boolean;
}
/**
 * Interface for Context
 * @interface
 * @property {typeof container.ModuleFederationPlugin} ModuleFederationPlugin - Optional ModuleFederationPlugin
 */
interface Context {
    ModuleFederationPlugin?: typeof container.ModuleFederationPlugin;
}
/**
 * Class representing a NodeFederationPlugin.
 * @class
 */
declare class NodeFederationPlugin {
    private _options;
    private context;
    private useRuntimePlugin?;
    /**
     * Create a NodeFederationPlugin.
     * @constructor
     * @param {NodeFederationOptions} options - The options for the NodeFederationPlugin
     * @param {Context} context - The context for the NodeFederationPlugin
     */
    constructor({ debug, useRuntimePlugin, ...options }: NodeFederationOptions, context: Context);
    /**
     * Apply method for the NodeFederationPlugin class.
     * @method
     * @param {Compiler} compiler - The webpack compiler.
     */
    apply(compiler: Compiler): void;
    private preparePluginOptions;
    private updateCompilerOptions;
    private getModuleFederationPlugin;
}
export default NodeFederationPlugin;
