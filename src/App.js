import "./styles.css";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { Leva } from "leva";
import { useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import styled from "styled-components";
import { FXAAShader } from "three-stdlib";
import { AdditiveBlendingShader } from "./AdditiveBlendingShader";
import { VolumetricLightShader } from "./VolumetricLightShader";
import {
  Button,
  Image,
  Text,
  Group,
  // Center,
  Container,
  ActionIcon,
  Stack,
  // Input,
  TextInput,
  ColorSwatch,
  createStyles,
} from "@mantine/core";
import {
  useGLTF,
  MeshTransmissionMaterial,
  OrbitControls,
} from "@react-three/drei";
import { WaterPass, GlitchPass } from "three-stdlib";
import * as THREE from "three";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import all from "gsap/all";
import { isMobile } from "react-device-detect";
import { Configuration, OpenAIApi } from "openai";
import {
  Clone,
  AccumulativeShadows,
  RandomizedLight,
  Html,
  // Text,
  Effects,
  Environment,
  Center,
  Edges,
} from "@react-three/drei";
import { ControlledInput } from "./ControlledInput";
import Gradient from "./Gradient";
import { StripeGradient } from "./StripeGradient";
import GradientTwo from "./GradientTwo";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { BsArrowRightShort } from "react-icons/bs";
// import Puzzle from "./Puzzle";

extend({ WaterPass, GlitchPass });

const useStyles = createStyles((theme, { floating }) => ({
  root: {
    position: "relative",
  },

  label: {
    position: "absolute",
    zIndex: 2,
    top: 7,
    left: theme.spacing.sm,
    pointerEvents: "none",
    color: floating
      ? theme.colorScheme === "dark"
        ? theme.white
        : theme.white
      : theme.colorScheme === "dark"
      ? theme.white
      : theme.white,
    transform: floating
      ? `translate(-${theme.spacing.xs / 2}px, -28px)`
      : `translate(-${theme.spacing.xs / 2}px, -28px)`,
    fontSize: floating ? theme.fontSizes.xs : theme.fontSizes.xs,
    fontWeight: floating ? 400 : 400,
  },

  required: {
    transition: "opacity 150ms ease",
    opacity: floating ? 1 : 0,
  },

  input: {
    "&::placeholder": {
      transition: "color 150ms ease",
      color: !floating ? "transparent" : undefined,
    },
  },
}));

function App() {
  useLayoutEffect(() => {
    const gradient = new StripeGradient();
    gradient.initGradient("#gradient-canvas");
  }, []);
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  // const [prompt, setPrompt] = useState("");
  const [colorOne, setColorOne] = useState("#F2F2F2");
  const [colorTwo, setColorTwo] = useState("#FECF9E");
  const [colorThree, setColorThree] = useState("#F7A277");
  const [colorFour, setColorFour] = useState("#D8A8A8");
  const [colorFive, setColorFive] = useState("#A8D9D8");
  const [word, setWord] = useState("");

  // const generateResponse = async () => {
  //   setFocused(true);
  // const response = await openai.createCompletion({
  //   model: "text-davinci-003",
  //   // prompt:
  //   //   "The CSS code for a color like " + prompt + ":\n\nbackground-color: #",
  //   prompt:
  //     "Five different hex value colors that are a color palette for " +
  //     prompt +
  //     " , and then on a new line describe the overall palette as either light or dark: \n\n",
  //   temperature: 0,
  //   max_tokens: 64,
  //   top_p: 1.0,
  //   frequency_penalty: 0.0,
  //   presence_penalty: 0.0,
  //   stop: [";"],
  // });

  // console.log(response.data.choices[0].text, "response");
  // let split = response.data.choices[0].text
  //   .split(",")
  //   .map((color) => color.split("#")[1]);
  // // console.log(split, "split");
  // // console.log(split[0].slice(0, 6));
  // // console.log(split[1]);
  // // console.log(split[2]);
  // // console.log(split[4]);
  // // console.log(split[4].trim().split(" ")[1]);
  // // console.log(split[4]);
  // setColorOne("#" + split[0].slice(0, 6));
  // setColorTwo("#" + split[1].slice(0, 6));
  // setColorThree("#" + split[2].slice(0, 6));
  // setColorFour("#" + split[3].slice(0, 6));
  // setColorFive("#" + split[4].slice(0, 6));
  // if (split[4].trim().includes("Light")) {
  //   setWord("light");
  //   console.log("light success");
  // }
  // if (split[4].trim().includes("Dark")) {
  //   setWord("dark");
  //   console.log("dark success");
  // }
  // };
  const [response2, setResponse2] = useState("");
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");
  const { classes } = useStyles({
    floating: value.trim().length !== 0 || focused,
  });
  const [userInput, setUserInput] = useState("");
  const openingStatement =
    "The following is a conversation with an AI therapist. The therapist is helpful, creative, clever, very friendly, not shy of digging deeper, and always asks a follow-up question.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling?\nHuman: ";
  const [prevPrompt, setPrevPrompt] = useState(openingStatement);
  const [prompt, setPrompt] = useState("");

  // const generateResponse2 = async () => {
  //   setFocused(true);
  //   const response = await openai.createCompletion({
  //     model: "text-davinci-003",
  //     prompt:
  //       "The following is a conversation with an AI therapist. The therapist is helpful, creative, clever, very friendly, not shy of digging deeper, and always asks a follow-up question.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling?\nHuman: " +
  //       prompt,
  //     temperature: 0.9,
  //     max_tokens: 350,
  //     top_p: 1,
  //     frequency_penalty: 0.76,
  //     presence_penalty: 0.75,
  //     stop: [" Human:", " AI:"],
  //   });

  //   setResponse2(response.data.choices[0].text);
  // };
  const [finalPrompt, setFinalPrompt] = useState(
    "The following is a conversation with an AI therapist. The therapist is helpful, creative, clever, very friendly, not shy of digging deeper, and always asks a follow-up question.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
  );
  const [inputValue, setInputValue] = useState("");
  const generateResponse2 = async () => {
    // console.log(inputValue);
    const combined =
      finalPrompt +
      "\nHuman:" +
      inputValue +
      " and i need some advice" +
      "\nAI:";

    // console.log(combined);
    setFocused(true);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: combined,
      temperature: 0.9,
      max_tokens: 350,
      top_p: 1,
      frequency_penalty: 0.76,
      presence_penalty: 0.75,
      stop: [" Human:", " AI:"],
    });
    const response2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "Five different hex value colors that are a color palette for " +
        inputValue +
        " , and then on a new line describe the overall palette as either light or dark: \n\n",
      temperature: 0,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: [";"],
    });
    // console.log(response2.data.choices[0].text, "response2");
    let split = response2.data.choices[0].text
      .split(",")
      .map((color) => color.split("#")[1]);

    setColorOne("#" + split[0].slice(0, 6));
    setColorTwo("#" + split[1].slice(0, 6));
    setColorThree("#" + split[2].slice(0, 6));
    setColorFour("#" + split[3].slice(0, 6));
    setColorFive("#" + split[4].slice(0, 6));
    // console.log("#" + split[0].slice(0, 6));
    if (split[4].trim().includes("Light")) {
      setWord("light");
      console.log("light success");
    }
    if (split[4].trim().includes("Dark")) {
      setWord("dark");
      console.log("dark success");
    }
    // console.log(response.data.choices[0].text);
    const appended = combined + response.data.choices[0].text;
    setFinalPrompt(appended);
  };

  return (
    <>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          padding: "1rem",
          width: "100%",
        }}
      >
        {/* <Center> */}
        {/* <Stack>
          <TextInput
            mt={200}
            label="How are you feeling?"
            classNames={classes}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            radius="xl"
            size="md"
            placeholder="like a bright blue sky at dusk..."
            autoComplete="nope"
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            rightSection={
              <ActionIcon
                style={{ color: "white" }}
                mr={5}
                onClick={() => generateResponse2()}
                size={29}
                radius="xl"
                variant="filled"
                color={"blue"}
              >
                <BsArrowRightShort size={22} stroke={1.5} color="white" />
              </ActionIcon>
            }
          />

          <Group>
            <ColorSwatch size={40} color={colorOne} />
            <ColorSwatch size={40} color={colorTwo} />
            <ColorSwatch size={40} color={colorThree} />
            <ColorSwatch size={40} color={colorFour} />
            <ColorSwatch size={40} color={colorFive} />
          </Group>
          <Text size={"xl"} weight={"bolder"}>
            {finalPrompt}
          </Text>
        </Stack> */}
        {/* </Center> */}
      </div>

      {/* <Canvas eventPrefix="client" shadows camera={{ position: [1, 0, 0] }}> */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 4.5], fov: 50 }}
        gl={{ antialias: false }}
      >
        {/* <color attach="background" args={["#f0f0f"]} /> */}
        {/* <group scale={1}><Puzzle /></group> */}
        {/* <ambientLight intensity={1} /> */}
        {/* <spotLight
          position={[10, 10, 10]}
          angle={0.5}
          penumbra={1}
          castShadow
        />
        <pointLight position={[-10, 0, -10]} intensity={2} /> */}
        {/* <Input  /> */}
        {/* <group position={[0.4, 0, 0]}>
          <Text
            position={[-1.2, -0.022, 0]}
            anchorX="0px"
            font="/Inter-Regular.woff"
            fontSize={0.335}
            letterSpacing={-0.0}
          >
            {prompt}
            <meshStandardMaterial color="black" />
          </Text>
          <mesh position={[0, -0.022, 0]} scale={[5, 0.48, 1]}>
            <planeGeometry />
            <meshBasicMaterial transparent opacity={0.3} depthWrite={false} />
          </mesh>
          <Html transform>
            <ControlledInput
              type={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              value={prompt}
            />
          </Html>
        </group> */}
        {/* <group position={[0, -1, -2]}> */}
        {/* <group position={[0, -10, -2]}> */}
        {/* <Center top rotation={[0, -Math.PI / 2, 0]}> */}
        {/* <Model scale={1.25} /> */}
        {/* <group scale={0.4} position={[0, -100, 0]}> */}
        {/* <group position={[0, -100, 0]}> */}
        {/* <GradientTwo
          colorOne={colorOne}
          colorTwo={colorTwo}
          colorThree={colorThree}
          colorFour={colorFour}
          colorFive={colorFive}
        /> */}
        {/* </group> */}
        {/* </Center> */}

        {/* <Sphere scale={0.25} position={[-3, 0, 2]} />
          <Sphere scale={0.25} position={[-4, 0, -2]} />
          <Sphere scale={0.65} position={[3.5, 0, -2]} /> */}
        {/* <Text position={[0, 4, -6]} font="/Inter-Regular.woff" fontSize={2}>
            describe a color
            <meshStandardMaterial color="#aaa" toneMapped={false} />
          </Text> */}
        {/* <AccumulativeShadows temporal frames={100} alphaTest={0.8} scale={12}>
            <RandomizedLight
              amount={8}
              radius={4}
              ambient={0.5}
              intensity={1}
              position={[2.5, 5, -10]}
            />
          </AccumulativeShadows> */}
        {/* </group> */}
        {/* <Environment preset="city" /> */}
        <Postpro />
        {/* <Rig /> */}
        <group position={[0.2, -1.5, 0]}>
          <Sphere2
            colorOne={colorOne}
            colorTwo={colorTwo}
            colorThree={colorThree}
            colorFour={colorFour}
            colorFive={colorFive}
          />
        </group>
        <Env />
        {/* <OrbitControls enablePan={false} enableZoom={false} /> */}
        <OrbitControls
          // autoRotate
          autoRotateSpeed={2}
          // enablePan={false}
          // enableZoom={false}
          minPolarAngle={Math.PI / 2.1}
          maxPolarAngle={Math.PI / 2.1}
          // minPolarAngle={Math.PI / 3.1}
          // maxPolarAngle={Math.PI / 2.1}
        />
      </Canvas>
    </>
  );
}

