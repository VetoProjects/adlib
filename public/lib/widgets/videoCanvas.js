var VideoCanvas = function(canvas, vs, fs, videos, uniforms) {
    // create context
    console.log(canvas);
    var gl = canvas.getContext('experimental-webgl');
    console.log(gl);

    // shader program
    var shaderProgram = ShaderProgram(gl, vs, fs);

    // shader attributes
    var vertexPosition = shaderProgram.attributeLocation('aVertexPosition');
    var textureCoord = shaderProgram.attributeLocation('aTextureCoord');

    // create draw plane
    // vertex buffer
    var vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    var vertexArray = new Float32Array([
        1, 1, 0, 1, -1, 0, -1, 1, 0,
        1, -1, 0, -1, -1, 0, -1, 1, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
    // uv buffer
    var uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
    var uvArray = new Float32Array([
        1, 0, 1, 1, 0, 0,
        1, 1, 0, 1, 0, 0]);
    gl.bufferData(gl.ARRAY_BUFFER, uvArray, gl.STATIC_DRAW);

    // create textures
    var textures = videos.map(function(video, key) {
        return VideoTexture(
            gl,
            shaderProgram.uniformLocation('video' + key),
            key,
            video
        );
    });

    gl.clearColor(0.0, 0.0, 0.0, 1.0);

    // draw
    function draw() {
        if (textures.some(function(texture) {
            return !texture.ready;
        }))
            return;

        // update textures
        textures.forEach(function(texture) {
            texture.update();
        });

        // clear buffers
        gl.clear(gl.COLOR_BUFFER_BIT);

        // update and bind vertex buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(vertexPosition, 3, gl.FLOAT, false, 0, 0);

        // update and bind fragment buffer
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.vertexAttribPointer(textureCoord, 2, gl.FLOAT, false, 0, 0);

        // bind textures
        textures.forEach(function(texture) {
            texture.bind();
        });

        // draw plane
        gl.drawArrays(gl.TRIANGLES, 0, 6);
    }

    var videoCanvas = {
        get draw() { return draw; }
    };
    uniforms.forEach(function(name) {
        var id = shaderProgram.uniformLocation(name);
        Object.defineProperty(videoCanvas, name, {
            get() { return gl.getUniform(id); },
            set(val) { gl.uniform1f(id, val); }
        });
    });

    return videoCanvas;
};
