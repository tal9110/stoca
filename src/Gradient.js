import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import {
  Icosahedron,
  Point,
  Points,
  ScreenQuad,
  shaderMaterial,
  Stars,
} from "@react-three/drei";
import { extend, useFrame, useThree } from "@react-three/fiber";
import gsap from "gsap";

// import useRef from "react";

const hundredColors = require("./hundredColors.json");
let firstPalette = hundredColors[21];
firstPalette = firstPalette.map((color) => new THREE.Color(color));

const GradientMaterial = shaderMaterial(
  {
    time: 0,
    uColor: firstPalette,

    resolution: new THREE.Vector4(),
    opacity: 1,
    modifier: 1,
    u_time: 0,
    iChannel0: new THREE.TextureLoader().load("/cacti.jpeg"),
    u_color1: new THREE.Color("#000000"),
    u_color2: new THREE.Color("#ffffff"),
    u_color3: new THREE.Color("#0f6af2"),
    u_color4: new THREE.Color("#cc0041"),
    u_color5: new THREE.Color("#ff7700"),

    // u: 1,
    // amplitude: 0.5,
  },
  /* glsl */ `
  uniform float u_time;

  varying vec2 vUv; 
void main()
{
    vUv = uv;
      vec3 pos = position;
      // pos.x += sin(u_time + pos.y * 10.0) * 0.1;
      // pos.y += cos(u_time + pos.x * 10.0) * 0.1;
      // pos.z += sin(u_time + pos.x * 5.0 + pos.y * 5.0) * 0.1;
    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0 );
    gl_Position = projectionMatrix * mvPosition;
}
// uniform float u_time;
// varying vec2 vUv;

// void main() {
//   vec3 pos = position;
//   // pos.x += sin(u_time + pos.y) * 0.1;
//   // pos.y += cos(u_time + pos.x) * 0.1;
//       vec4 mvPosition = modelViewMatrix * vec4(position, 1.0 );
//       gl_Position = projectionMatrix * mvPosition;
    
//     }






    
      `,
  /* glsl */ `
    
//   uniform float opacity;
//     uniform float time;
//     uniform float progress;
//     uniform sampler2D texture1;
//     uniform vec4 resolution;
//     varying vec2  vUv;
//     varying vec3 vNormal;
//     varying vec3 vPosition;
//     varying vec3 vColor;
//     uniform sampler2D iChannel10;
//     uniform sampler2D iChannel0;
//     uniform sampler2D iChannel1;
//     uniform vec3 u_color1;
// uniform vec3 u_color2;
// uniform vec3 u_color3;
// uniform vec3 u_color4;
// uniform vec3 u_color5;

//     uniform vec2 u_resolution;
//     uniform float u_time;
    
//     float shape(vec2 st, float t) {
//       st = fract(st);
//       st -= 0.5;
//       st *= 2.0;
//       st *= mat2(cos(t), sin(t), -sin(t), cos(t));
//       return length(st) - 0.3;
//     }
    
//     void main() {
//       vec2 st = vUv;
//       vec3 color = vec3(0.0);
      
//       float s1 = smoothstep(0.1, 0.3, shape(st + vec2(sin(u_time), cos(u_time)), u_time));
//       float s2 = smoothstep(0.3, 0.5, shape(st + vec2(cos(u_time), sin(u_time)), u_time + 0.5));
//       float s3 = smoothstep(0.5, 0.7, shape(st + vec2(sin(u_time), sin(u_time)), u_time + 1.0));
//       float s4 = smoothstep(0.7, 0.9, shape(st + vec2(cos(u_time), cos(u_time)), u_time + 1.5));
//       float s5 = smoothstep(0.9, 1.0, shape(st + vec2(sin(u_time), -cos(u_time)), u_time + 2.0));
      
//       color = mix(u_color1, u_color2, s1);
//       color = mix(color, u_color3, s2);
//       color = mix(color, u_color4, s3);
//       color = mix(color, u_color5, s4);
//       color = mix(color, u_color1, s5);
  
//   gl_FragColor = vec4(color, 1.0);
// }

// varying vec2 vUv;
// uniform float u_time;

// uniform vec3 u_color1;
// uniform vec3 u_color2;
// uniform vec3 u_color3;
// uniform vec3 u_color4;
// uniform vec3 u_color5;

// void main() {
//   vec2 position = vUv;
  
//   // Use complex math equations to create the shapes and patterns
//   float pattern1 = sin(position.x * 10.0 + u_time);
//   float pattern2 = cos(position.y * 10.0 + u_time);
//   float pattern3 = sin(position.y * 15.0 + u_time);
//   float pattern4 = sin(position.x * position.y * 20.0 + u_time);
  
//   // Use the pattern values to select the input colors
//   vec3 finalColor = mix(u_color1, u_color2, pattern1) + mix(u_color3, u_color4, pattern2) + mix(u_color4, u_color5, pattern3) + mix(u_color1, u_color3, pattern4);
  
//   gl_FragColor = vec4(finalColor, 1.0);
// }

uniform float time;
// uniform vec2 resolution;
varying vec2 vUv;
uniform vec3 u_color1;
uniform vec3 u_color2;
uniform vec3 u_color3;
uniform vec3 u_color4;
uniform vec3 u_color5;

void main() {
  vec2 position = -1.0 + 2.0 * vUv;
  
  float color = 0.0;
  color += sin(position.x * cos(time / 15.0) * 50.0) + cos(position.y * cos(time / 10.0) * 50.0);
  color += sin(position.y * sin(time / 20.0) * 50.0) + cos(position.x * sin(time / 15.0) * 50.0);
  color += sin(position.x * sin(time / 5.0) * 10.0) + sin(position.y * sin(time / 25.0) * 50.0);
  color *= sin(time / 10.0) * 0.5;
  
  gl_FragColor = mix(
    mix(
      mix(
        mix(vec4(u_color1, 1.0), vec4(u_color2, 1.0), color),
        vec4(u_color3, 1.0), color
      ),
      vec4(u_color4, 1.0), color
    ),
    vec4(u_color5, 1.0), color
  );
}

      `
);

