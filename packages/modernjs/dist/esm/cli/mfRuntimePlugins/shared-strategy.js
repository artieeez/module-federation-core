var sharedStrategy = function() {
  return {
    name: "shared-strategy-plugin",
    beforeInit: function beforeInit(args) {
      var userOptions = args.userOptions;
      var shared = userOptions.shared;
      if (shared) {
        Object.keys(shared).forEach(function(sharedKey) {
          var sharedConfigs = shared[sharedKey];
          var arraySharedConfigs = Array.isArray(sharedConfigs) ? sharedConfigs : [
            sharedConfigs
          ];
          arraySharedConfigs.forEach(function(s) {
            s.strategy = "loaded-first";
          });
        });
      }
      return args;
    }
  };
};
var shared_strategy_default = sharedStrategy;
export {
  shared_strategy_default as default
};
