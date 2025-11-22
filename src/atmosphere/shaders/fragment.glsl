uniform sampler2D uGradient;
uniform float uFromIndex;
uniform float uToIndex;
uniform float uCount;
uniform float uMix;

float luminance(vec3 c) {
    return dot(c, vec3(0.2126, 0.7152, 0.0722));
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    vec4 tex = inputColor;
    vec3 color = tex.rgb;

    float lum = 1.0 - luminance(color);

    float uA = uFromIndex / uCount;
    float uB = uToIndex   / uCount;

    vec3 gA = texture2D(uGradient, vec2(uA, lum)).rgb;
    vec3 gB = texture2D(uGradient, vec2(uB, lum)).rgb;

    vec3 gradientColor = mix(gA, gB, uMix);
    vec3 mapped = gradientColor * luminance(color);

    color *= gradientColor;

    outputColor = vec4(color, tex.a);
}
