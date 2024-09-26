function getExternals(config) {
    var _config_shared;
    const shared = Object.keys((_config_shared = config.shared) != null ? _config_shared : {});
    var _config_remotes;
    const remotes = (_config_remotes = config.remotes) != null ? _config_remotes : {};
    const remoteKeys = Object.keys(remotes).reduce((acc, key)=>{
        if (!key) return acc;
        acc.push(key);
        acc.push(key + '/*');
        return acc;
    }, []);
    const externals = [
        ...shared,
        ...remoteKeys
    ];
    return externals;
}

export { getExternals as g };
