#ifdef GL_ES
precision highp float;
#endif
varying highp vec2 vTextureCoord;

uniform sampler2D video0;

varying float rotation;

void main(void) {
  vec2 coord = vTextureCoord;
  float sinf = sin(rotation);
  float cosf = cos(rotation);
  coord = (coord - 0.5) * mat2(cosf, sinf, -sinf, cosf);
  coord += 0.5;

  gl_FragColor = texture2D(video0, coord);
}
