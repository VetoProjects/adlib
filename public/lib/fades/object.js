var fadeList = { };

var loadFades = function(callback) {
    var names = [];
    var loaded = 0;

    function finished() {
        if (++loaded == names.length) {
            callback();
        }
    }

    for (var fade in fadeList) {
        if (fadeList.hasOwnProperty(fade)) {
            names.push(fade);
            AsyncFile('lib/fades/' + fade + '.fs').then(
                function(code) {
                    fadeList[fade].shaderCode = code;
                    // TODO: replace function name (color / position functions)
                    finished();
                },
                function(msg) {
                    fadeList[fade].error = 'failed to load: ' + msg;
                    finished();
                }
            );
        }
    }
    /**
     * Fade names
     */
    fadeList.names = names;
};
