#include <fog_pars_vertex>

uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    float speed = 1.2;
    if (uv.x == 0.0 && uv.y == 0.0) {
        newPosition.z -= sin(uTime * speed) * 0.010;
        newPosition.y += sin(uTime * speed) * 0.010;
    }

    vec4 mvPosition = modelViewMatrix * vec4(newPosition, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    #include <fog_vertex>
}