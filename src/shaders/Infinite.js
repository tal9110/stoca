export const Infinite = {
  uniforms: {
    tMap: { value: null },
    time: { value: 0 },
  },
  vertexShader: `
        uniform float time;
        varying vec2 vUv;
    
        void main() {
          vUv = uv;
          vec3 pos = position;
        //   pos.xy *= 1.0 + sin(time) * 0.1;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
  fragmentShader: `
        uniform sampler2D tMap;
        varying vec2 vUv;
    
        void main() {
          gl_FragColor = texture2D(tMap, vUv);
        }
      `,
};
