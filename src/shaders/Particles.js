import { Points, BufferGeometry, Float32BufferAttribute } from "three";
// import genieImg from "./textures/particle.png";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";
import { useMemo } from "react";
import { useFrame } from "@react-three/fiber";

// export default function Particles() {
//   const genieTexture = useLoader(THREE.TextureLoader, "/textures/particle.png");
//   const count = 200; // number point accross one axis ini akan generate point 10.00 dimana count hanya 100 karena multiply
//   const sep = 1; //merupakan distance dari tiap point
//   let time = 0;
//   useFrame((state, delta) => {
//     time += delta;
//   });
//   const positions = useMemo(() => {
//     let positions = [];
//     for (let i = 0; i < count; i++) {
//       let angle = i * (Math.PI / count + time);
//       let x = Math.cos(angle) * sep * i;
//       let y = Math.sin(angle) * sep * i;
//       let z = time * 5;
//       positions.push(x, y, z);
//     }
//     return new Float32Array(positions);
//   }, [count, sep]);

//   return (
//     <points>
//       <bufferGeometry attach="geometry">
//         <bufferAttribute
//           attach="attributes-position"
//           array={positions}
//           count={positions.length / 3}
//           itemSize={3}
//         />
//       </bufferGeometry>
//       <pointsMaterial
//         attach="material"
//         map={genieTexture}
//         color={0x00aaff}
//         sizes={0.5}
//         sizeAttenuation
//         transparent={false}
//         alphaTest={0.5}
//         opacity={1.0}
//       />
//     </points>
//   );
// }
import { ShaderMaterial } from "three";

export default function Particles() {
  const genieTexture = useLoader(THREE.TextureLoader, "/textures/particle.png");
  const count = 200;
  const sep = 1;
  let time = 0;

  useFrame((state, delta) => {
    time += delta;
  });

  // Define vertex shader
  const vertexShader = `
    attribute float size;
    attribute vec3 customColor;
    varying vec3 vColor;
    uniform float time;
    void main() {
      vColor = customColor;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      float angle = position.x * (3.1415 / ${count.toFixed(1)}) + time;
      float x = cos(angle) * ${sep.toFixed(1)} * position.x;
      float y = sin(angle) * ${sep.toFixed(1)} * position.x;
      float z = time * 5.0;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(x, y, z, 1.0);
    }
  `;

  // Define fragment shader
  const fragmentShader = `
    varying vec3 vColor;
    void main() {
      gl_FragColor = vec4(vColor, 1.0);
    }
  `;

  // Create shader material
  const material = new ShaderMaterial({
    uniforms: {
      time: { value: 0 },
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  //   Set texture map and color for material
  material.map = genieTexture;
  material.color = new THREE.Color(0x00aaff);
  material.transparent = true;
  material.alphaTest = 0.5;
  material.opacity = 1.0;
  const geometry = new THREE.BufferGeometry();

  // Create particle system
  const particles = new THREE.Points(geometry, material);

  return <primitive object={particles} />;
}

// const MyShaderMaterial = new ShaderMaterial({
//   uniforms: {
//     color: { value: new THREE.Color(0xff0000) },
//     texture: {
//       value: new THREE.TextureLoader().load("/textures/particle.png"),
//     },
//   },
//   vertexShader: `
//     uniform vec3 color;
//     uniform sampler2D texture;
//     varying vec2 vUv;
//     void main() {
//       vUv = uv;
//       vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
//       gl_PointSize = 1.0;
//       gl_Position = projectionMatrix * mvPosition;
//     }
//   `,
//   fragmentShader: `
//     uniform vec3 color;
//     uniform sampler2D texture;
//     varying vec2 vUv;
//     void main() {
//       gl_FragColor = vec4(color, 1.0);
//       gl_FragColor = gl_FragColor * texture2D(texture, vUv);
//     }
//   `,
// });

// export default function Particles() {
//   return (
//     <Points material={MyShaderMaterial}>
//       <point position={[1, 2, 3]} color="red" />
//       <point position={[4, 5, 6]} color="green" />
//       <point position={[7, 8, 9]} color="blue" />
//     </Points>
//   );
// }
