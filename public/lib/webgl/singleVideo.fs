varying highp vec2 vTextureCoord;

uniform sampler2D video0;

void main(void) {
    highp vec4  color = texture2D(video0, vTextureCoord);
    color.rgb -= 0.065;
    color.rgb /= 0.935;
    gl_FragColor = color;
}
