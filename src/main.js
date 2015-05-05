(function() {
  var _canvas = document.getElementById('video');
  var _canvasCtx = _canvas.getContext('2d');
  _canvasCtx.clearRect(0, 0, _canvas.width, _canvas.height);

  var _width = _canvas.width,
  var _height = _canvas.height;

  _canvasCtx.fillStyle = 'rgb(100, 100, 100)';
  _canvasCtx.fillRect(0, 0, _width, _height);
})();
