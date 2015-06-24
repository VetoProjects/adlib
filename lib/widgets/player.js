var player = function() {
    var _player = { };
    var _video = document.createElement('video');
    var _playing = false;
    var _updateCallback = null;
    _video.preload = 'auto';

    var _updateTexture = function() {
        if (!_playing) return;
        if (typeof _updateCallback === 'function') _updateCallback(_video);
        requestAnimationFrame(_updateTexture);
    };

    _player.load = function(file) {
        _video.setAttribute('src', URL.createObjectURL(file));
    };

    _player.play = function() {
        if (_playing) return;
        _playing = true;
        _video.play();
        requestAnimationFrame(_updateTexture);
//        videoElement.addEventListener("timeupdate", updateTexture, true);
    };

    _player.pause = function() {
        if (!_playing) return;
        _playing = false;
        _video.pause();
    };

    _player.updateListener = function(callback) {
        _updateCallback = callback;
    };

    _video.addEventListener('ended', _player.pause, true);

    return _player;
};
