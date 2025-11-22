uniform sampler2D uGradient;
uniform float uIndex;
uniform float uCount;

float luminance(vec3 color) {
    return dot(color, vec3(0.2126, 0.7152, 0.0722));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 tex = inputColor;

    vec3 color = tex.rgb;

    float lum = 1.0 - luminance(color);

    float column = uIndex - 1.0;
    float u = column / uCount;

    vec3 gradientColor = texture2D(uGradient, vec2(u, lum)).rgb;

    color *= gradientColor;

    outputColor = vec4(color, tex.a);
}