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

document.getElementById('learnButton').addEventListener('click', function() {
    if (midi.isLearning()) {
        midi.stopLearning();
        this.value = 'Start Learning';
    } else {
        midi.startLearning();
        this.value = 'Stop Learning';
    }
});
/**
 * Set the callback for messages
 * @param { string } msg message to show
 */
midi.onmessage = function(msg) {
    var span = document.getElementById('learnMessage');
    span.innerHTML = msg;

    setTimeout(function() {
      span.innerHTML = '';
    }, 5000);
};

// reset on double click
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

var startTime = Date.now();
var videoProperties = ['hue', 'lightness', 'saturation', 'line', 'rotation', 'scaleX', 'scaleY'];

// init players and crossfader
var player1 = player();
var player2 = player();
Promise.all([
    AsyncFile('lib/webgl/vertexShader.vs'),
    AsyncFile('lib/webgl/singleVideo.fs'),
    Crossfader(document.getElementById('video'), player1, player2)]).
then(function(args) {
    vsCode = args[0];
    fsCode = args[1];
    crossfader = args[2];
    console.log('crossfader created');
    // connect input elements to crossfader
    document.getElementById('crossfader').addEventListener('input', function() {
        crossfader.fader = this.value;
    });
    document.getElementById('fadeEffect').addEventListener('input', function() {
        console.log(this.selectedIndex);
        crossfader.fadeEffect = this.selectedIndex;
    });

    // connect input elements to player
    var connectPlayer = function(player, formId, index) {
        var form = document.getElementById(formId);
        var canvas = form.querySelector('.preview');
        var videoCanvas = VideoCanvas(
            canvas,
            vsCode,
            fsCode,
            [player.video],
            videoProperties.concat('time'));

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

        videoProperties.forEach(function(p) {
            videoCanvas[p] = crossfader[p + index] = form[p].value;
            form[p].addEventListener('input', function(e) {
                videoCanvas[p] = crossfader[p + index] = this.value;
            }, false)});

        player.addTimeUpdateCallback(function() {
            form.time.max = Math.ceil(player.getDuration());
            form.time.value = Math.round(player.getTime());
        });

        return videoCanvas;
    };

    var con1 = connectPlayer(player1, 'player1', 0);
    var con2 = connectPlayer(player2, 'player2', 1);

    // draw loop
    (function update() {
        con1.time = con2.time = crossfader.time = (Date.now() - startTime) / 1000.0;

        con1.draw();
        con2.draw();
        crossfader.draw();
        requestAnimationFrame(update);
    })();
}).catch (function(msg) {
    console.error(Error(msg));
});
