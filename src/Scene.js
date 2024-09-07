import React, { useRef } from "react";
import { AccumulativeShadows, RandomizedLight } from "@react-three/drei";
import GradientBackground from "./GradientBackground";
import Statue from "./Statue";

export default function Scene({
  firstClick,
  colorOne,
  colorTwo,
  colorThree,
  colorFour,
  colorFive,
}) {
  const randomLight = useRef();

  return (
    <>
      {/* Shadows */}
      <AccumulativeShadows
        frames={100}
        color="purple"
        colorBlend={0.5}
        opacity={1}
        scale={10}
        alphaTest={0.85}
      >
        <RandomizedLight
          ref={randomLight}
          amount={7}
          radius={3}
          ambient={0.4}
          position={[0, 6, -7]}
          bias={0.001}
        />
      </AccumulativeShadows>

      {/* Background */}
      <group scale={20}>
        <GradientBackground
          firstClick={firstClick}
          colorOne={colorOne}
          colorTwo={colorTwo}
          colorThree={colorThree}
          colorFour={colorFour}
          colorFive={colorFive}
        />
      </group>

      {/* Statue */}
      <Statue />
    </>
  );
}
