uniform sampler2D uLightsTexture;

varying vec2 vUv;

void main() {
    float mask = texture(uLightsTexture, vUv).a;
    mask = step(0.1, mask);

    csm_DiffuseColor += mask * vec4(1.0, 1.0, 0.0, 1.0) * 10000.0;
}