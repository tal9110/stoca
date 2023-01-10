import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

export default function Statue() {
  const { nodes } = useGLTF("/statue1.glb");
  const statueRef = useRef();

  return (
    <group dispose={null}>
      <mesh
        castShadow
        receiveShadow
        geometry={nodes.Buddha_statue.geometry}
        side={THREE.DoubleSide}
        position={[3.5, 2.1, -3]}
        rotation={[Math.PI / 2, 0, 0]}
        ref={statueRef}
        scale={0.1}
      >
        <meshPhysicalMaterial
          roughness={0}
          noise={0.04}
          clearcoat={1}
          clearcoatRoughness={0}
          color="#000000"
          bg="#000000"
          envMapIntensity={1}
          ior={1.25}
          transmission={0.99}
          opacity={0}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("/statue1.glb");