function Env() {
  const [preset, setPreset] = useState("sunset");
  // You can use the "inTransition" boolean to react to the loading in-between state,
  // For instance by showing a message
  // const [inTransition, startTransition] = useTransition();
  // const { blur } = useControls({
  //   blur: { value: 0.65, min: 0, max: 1 },
  //   preset: {
  //     value: preset,
  //     options: [
  //       "sunset",
  //       "dawn",
  //       "night",
  //       "warehouse",
  //       "forest",
  //       "apartment",
  //       "studio",
  //       "city",
  //       "park",
  //       "lobby",
  //     ],
  //     // If onChange is present the value will not be reactive, see https://github.com/pmndrs/leva/blob/main/docs/advanced/controlled-inputs.md#onchange
  //     // Instead we transition the preset value, which will prevents the suspense bound from triggering its fallback
  //     // That way we can hang onto the current environment until the new one has finished loading ...
  //     onChange: (value) => startTransition(() => setPreset(value)),
  //   },
  // });
  return <Environment preset={"night"} background blur={0.65} />;
}
function Sphere2(props) {
  // const { roughness } = useControls({
  //   roughness: { value: 1, min: 0, max: 1 },
  // });

  const randomLight = useRef();
  let x = 0;
  // useFrame((state, delta) => {
  //   x += delta;
  //   // console.log(randomLight.current);
  //   randomLight.current.position.x = Math.sin(x);
  // });

  return (
    <>
      <AccumulativeShadows
        temporal
        frames={200}
        color="purple"
        colorBlend={0.5}
        opacity={1}
        scale={10}
        alphaTest={0.85}
      >
        <group ref={randomLight}>
          <RandomizedLight
            amount={8}
            radius={3}
            ambient={0.5}
            position={[7, 6, 2]}
            bias={0.001}
          />
        </group>
      </AccumulativeShadows>
      <group scale={20}>
        <GradientTwo
          shape={"sphere"}
          opacity={0.5}
          colorOne={props.colorOne}
          colorTwo={props.colorTwo}
          colorThree={props.colorThree}
          colorFour={props.colorFour}
          colorFive={props.colorFive}
        />
      </group>
      <GradientTwo
        shape={"statue"}
        opacity={1}
        colorOne={props.colorOne}
        colorTwo={props.colorTwo}
        colorThree={props.colorThree}
        colorFour={props.colorFour}
        colorFive={props.colorFive}
      />
      {/* <group position={[-1, 0, 0]}>
        <GradientTwo
          shape={"statue"}
          opacity={1}
          colorOne={props.colorOne}
          colorTwo={props.colorTwo}
          colorThree={props.colorThree}
          colorFour={props.colorFour}
          colorFive={props.colorFive}
        />
      </group> */}
      <Center top>
        <mesh castShadow visible={false}>
          <sphereGeometry args={[0.74, 64, 64]} />
          <meshStandardMaterial
            transparent
            opacity={0}
            metalness={1}
            roughness={1}
          />
        </mesh>
      </Center>
    </>
  );
}

