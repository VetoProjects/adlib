var kernel = (function() {
    function kernel() {
        this._trans = new Float32Array([0, 0, 0, 0, 1, 0, 0, 0, 0]);
        this._changed = false;
        this._rebind = false;
        this._texture = null;
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
    };
    return kernel;
})();
