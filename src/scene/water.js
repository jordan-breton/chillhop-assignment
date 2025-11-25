import * as THREE from "three";
import CustomShaderMaterial from "three-custom-shader-material/vanilla";

export default function initWater(scene, model) {
	const water = model.scene.getObjectByName("Water");

	console.log(water);

	const waterMaterial = new CustomShaderMaterial({
		baseMaterial: THREE.MeshToonMaterial,
		blending: THREE.AdditiveBlending,
		uniforms: {
			uTime: { value: 0 },
			uColor: { value: new THREE.Color("#f8d5ae") },
			uGlintIntensity: { value: 1500.0 },
			uNoiseScale: { value: 900.0 }
		},
		vertexShader: `
			varying vec3 vWorldPos;
			varying vec2 vUv;
			void main() {
				vUv = uv;
				csm_Position = position;
			}
		`,
		fragmentShader: `
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
				float glint = smoothstep(0.92, 1.0, n) * uGlintIntensity;
				csm_DiffuseColor = vec4(uColor + vec3(glint), 0.2);
			}
		`
	});

	water.material = waterMaterial;

	return {
		update(time) {
			waterMaterial.uniforms.uTime.value = time.elapsedSeconds;
		}
	};
}