// function Postpro() {
//   const ref = useRef();
//   // useFrame((state) => (ref.current.time = state.clock.elapsedTime * 3));
//   return (
//     <Effects>
//       {/* <waterPass ref={ref} factor={0.4} /> */}
//       {/* <glitchPass /> */}
//     </Effects>
//   );
// }
const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;

function Postpro() {
  const { gl, camera, size } = useThree();
  const occlusionRenderTarget = useFBO();
  const occlusionComposer = useRef();
  const composer = useRef();
  useFrame(() => {
    camera.layers.set(OCCLUSION_LAYER);
    occlusionComposer.current.render();
    camera.layers.set(DEFAULT_LAYER);
    composer.current.render();
  }, 1);
  return (
    <>
      <mesh layers={OCCLUSION_LAYER} position={[0, 1.5, -5]}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial />
      </mesh>
      <Effects
        ref={occlusionComposer}
        disableGamma
        disableRender
        args={[gl, occlusionRenderTarget]}
        renderToScreen={false}
      >
        <shaderPass args={[VolumetricLightShader]} needsSwap={false} />
      </Effects>
      <Effects ref={composer} disableRender>
        <shaderPass
          args={[AdditiveBlendingShader]}
          uniforms-tAdd-value={occlusionRenderTarget.texture}
        />
        <shaderPass
          args={[FXAAShader]}
          uniforms-resolution-value={[1 / size.width, 1 / size.height]}
          renderToScreen
        />
      </Effects>
    </>
  );
}

