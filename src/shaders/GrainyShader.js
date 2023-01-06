export const GrainyShader = {
  uniforms: {
    tDiffuse: { value: null },
  },

  vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }`,

  fragmentShader: `
      uniform sampler2D tDiffuse;
      varying vec2 vUv;
      const float grainSize = 0.1;
      void main() {
        vec4 color = texture2D( tDiffuse, vUv );
        vec2 grain = grainSize * vec2(rand(vUv), rand(vUv.yx));
        vec2 uv = vUv + grain;
        vec4 grainyColor = texture2D( tDiffuse, uv );
        gl_FragColor = mix(color, grainyColor, 0.5);
      }`,
};
