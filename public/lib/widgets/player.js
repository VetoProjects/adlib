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
        if (_video.paused && _video.src)
            _video.play();
    };

    _player.volume = function(val) {
        _video.volume = val;
    };


    _player.time = function(value) {
        _video.currentTime = value;
    };

    _player.pause = function() {
        if (!_video.paused)
            _video.pause();
    };

    _player.getTime = function() {
        return _video.currentTime;
    };

    _player.getDuration = function() {
        return _video.duration;
    };

    _player.updateListener = function(callback) {
        if (typeof callback === 'function')
            _updateCallback.push(callback);
    };

    _player.addTimeUpdateCallback = function(callback) {
        _video.addEventListener('timeupdate', callback, false);
    };

    _video.addEventListener('ended', _player.pause, true);

    Object.defineProperty(_player, 'video', {
        get: function() { return _video; }
    });

    return _player;
};
