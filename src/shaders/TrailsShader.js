import * as THREE from "three";

export const TrailsShader = {
  uniforms: {
    tDiffuse: { value: null },
    radius: { value: 0.4 },
    time: { value: 0.0 },
  },
  vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        }`,
  fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform float radius;
        uniform float time;
        varying vec2 vUv;
        void main() {
          vec2 center = vec2(0.5, 0.5);
          float dist = distance(vUv, center);
          float distort = smoothstep(radius - 0.1, radius, dist + sin(time) * 0.1);
          vec2 distortedUv = mix(vUv, center, distort);
          gl_FragColor = texture2D(tDiffuse, distortedUv);
        }`,
};