extend({ GradientMaterial });
// -1.0 + 2.0 *vUv

export default function Gradient(props) {
  const gradientRef = useRef();
  useFrame((state, delta) => {
    // gradientRef.current.rotation.y += 0.01;
    gradientRef.current.material.uniforms.time.value += delta;
    if (props.colorOne) {
      gradientRef.current.material.uniforms.u_color1.value = new THREE.Color(
        props.colorOne
      );
      gradientRef.current.material.uniforms.u_color2.value = new THREE.Color(
        props.colorTwo
      );
      gradientRef.current.material.uniforms.u_color3.value = new THREE.Color(
        props.colorThree
      );
      gradientRef.current.material.uniforms.u_color4.value = new THREE.Color(
        props.colorFour
      );
      gradientRef.current.material.uniforms.u_color5.value = new THREE.Color(
        props.colorFive
      );
    }

    //   gradientRef.current.material.uniforms.u_color2.value = props.colorTwo;
    //   gradientRef.current.material.uniforms.u_color3.value = props.colorThree;
    //   gradientRef.current.material.uniforms.u_color4.value = props.colorFour;
    //   gradientRef.current.material.uniforms.u_color5.value = props.colorFive;
    // }
  });
  return (
    <>
      <mesh rotation-y={-Math.PI / 2} ref={gradientRef}>
        {/* <sphereGeometry args={[20, 512, 512]} /> */}
        <planeBufferGeometry args={[20, 20, 1024, 1024]} />
        <gradientMaterial
          side={THREE.DoubleSide}
          // transparent={true}
          extensions={{
            derivatives: "#extension GL_OES_standard_derivatives : enable",
          }}
        />
      </mesh>
    </>
  );
}
