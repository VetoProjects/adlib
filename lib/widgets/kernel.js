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
    }
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
    kernel.prototype.apply = function(gl) {
        if (!this._rebind && !this._changed) return;

        if(gl !== this._gl) {
          // initialize
          var _vertex = gl.createShader(gl.VERTEX_SHADER);
          var _fragment = gl.createShader(gl.FRAGMENT_SHADER);
          this._program = gl.createProgram();
          gl.shaderSource(_vertex, VERTEX);
          gl.shaderSource(_fragment, FRAGMENT);
          gl.compileShader(_vertex);
          gl.compileShader(_fragment);
          gl.attachShader(this._program, _vertex);
          gl.attachShader(this._program, _fragment);
          gl.linkProgram(this._program);
          gl.useProgram(this._program);
        }
        // else
        gl.useProgram(this._program);
        if (gl !== this._gl) this._gl = gl;
    };
    return kernel;
})();
