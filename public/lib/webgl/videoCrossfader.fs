precision highp float;

varying highp vec2 vTextureCoord;

uniform int time;
uniform float fader,
    hue0, lightness0, saturation0, line0,
    hue1, lightness1, saturation1, line1;
uniform sampler2D video0;
uniform sampler2D video1;

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

vec4 fadeAdditive(vec4 c0, vec4 c1, float fade) {
    c0.a *= (1.0 - max(fade, 0.0));
    c1.a *= (1.0 + min(fade, 0.0));
    return c0 + c1;
}

vec4 fadeMultiplivative(vec4 c0, vec4 c1, float fade) {
    float f0 = max(-fade, 0.0),
          f1 = max( fade, 0.0);
    return f0 * c0 +
           f1 * c1 +
           c0 * c1 * (1.0 - f0 - f1);
}

void main(void) {
    vec4 color0 = texture2D(video0, vTextureCoord);
    vec4 color1 = texture2D(video1, vTextureCoord);

    color0.a = line0 * (color0.r + color0.g + color0.b) / 3.0;
    color1.a = line1 * (color1.r + color1.g + color1.b) / 3.0;

    color0.rgb -= 0.065;
    color1.rgb -= 0.065;

    color0.rgb /= 0.935;
    color1.rgb /= 0.935;

    vec3 hsv0 = rgb2hsv(color0.rgb);
    vec3 hsv1 = rgb2hsv(color1.rgb);

    hsv0.x += hue0;
    hsv1.x += hue1;

    hsv0.y *= saturation0;
    hsv1.y *= saturation1;

    hsv0.z *= lightness0;
    hsv1.z *= lightness1;

    color0.rgb = hsv2rgb(hsv0);
    color1.rgb = hsv2rgb(hsv1);

    gl_FragColor = fadeAdditive(color0, color1, fader);
}
