// (function() {
//   var _canvas = document.getElementById('video');
//   var _canvasCtx = _canvas.getContext('2d');
//   _canvasCtx.clearRect(0, 0, _canvas.width, _canvas.height);
//
//   var _width = _canvas.width,
//       _height = _canvas.height;
//
//   _canvasCtx.fillStyle = 'rgb(100, 100, 100)';
//   _canvasCtx.fillRect(0, 0, _width, _height);
// })();


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

    var canvas = form.querySelector('.preview');
    var videoCanvas = VideoCanvas(
        canvas,
        'lib/webgl/vertexShader.vs',
        'lib/webgl/singleVideo.fs',
        [player.video],
        []);

    return {
        draw: videoCanvas.draw
    };
};

var player1 = player();
var player2 = player();
var con1 = connectPlayer(player1, 'player1');
var con2 = connectPlayer(player2, 'player2');
var crossfader = Crossfader(document.getElementById('video'), player1, player2);

(function update() {
    con1.draw();
    con2.draw();
    crossfader.draw();
    requestAnimationFrame(update);
})();

document.getElementById('crossfader').addEventListener('input', function() {
    crossfader.fader = this.value;
});
