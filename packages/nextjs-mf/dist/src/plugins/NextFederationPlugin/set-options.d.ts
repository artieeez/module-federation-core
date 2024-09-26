import { NextFederationPluginExtraOptions, NextFederationPluginOptions } from '@module-federation/utilities';
import type { moduleFederationPlugin } from '@module-federation/sdk';
/**
 * This function sets the main and extra options for NextFederationPlugin. It splits the options object into
 * the main options and extra options, and sets default values for any options that are not defined.
 *
 * @param {NextFederationPluginOptions} options - The options for NextFederationPlugin.
 * @returns {Object} An object containing the main options and extra options.
 *
 * @remarks
 * The default extra options are:
 * - automaticPageStitching: false
 * - enableImageLoaderFix: false
 * - enableUrlLoaderFix: false
 * - skipSharingNextInternals: false
 * - debug: false
 */
export declare function setOptions(options: NextFederationPluginOptions): {
    mainOptions: moduleFederationPlugin.ModuleFederationPluginOptions;
    extraOptions: NextFederationPluginExtraOptions;
};
