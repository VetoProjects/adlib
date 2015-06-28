attribute highp vec3 aVertexPosition;
attribute highp vec2 aTextureCoord;

varying highp vec2 vTextureCoord;

uniform float cosVar, sinVar;

/* In JS:
      var angle = 90;
      var radian = Math.PI * angle / 180.0;
      var cosB = Math.cos(radian);
      var sinB = Math.sin(radian);

      var cosVar = gl.getUniformLocation(gl.program, 'cosVar');
      var sinVar = gl.getUniformLocation(gl.program, 'sinVar');

      gl.uniform1f(cosVar, cosB);
      gl.uniform1f(sinVar, sinB);
*/
void main(void) {
    gl_Position = vec4(aVertexPosition, 1);
    gl_Position.x = gl_Position.x * cosVar - gl_Position.y * sinVar;
    gl_Position.y = gl_Position.x * sinVar + gl_Position.y * cosVar;
    vTextureCoord = aTextureCoord;
}
