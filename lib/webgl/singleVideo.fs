varying highp vec2 vTextureCoord;

uniform sampler2D video0;

void main(void) {
    gl_FragColor = vec4(0, 0, 0, 1);
    gl_FragColor = texture2D(video0, vTextureCoord);
}
