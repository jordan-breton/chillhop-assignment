#include <fog_pars_fragment>

uniform sampler2D uTexture;
varying vec2 vUv;

void main() {
    gl_FragColor = texture(uTexture, vUv);

    #include <fog_fragment>
    #include <colorspace_fragment>
}
