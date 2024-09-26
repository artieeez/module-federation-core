"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setOptions = setOptions;
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
function setOptions(options) {
    const { extraOptions, ...mainOpts } = options;
    /**
     * Default extra options for NextFederationPlugin.
     * @type {NextFederationPluginExtraOptions}
     */
    const defaultExtraOptions = {
        automaticPageStitching: false,
        enableImageLoaderFix: false,
        enableUrlLoaderFix: false,
        skipSharingNextInternals: false,
        debug: false,
    };
    return {
        mainOptions: mainOpts,
        extraOptions: { ...defaultExtraOptions, ...extraOptions },
    };
}
//# sourceMappingURL=set-options.js.map