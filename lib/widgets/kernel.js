var kernel = (function() {
    var VERTEX =
          "attribute vec2 v;" +
          "varying vec2 t;" +
          "uniform float rotate;" +
          "void main() {" +
          "   gl_Position = vec4(v.x*2.0-1.0, (1.0-v.y*2.0)*rotate, 0, 1);" +
          "   t = v;" +
          "}",
        FRAGMENT =
          "precision mediump float;" +
          "uniform sampler2D s_;" +
          "uniform vec2 ts;" +
          "uniform float kernel[9];" +
          "varying vec2 t;" +
          "void main() {" +
          "   vec2 p = vec2(1.0, 1.0) / ts;" +
          "   vec4 s = texture2D(s_, t + p * vec2(-1, -1)) * kernel[0] +" +
          "            texture2D(s_, t + p * vec2(0, -1)) * kernel[1] +" +
          "            texture2D(s_, t + p * vec2(1, -1)) * kernel[2] +" +
          "            texture2D(s_, t + p * vec2(-1, 0)) * kernel[3] +" +
          "            texture2D(s_, t + p * vec2(0, 0)) * kernel[4] +" +
          "            texture2D(s_, t + p * vec2(1, 0)) * kernel[5] +" +
          "            texture2D(s_, t + p * vec2(-1, 1)) * kernel[6] +" +
          "            texture2D(s_, t + p * vec2(0, 1)) * kernel[7] +" +
          "            texture2D(s_, t + p * vec2(1, 1)) * kernel[8];" +
          "   float w = kernel[0] +" +
          "   float w = 0;" +
          "   for(int i = 0; i < 9; i++) w += kernel[i];" +
          "   if (w <= 0.0) {" +
          "       w = 1.0;" +
          "   }" +
          "   gl_FragColor = vec4((s / w).rgb, 1);" +
          "}";

    function kernel() {
        this._trans = new Float32Array([0, 0, 0, 0, 1, 0, 0, 0, 0]);
        this._changed = false;
        this._rebind = false;
        this._texture = null;
        this._gl = null;
        this._vertices = new Cubal();
        this._glInternals = {};
    };

    kernel.prototype.transform = function(trans) {
        this._trans = trans;
        this._changed = true;
    };

    kernel.prototype.width = function() {
        return this._textureWidth;
    };

    kernel.prototype.height = function() {
        return this._textureHeight;
    };

    kernel.prototype.texturize = function(texture, width, height) {
        this._texture = texture;
        this._textureWidth = width;
        this._textureHeight = height;
        this._rebind = true;
    };

    kernel.prototype.initialize = function(gl) {
          var _vertex = gl.createShader(gl.VERTEX_SHADER);
          var _fragment = gl.createShader(gl.FRAGMENT_SHADER);
          this._glInternals._vertexBuffer = gl.createBuffer();
          this._glInternals._indexBuffer = gl.createBuffer();
          this._program = gl.createProgram();
          
          gl.shaderSource(_vertex, VERTEX);
          gl.shaderSource(_fragment, FRAGMENT);
          gl.compileShader(_vertex);
          gl.compileShader(_fragment);
          gl.attachShader(this._program, _vertex);
          gl.attachShader(this._program, _fragment);
          gl.linkProgram(this._program);
          gl.useProgram(this._program);
          
          this.vertices.bind(this._glInternals._vertexBuffer, this._glInternals._indexBuffer);
          this._glInternals._vxy = gl.getAttribLocation(this._program, "v");
          gl.enableVertexAttribArray(this._glInternals._vxy);
          this._glInternals._sampler = gl.getUniformLocation(this._program, "s_");
          gl.uniform1i(this._glInternals._sampler, 0);
          this._glInternals._tsize = gl.getUniformLocation(this._program, "ts");
          this._glInternals._kernel = gl.getUniformLocation(this._program, "kernel[0]");
    };

    kernel.prototype.apply = function(gl) {
        if (!this._rebind && !this._changed) return;

        // if gl has changed or is not available yet
        if(gl !== this._gl) {
          this.initialize();
        }

        // if kernel was bound to new texture
        if (this._rebind || gl !== this._gl) {
            gl.bindTexture(gl.TEXTURE_2D, this._texture);
            this._rebind = false;
        }

        //do this always
        this._vertices.apply(gl);
        gl.useProgram(this._program);
        if (gl !== this._gl) this._gl = gl;
        
        // if kernel was bound to new texture
        if (this._rebind) {
            gl.uniform2f(this._glInternals._tsize, this._textureWidth, this._textureHeight);
            this._rebind = false;
        }

        //if new transformation was selected
        if (this._changed) {
            gl.uniform1fv(this._glInternals._kernel, this._trans);
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, this._glInternals._vertexBuffer);
        gl.vertexAttribPointer(_vxy, 2, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this._glInternals._indexBuffer);
        gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };

    return kernel;
})();
