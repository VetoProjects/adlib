(function() {
  var _canvas = document.getElementById('video');
  var _canvasCtx = _canvas.getContext('2d');
  _canvasCtx.clearRect(0, 0, _canvas.width, _canvas.height);

  var _width = _canvas.width,
      _height = _canvas.height;

  _canvasCtx.fillStyle = 'rgb(100, 100, 100)';
  _canvasCtx.fillRect(0, 0, _width, _height);
})();


var sliders = document.querySelectorAll('input[type=range]');
for (var i = 0; i < sliders.length; ++i) {
    sliders[i].addEventListener(
        'dblclick',
        function() {
            this.value = this.defaultValue;
            this.dispatchEvent(new Event('input'));
        },
        false
    );
}


var connectPlayer = function(player, formId) {
    var form = document.getElementById(formId);
    form.videoFile.addEventListener(
        'change',
        function(e) { player.load(this.files[0]); },
        false
    );
    form.volume.addEventListener(
        'input',
        function(e) { player.volume(this.value); },
        false
    );
    form.time.addEventListener(
        'input',
        function(e) { player.time(this.value); },
        false
    );
    form.play.addEventListener(
        'click',
        player.play,
        false
    );
    form.pause.addEventListener(
        'click',
        player.pause,
        false
    );
    var canvas = player.querySelector('.preview');
    var texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, cubeTexture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    player.updateCallback(function(video) {
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA,
            gl.UNSIGNED_BYTE, video);
    });
};

var player1 = player();
connectPlayer(player1, 'player1');
