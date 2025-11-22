uniform sampler2D uGradient;
uniform float uIndex;     // 1 to N
uniform float uCount;     // total number (e.g. 32)

float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 tex = inputColor;

    // sRGB → linear
    vec3 color = pow(tex.rgb, vec3(2.2));

    float lum = luminance(tex.rgb);

    // --- Compute correct U coordinate for selected gradient column ---
    float column = uIndex - 1.0;
    float u = (column + lum) / uCount;
    // lum moves inside the selected column
    // column selects which gradient

    // sample at v = 0.5 (middle of the 1px height)
    vec3 gradientColor = pow(texture2D(uGradient, vec2(u, 0.5)).rgb, vec3(2.2));

    // Tint
    color *= gradientColor;

    // Linear → sRGB
    color = pow(color, vec3(1.0 / 2.2));

    outputColor = vec4(color, tex.a);
}