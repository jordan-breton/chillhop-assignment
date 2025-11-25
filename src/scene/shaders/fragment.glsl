uniform sampler2D uLightsTexture;
uniform vec3 uLightColor;
uniform float uLightIntensity;

varying vec2 vUv;

void main() {
    float mask = texture(uLightsTexture, vUv).a;
    mask = step(0.1, mask);

    csm_DiffuseColor += mask * vec4(uLightColor, 1.0) * uLightIntensity;
}