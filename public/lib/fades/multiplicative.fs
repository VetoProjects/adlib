vec4 fade(vec4 c0, vec4 c1, float fader) {
    float f0 = max(-fader, 0.0),
          f1 = max( fader, 0.0);
    return f0 * c0 +
           f1 * c1 +
           c0 * c1 * (1.0 - f0 - f1);
}
