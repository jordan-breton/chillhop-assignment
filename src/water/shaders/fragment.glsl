uniform float uTime;
uniform vec3 uColor;
uniform float uGlintIntensity;
uniform float uNoiseScale;
varying vec3 vWorldPos;
varying vec2 vUv;

// Simple 2D noise
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453123); }
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f*f*(3.0-2.0*f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    float n = noise(vUv * uNoiseScale - vec2(uTime * 0.1, uTime * 0.1));
    float glintPattern = smoothstep(0.92, 1.0, n);
    float glint = glintPattern * uGlintIntensity;

    gl_FragColor = vec4(glintPattern) * uGlintIntensity;
}