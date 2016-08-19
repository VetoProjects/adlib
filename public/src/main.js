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


var videoWin = null;
var switchToMode2 = function() {
    if (videoWin) {
        var p3 = document.getElementById('player3');
        p3.parentElement.insertBefore(videoWin.document.getElementById('video'), p3);
        if (!videoWin.closed) videoWin.close();
    }
    document.getElementById('player2').classList.add('hidden');
    document.getElementById('player3').classList.add('hidden');
    document.getElementById('switchMode').innerHTML = 'Switch to 4-Player-Mode';
};
var switchToMode4 = function() {
    videoWin = window.open('about:blank', '_blank', 'menubar=no, titlebar=no, toolbar=no, status=no, location=no, scrollbars=no, directories=no, width=800, height=450');
    videoWin.document.write('<html><head><link rel="stylesheet" href="style/videoWin.css" /><title>Adlib Video</title></head><body/></head>');
    videoWin.document.body.appendChild(document.getElementById('video'));
    videoWin.addEventListener('beforeunload', switchToMode2);
    document.getElementById('player2').classList.remove('hidden');
    document.getElementById('player3').classList.remove('hidden');
    document.getElementById('switchMode').innerHTML = 'Switch to 2-Player-Mode';
};

document.getElementById('switchMode').addEventListener('click', function(e) {
    e.preventDefault();
    if (!videoWin || videoWin.closed)
        switchToMode4();
    else
        switchToMode2();
});


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
var player3 = player();
var player4 = player();
Promise.all([
    AsyncFile('lib/webgl/vertexShader.vs'),
    AsyncFile('lib/webgl/singleVideo.fs'),
    Crossfader(document.getElementById('video'), [player1, player2, player3, player4])]).
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
        form.speed.addEventListener(
            'input',
            function(e) { player.speed(this.value); },
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
    var con3 = connectPlayer(player3, 'player3', 2);
    var con4 = connectPlayer(player4, 'player4', 3);

    // draw loop
    (function update() {
        con1.time = con2.time = con3.time = con4.time = crossfader.time = (Date.now() - startTime) / 1000.0;

        con1.draw();
        con2.draw();
        con3.draw();
        con4.draw();
        crossfader.draw();
        requestAnimationFrame(update);
    })();
}).catch(function(msg) {
    console.error(Error(msg));
});
