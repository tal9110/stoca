import React, { useRef } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { Effects, useFBO } from "@react-three/drei";
import { FXAAShader } from "three-stdlib";
import { AdditiveBlendingShader } from "./shaders/AdditiveBlendingShader";
import { VolumetricLightShader } from "./shaders/VolumetricLightShader";
import { GrainyShader } from "./shaders/GrainyShader";

const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;

export default function Postproduction() {
  const { gl, camera, size } = useThree();
  const occlusionRenderTarget = useFBO();
  const occlusionComposer = useRef();
  const composer = useRef();

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    // Render occlusion
    camera.layers.set(OCCLUSION_LAYER);
    occlusionComposer.current.render();

    // Render scene
    camera.layers.set(DEFAULT_LAYER);
    composer.current.render();

    // Update grainy shader time uniform
    composer.current.passes[2].uniforms.time.value = time;
  }, 1);

  return (
    <>
      {/* Occlusion sphere */}
      <mesh layers={OCCLUSION_LAYER} position={[0, 1.5, -5]}>
        <sphereGeometry args={[3, 32, 32]} />
        <meshBasicMaterial />
      </mesh>

      {/* Occlusion composer */}
      <Effects
        ref={occlusionComposer}
        disableGamma
        disableRender
        args={[gl, occlusionRenderTarget]}
        renderToScreen={false}
      >
        <shaderPass
          uniforms-weight-value={0.4}
          args={[VolumetricLightShader]}
          needsSwap={false}
        />
      </Effects>

      {/* Main composer */}
      <Effects ref={composer} disableRender>
        <shaderPass
          args={[AdditiveBlendingShader]}
          uniforms-tAdd-value={occlusionRenderTarget.texture}
        />
        <shaderPass
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
        />
        <shaderPass
          args={[GrainyShader]}
          uniforms-tDiffuse-value={occlusionRenderTarget.texture}
          uniforms-time-value={0}
          renderToScreen
        />
      </Effects>
    </>
  );
}
