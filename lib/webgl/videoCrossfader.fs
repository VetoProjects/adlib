precision highp float;

varying highp vec2 vTextureCoord;

uniform float fader;
uniform sampler2D video0;
uniform sampler2D video1;

void main(void) {
    float f0 = 1.0 + min(fader, 0.0);
    float f1 = 1.0 - max(fader, 0.0);
    vec4 color0 = texture2D(video0, vTextureCoord);
    vec4 color1 = texture2D(video1, vTextureCoord);
    color0.a = (color0.r + color0.g + color0.b) / 3.0;
    color1.a = (color1.r + color1.g + color1.b) / 3.0;
    gl_FragColor =
        color0 * f0 +
        color1 * f1;
}
