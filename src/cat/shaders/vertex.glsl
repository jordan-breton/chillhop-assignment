uniform float uTime;

varying vec2 vUv;
varying vec3 vPos;

void main() {
    vUv = uv;

    vec3 newPosition = position;

    float speed = 1.2;
    if (uv.x == 0.0 && uv.y == 0.0) {
        newPosition.z -= sin(uTime * speed) * 0.015;
        newPosition.y += sin(uTime * speed) * 0.015;
    }

    csm_Position = newPosition;
}