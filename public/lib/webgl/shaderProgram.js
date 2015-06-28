var ShaderProgram = function(gl, vsCode, fsCode) {
    // vertex shaders
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, vsCode);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling vertex shaders: ' + gl.getShaderInfoLog(vertexShader), vsCode);
        return null;
    }

    // fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, fsCode);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        console.error('An error occurred compiling fragment shaders: ' + gl.getShaderInfoLog(fragmentShader), fsCode);
        return null;
    }

    // shader program
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        console.error('Failed to link shaders.');
        return null;
    }
    gl.useProgram(shaderProgram);

    function attributeLocation(name) {
        var id = gl.getAttribLocation(shaderProgram, name);
        gl.enableVertexAttribArray(id);
        return id;
    }

    function attributeLocations(names) {
        return names.map(attributeLocation);
    }

    function uniformLocation(name) {
        return gl.getUniformLocation(shaderProgram, name);
    }

    function uniformLocations(names) {
        return names.map(uniformLocation);
    }

    return {
        attributeLocation: attributeLocation,
        attributeLocations: attributeLocations,
        uniformLocation: uniformLocation,
        uniformLocations: uniformLocations
    };
};

ShaderProgramFromUrls = function(gl, vsUrl, fsUrl, cb) {
    function request(url) {
        req = new XMLHttpRequest();
        req.open('GET', url, false);
        req.send();
        if (req.status != 200) {
            console.error('Failed to load shader: ' + url);
            return null;
        }
        return req.responseText;
    }
    var vsCode, fsCode;
    if (!(vsCode = request(vsUrl)))
        return null;
    if (!(fsCode = request(fsUrl)))
        return null;
    return ShaderProgram(gl, vsCode, fsCode);
};
