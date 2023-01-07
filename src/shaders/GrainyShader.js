export const GrainyShader = {
  uniforms: {
    tDiffuse: { value: null },
    radius: { value: 0.6 },
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
      vec4 color = texture2D(tDiffuse, vUv);
      if (distort > 0.0) {
        color = mix(color, vec4(1.0), distort);
        float angle = atan(vUv.y - center.y, vUv.x - center.x);
        float offset = distort * 0.5;
        color = texture2D(tDiffuse, vec2(vUv.x + cos(angle) * offset, vUv.y + sin(angle) * offset));
      }
      gl_FragColor = color;
                  }`,
};
