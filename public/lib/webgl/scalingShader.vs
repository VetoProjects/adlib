attribute highp vec3 aVertexPosition;
attribute highp vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

uniform vec2 scale;

void main(void) {
    gl_Position = vec4(aVertexPosition.x * scale.x, 
                       aVertexPosition.y * scale.y, 
                       0, 
                       1);
    vTextureCoord = aTextureCoord;
}