function Rig({ vec = new THREE.Vector3() }) {
  useFrame((state) => {
    state.camera.position.lerp(vec.set(1 + state.pointer.x, 0.5, 3), 0.01);
    state.camera.lookAt(0, 0, 0);
  });
}

function Sphere(props) {
  return (
    <Center top {...props}>
      <mesh castShadow receiveShadow>
        <sphereGeometry args={[5, 64, 64]} />
        {/* <meshStandardMaterial /> */}
        <MeshTransmissionMaterial
          roughness={0}
          resolution={2048}
          background={new THREE.Color("#334e3b")}
          clearcoat={1}
          samples={6}
          refraction={1.15}
          rgbShift={0.25}
          noise={0.04}
          contrast={2}
          saturation={1.0}
          color="#c9ffa1"
          bg="#334e3b"
        />
      </mesh>
    </Center>
  );
}

// function Model(props) {
//   const ref = useRef();
//   const { scene, materials } = useGLTF(
//     "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/bunny/model.gltf"
//   );
//   useFrame((state) => {
//     console.log(ref);
//   });
//   return (
//     <Clone castShadow receiveShadow object={scene} {...props}>
//       <meshBasicMaterial color="#000000" />
//     </Clone>
//   );
// }

// function Input(props) {
//   const [text, set] = useState("a blue sky at dusk...");
//   return (
//     <group {...props}>
//       <Text
//         position={[-1.2, -0.022, 0]}
//         anchorX="0px"
//         font="/Inter-Regular.woff"
//         fontSize={0.335}
//         letterSpacing={-0.0}
//       >
//         {text}
//         <meshStandardMaterial color="black" />
//       </Text>
//       <mesh position={[0, -0.022, 0]} scale={[5, 0.48, 1]}>
//         <planeGeometry />
//         <meshBasicMaterial transparent opacity={0.3} depthWrite={false} />
//       </mesh>
//       <Html transform>
//         <ControlledInput
//           type={text}
//           onChange={(e) => set(e.target.value)}
//           value={text}
//         />
//       </Html>
//     </group>
//   );
// }

const Main = styled.main`
  position: relative;
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  @media only screen and (max-width: 1200px) {
    flex-direction: column;
  }
`;

export default App;
