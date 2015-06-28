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


//var videoWin = window.open('about:blank', '_blank','menubar=no, titlebar=no, toolbar=no, status=no, location=no, scrollbars=no, directories=no');
// videoWin.body.style.backgroundColor = '#000';
// videoWIn.document.body.appendChild(document.getElementById('video'))

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

// TODO: Find out: set one field of uniform array
// IDEA: generate shaders
// PROS: any count of videos
//       easy to include other shaders (effects / fades)
// CONS: harder to write/read
//       more work
//       is it a work around or a feature?
// is it nessesary?
// extra route
// template (substitute keywords)
// TODO: js for arguments

// init players and crossfader
var player1 = player();
var player2 = player();
Crossfader(document.getElementById('video'), player1, player2).then(function(crossfader) {
    console.log('crossfader created');
    // connect input elements to crossfader
    document.getElementById('crossfader').addEventListener('input', function() {
        crossfader.fader = this.value;
    });

    // connect input elements to player
    var connectPlayer = function(player, formId, index) {
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
        crossfader['lightness' + index] = form.brightness.value;
        form.brightness.addEventListener(
            'input',
            function(e) { crossfader['lightness' + index] = this.value; },
            false
        );
        crossfader['hue' + index] = form.hue.value;
        form.hue.addEventListener(
            'input',
            function(e) { crossfader['hue' + index] = this.value; },
            false
        );
        crossfader['saturation' + index] = form.saturation.value;
        form.saturation.addEventListener(
            'input',
            function(e) { crossfader['saturation' + index] = this.value; },
            false
        );

        var canvas = form.querySelector('.preview');
        return Promise.all([
            AsyncFile('lib/webgl/vertexShader.vs'),
            AsyncFile('lib/webgl/singleVideo.fs')]).
                then(function(shader) {
                    var videoCanvas = VideoCanvas(
                        canvas,
                        shader[0],
                        shader[1],
                        [player.video],
                        []);
                    return {
                        draw: videoCanvas.draw
                    };
                });
    };

    var con1 = connectPlayer(player1, 'player1', 0);
    var con2 = connectPlayer(player2, 'player2', 1);

    // draw loop
    Promise.all([con1, con2]).then(function(con) {
        (function update() {
            con[0].draw();
            con[1].draw();
            crossfader.draw();
            requestAnimationFrame(update);
        })();
    }).catch (function(msg) {
        console.log('Failed to connect player.', msg);
    });
}).catch (function(msg) {
    console.log('Failed to create crossfader', msg);
});
