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

    // create context
    var canvas = form.querySelector('.preview');
    var gl = canvas.getContext('experimental-webgl');

    // create texture
    var texture = gl.createTexture();
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    // vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,
        'attribute highp vec3 aVertexPosition;' +
        'attribute highp vec2 aTextureCoord;' +

        'varying highp vec2 vTextureCoord;' +

        'void main(void) {' +
        '    gl_Position = vec4(aVertexPosition, 1);' +
        '    vTextureCoord = aTextureCoord;' +
        '}'
    );
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(vertexShader));
    }

    // fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,
        'varying highp vec2 vTextureCoord;' +

        'uniform sampler2D video;' +

        'void main(void) {' +
        '    gl_FragColor = vec4(1.0,0.0,0.0,1.0);' +
        '    gl_FragColor = texture2D(video, vec2(vTextureCoord.s, vTextureCoord.t));' +
        '}'
    );
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert('An error occurred compiling the shaders: ' + gl.getShaderInfoLog(fragmentShader));
    }


    // shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    // if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS))
    gl.useProgram(shaderProgram);

    // shader attributes
    vertexPositionAttribute = gl.getAttribLocation(shaderProgram, 'aVertexPosition');
    gl.enableVertexAttribArray(vertexPositionAttribute);
    vertexTextureCoordAttribute = gl.getAttribLocation(shaderProgram, 'aTextureCoord');
    gl.enableVertexAttribArray(vertexTextureCoordAttribute);

    // create draw plane
    // vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var vertexArray = new Float32Array([
        1, 1, 0, 1, -1, 0, -1, 1, 0,
        1, -1, 0, -1, -1, 0, -1, 1, 0]); // WebGLFloatArray
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    // uv buffer
    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    var uvArray = new Float32Array([
        1, 0, 1, 1, 0, 0,
        1, 1, 0, 1, 0, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, uvArray, gl.STATIC_DRAW);

    // draw
    function draw(video) {
        // update texture
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//        gl.generateMipmap(gl.TEXTURE_2D);
        gl.bindTexture(gl.TEXTURE_2D, null);

        // clear buffers
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        // update and bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

        // update and bind fragment buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.vertexAttribPointer(vertexTextureCoordAttribute, 2, gl.FLOAT, false, 0, 0);

        // bind texture
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(gl.getUniformLocation(shaderProgram, 'video'), 0);

        // draw plane
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    player.updateListener(draw);
};

var player1 = player();
connectPlayer(player1, 'player1');
var player2 = player();
connectPlayer(player2, 'player2');
