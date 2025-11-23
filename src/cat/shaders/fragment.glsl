uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    csm_DiffuseColor = texture(uTexture, vUv);
}
