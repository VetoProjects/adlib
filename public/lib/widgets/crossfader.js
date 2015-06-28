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
            ['fader',
             'lightness0', 'hue0', 'saturation0',
             'lightness1', 'hue1', 'saturation1']);
    });
};
