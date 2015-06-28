var effectList = { };

/**
 * Load shader codes from server
 * @param {callback} callback is called if effects finished loading
 */
effectList.load = function(callback) {
    var names = [];
    var loaded = 0;

    function finished() {
        if (++loaded == names.length) {
            callback();
        }
    }

    for (var effect in effectList) {
        if (effectList.hasOwnProperty(effect)) {
            names.push(effect);
            AsyncFile('lib/effects/' + effect + '.fs').then(
                function(code) {
                    effectList[effect].shaderCode = code;
                    // TODO: replace function name (color / position functions)
                    finished();
                },
                function(msg) {
                    effectList[effect].error = 'failed to load ' + effect + ': ' + msg;
                    finished();
                }
            );
        }
    }
    /**
     * Effekt names
     */
    effectList.names = names;
};
