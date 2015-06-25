var Crossfader = function(canvas, player1, player2) {
    var fader = 0;
    var videoCanvas = VideoCanvas(
        canvas,
        'lib/webgl/vertexShader.vs',
        'lib/webgl/videoCrossfader.fs',
        [player1.video, player2.video],
        ['fader']);

    return {
        draw: videoCanvas.draw,
        get fader() { return videoCanvas.uniforms.fader; },
        set fader(val) { videoCanvas.uniforms.fader = val; }
    };
};
