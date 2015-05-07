var kernel = (function() {
    function kernel() {
        this.kernel = new Float32Array([0, 0, 0, 0, 1, 0, 0, 0, 0]);
        this.changed = false;
        this.flipped = false;
    }
    kernel.prototype.transform = function(kernel) {
        this.kernel = kernel;
        this.changed = true;
    };
    kernel.prototype.width = function() {
        return this.textureWidth;
    };
    kernel.prototype.height = function() {
        return this.textureHeight;
    };
    kernel.prototype.texturize = function(texture, width, height) {
        this.texture = texture;
        this.textureWidth = width;
        this.textureHeight = height;
        this.rebind = true;
    };
    kernel.prototype.apply = function(gl) {
    };
    return kernel;
})();
