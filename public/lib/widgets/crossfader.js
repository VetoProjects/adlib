var Crossfader = function(canvas, player1, player2) {
    return Promise.all([
        AsyncFile('lib/webgl/vertexShader.vs'),
        AsyncFile('lib/webgl/videoCrossfader.fs')
    ]).then(function(shaderCodes) {
        return VideoCanvas(
            canvas,
            shaderCodes[0],
            shaderCodes[1],
            [player1.video, player2.video],
            ['fader', 'fadeEffect', 'time',
             'hue0', 'lightness0', 'saturation0', 'line0', 'rotation0', 'scaleX0', 'scaleY0',
             'hue1', 'lightness1', 'saturation1', 'line1', 'rotation1', 'scaleX1', 'scaleY1']);
    });
};
