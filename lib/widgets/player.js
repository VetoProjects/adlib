var player = function() {
    var _player = { };
    var _video = document.createElement('video');
    var _updateCallback = [];

    _video.preload = 'auto';
    _video.loop = true;

    _player.load = function(file) {
        _video.setAttribute('src', URL.createObjectURL(file));
    };

    _player.play = function() {
        if (_video.paused)
            _video.play();
    };

    _player.pause = function() {
        if (!_video.paused)
            _video.pause();
    };

    _player.updateListener = function(callback) {
        if (typeof callback === 'function')
            _updateCallback.push(callback);
    };

    _video.addEventListener('ended', _player.pause, true);

    Object.defineProperty(_player, 'video', {
        get: function() { return _video; }
    });

    return _player;
};
