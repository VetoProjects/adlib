precision highp float;

varying vec2 vTextureCoord;

uniform float fader, fadeEffect, time,
    hue0, lightness0, saturation0, line0, rotation0, scaleX0, scaleY0,
    hue1, lightness1, saturation1, line1, rotation1, scaleX1, scaleY1;
uniform sampler2D video0, video1;

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
    color.a = (color.r + color.g + color.b) / 3.0;

    // hsl properties
    vec3 hsv = rgb2hsv(color.rgb);
    hsv.x += hue;
    hsv.y *= saturation;
    hsv.z *= lightness;
    color.rgb = hsv2rgb(hsv) * line;

    return color;
}

vec4 fadeAdditive(vec4 c0, vec4 c1, float fade) {
    return c0 * (1.0 - max(fade, 0.0)) +
           c1 * (1.0 + min(fade, 0.0));
}

vec4 fadeMultiplivative(vec4 c0, vec4 c1, float fade) {
    float f0 = max(-fade, 0.0),
          f1 = max( fade, 0.0);
    return f0 * c0 +
           f1 * c1 +
           c0 * c1 * (1.0 - f0 - f1);
}

void main(void) {
    vec2 uv = vTextureCoord;
    vec4 color0 = apply(uv, video0, hue0, lightness0, saturation0, line0, rotation0, scaleX0, scaleY0);
    vec4 color1 = apply(uv, video1, hue1, lightness1, saturation1, line1, rotation1, scaleX1, scaleY1);

    if (fadeEffect == 1.0)
        gl_FragColor = fadeMultiplivative(color0, color1, fader);
    else
        gl_FragColor = fadeAdditive(color0, color1, fader);
}
