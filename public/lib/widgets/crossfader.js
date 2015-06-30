var Crossfader = function(canvas, players) {
    return Promise.all([
        AsyncFile('lib/webgl/vertexShader.vs'),
        AsyncFile('lib/webgl/videoCrossfader.fs')
    ]).then(function(shaderCodes) {
        return VideoCanvas(
            canvas,
            shaderCodes[0],
            shaderCodes[1],
            players.map(function(player) { return player.video }),
            ['fader', 'fadeEffect', 'time',
             'hue0', 'lightness0', 'saturation0', 'line0', 'rotation0', 'scaleX0', 'scaleY0',
             'hue1', 'lightness1', 'saturation1', 'line1', 'rotation1', 'scaleX1', 'scaleY1',
             'hue2', 'lightness2', 'saturation2', 'line2', 'rotation2', 'scaleX2', 'scaleY2',
             'hue3', 'lightness3', 'saturation3', 'line3', 'rotation3', 'scaleX3', 'scaleY3']);
    });
};
