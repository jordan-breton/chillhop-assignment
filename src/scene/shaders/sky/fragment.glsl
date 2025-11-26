uniform sampler2D uMap;
uniform vec3 uStartColor;
uniform vec3 uEndColor;

varying vec2 vUv;

void main() {
    vec4 tex = texture(uMap, vUv);
    float vertical =  smoothstep(0.94, 0.98, vUv.x);
    vec3 mixColor = mix(uStartColor, uEndColor, vertical);

    gl_FragColor = vec4(mixColor * luminance(tex.rgb), 1.0);
}