import React, { useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { Environment } from "@react-three/drei";

const cameraPositions = [
  { position: [0, 3, 15], lookAt: [0, 0, 0] },
  { position: [15, 0, 12.5], lookAt: [0, 0, 0] },
  { position: [-15, 0, 12.5], lookAt: [0, 0, 0] },
  {
    position: [-6.0358791643389145, 3.028888268496038, 6.405432772282838],
    lookAt: [0, 1, 0],
  },
  {
    position: [5.248097238306234, 2.5015889415213106, 5.4666839498488295],
    lookAt: [0, 1, 0],
  },
  { position: [0, 4.332061055971331, 6.700236003219422], lookAt: [0, 1, 0] },
  { position: [0, -0.902270925328769, 7.929117645891684], lookAt: [0, 1, 0] },
  {
    position: [0, 2.522576945620514e-15, 41.19680788578111],
    lookAt: [0, 0, 0],
  },
  {
    position: [10.830953118825398, 0.6206651180632762, -0.40251601096885026],
    lookAt: [0, 1, 0],
  },
  { position: [0, -0.902270925328769, 7.929117645891684], lookAt: [0, 0, 0] },
  {
    position: [-10.830953118825398, 0.6206651180632762, -0.40251601096885026],
    lookAt: [0, 1, 0],
  },
];

export default function Env({ enterIncrement }) {
  const vec = useMemo(() => new THREE.Vector3(), []);

  useFrame((state) => {
    const index = (enterIncrement % 13) - 2;
    if (index >= 0 && index < cameraPositions.length) {
      const { position, lookAt } = cameraPositions[index];
      state.camera.position.lerp(vec.set(...position), 0.01);
      state.camera.lookAt(...lookAt);
    }
  });

  return <Environment preset="night" blur={0.65} background={false} />;
}
