varying highp vec2 vTextureCoord;

uniform sampler2D video0;

uniform highp width;
uniform highp height;

void main(void) {
    highp vec4  color = texture2D(video0, vTextureCoord * vec2(width, height));
    color.rgb -= 0.065;
    color.rgb /= 0.935;
    gl_FragColor = color;
}
