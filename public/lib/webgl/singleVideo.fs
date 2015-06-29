precision highp float;

varying vec2 vTextureCoord;

uniform float time, hue, lightness, saturation, line, rotation, scaleX, scaleY;
uniform sampler2D video0;

vec3 rgb2hsv(vec3 c) {
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 hsv2rgb(vec3 c) {
    if(c.x >= 1.0) c.x -= 1.0;
    else if(c.x < 0.0) c.x += 1.0;
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

vec4 apply(vec2 uv, sampler2D video, float hue, float lightness,
    float saturation, float line, float rotation, float scaleX, float scaleY)
{
    // scale
    uv = (uv - 0.5) * vec2(scaleX, scaleY) + 0.5;

    // rotate
    float sinf = sin(rotation);
    float cosf = cos(rotation);
    uv = (uv - 0.5) * mat2(cosf, sinf, -sinf, cosf) + 0.5;

    // pick color
    vec4 color = texture2D(video, fract(uv));

    // black correction
    color.rgb -= 0.065;
    color.rgb /= 0.935;

    //line fader
    color.a = line * (color.r + color.g + color.b) / 3.0;

    // hsl properties
    vec3 hsv = rgb2hsv(color.rgb);
    hsv.x += hue;
    hsv.y *= saturation;
    hsv.z *= lightness;
    color.rgb = hsv2rgb(hsv);

    return color;
}

void main(void) {
    vec4 color = apply(vTextureCoord, video0, hue, lightness, saturation,
        line, rotation, scaleX, scaleY);
    gl_FragColor = color;
}
