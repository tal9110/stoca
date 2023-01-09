import "./styles.css";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { Leva } from "leva";
import { useThree } from "@react-three/fiber";
import { useFBO } from "@react-three/drei";
import styled from "styled-components";
import { FXAAShader } from "three-stdlib";
import { AdditiveBlendingShader } from "./shaders/AdditiveBlendingShader";
import { VolumetricLightShader } from "./shaders/VolumetricLightShader";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { GrainyShader } from "./shaders/GrainyShader";
import { TrailsShader } from "./shaders/TrailsShader";
import Particles from "./shaders/Particles";
import { Infinite } from "./shaders/Infinite";
import TypeIt from "typeit-react";
import { Howl, Howler } from "howler";
import useStore from "./store";
import { useSpring, animated } from "@react-spring/web";
import Loader from "react-loaders";
import { PulseLoader } from "react-spinners";
import { GrCircleQuestion } from "react-icons/gr";
import { IconContext } from "react-icons";
import { VscQuestion } from "react-icons/vsc";
import { useHover } from "@mantine/hooks";

import Mantine from "./Mantine/Mantine";
import gsap from "gsap";
import {
  Button,
  Image,
  Text,
  Group,
  Center as CenterMantine,
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
import GradientTwo from "./GradientTwo";
import { HiOutlineArrowSmRight } from "react-icons/hi";
import { BsArrowRightShort } from "react-icons/bs";
import { Fog } from "three";
import AudioController from "./AudioController";

extend({ WaterPass, GlitchPass, AfterimagePass });

function App() {
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

  const [response2, setResponse2] = useState("");
  const [focused, setFocused] = useState(false);
  const [value, setValue] = useState("");

  const [userInput, setUserInput] = useState("");
  // const openingStatement =
  //   "The following is a conversation with an AI therapist. The therapist is helpful, creative, clever, very friendly, not shy of digging deeper, and always asks a follow-up question.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling?\nHuman: ";
  // const [prevPrompt, setPrevPrompt] = useState(openingStatement);
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
    // "The following is a conversation with an AI therapist. The therapist is helpful, creative, clever, very friendly, not shy of digging deeper, and always asks a follow-up question.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
    // "The following is a conversation with an AI therapist. The therapist is stoic, helpful, creative, clever, very friendly, gives a piece of wisdom, and asks a follow up question.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
    "The following is a conversation with an AI Stoic Philosopher. The philosopher is helpful, creative, clever, friendly, gives brief stoic advice, and asks deep questions.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
  );
  const [inputValue, setInputValue] = useState("");
  const [firstClick, setFirstClick] = useState(0);
  const [aiOutput, setAiOutput] = useState();
  const [last, setLast] = useState();
  const generateResponse2 = async (inputt) => {
    setFirstClick(firstClick + 1);
    const combined =
      finalPrompt +
      "\nHuman:" +
      inputt +
      // " and I would like some advice on that" +
      "\nAI:";

    // console.log(combined);
    setFocused(true);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: combined,
      temperature: 0.9,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 0.76,
      presence_penalty: 0.75,
      stop: [" Human:", " AI:"],
    });
    const response2 = await openai.createCompletion({
      model: "text-davinci-003",
      prompt:
        "Five different hex value colors that are a color palette for " +
        inputt +
        " , and then on a new line describe that sentiment as either optimistic or pessimistic: \n\n",
      temperature: 0,
      max_tokens: 64,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      stop: [";"],
    });
    // const newTypeIt = (
    //   <TypeIt
    //     className="theHeader"
    //     options={{
    //       afterComplete: () => {
    //         document.querySelector(".ti-cursor").style.display = "none";
    //       },
    //     }}
    //   >
    //     {response.data.choices[0].text}
    //   </TypeIt>
    // );
    // setTypeIts([newTypeIt]);
    // typeIts.shift();
    setAiOutput(response.data.choices[0].text);
    api4.start({
      delay: 200,

      from: {
        opacity: 1,
      },
      to: {
        opacity: 0,
      },
      config: {
        duration: 1500,
      },
      onResolve: () => {
        setLoading(false);
      },
    });

    api3.start({
      delay: 1000,

      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
      config: {
        duration: 1000,
      },
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
    if (
      split[4].trim().includes("Optimistic") ||
      split[4].trim().includes("optimistic")
    ) {
      setWord("optimistic");
      console.log("optimistic success");
    }
    if (
      split[4].trim().includes("Pessimistic") ||
      split[4].trim().includes("pessimistic")
    ) {
      setWord("pessimistic");
      console.log("pessimistic success");
    }
    // console.log(response.data.choices[0].text);
    const appended = combined + response.data.choices[0].text;
    setFinalPrompt(appended);
  };

  const [typeIts, setTypeIts] = useState([]);
  useEffect(() => {
    if (aiOutput === undefined) return;
    const newTypeIt = (
      <TypeIt
        className="theResponse"
        options={{
          afterComplete: () => {
            document.querySelector(".ti-cursor").style.display = "none";
          },
          speed: 60,
        }}
      >
        {aiOutput}
      </TypeIt>
    );
    // console.log(typeIts);

    setTypeIts([...typeIts, newTypeIt]);
    // console.log(typeIts);
  }, [aiOutput]);

  // const generateResponse3 = (inputt) => {
  //   setAiOutput(inputt);
  // };
  const padC = new Howl({
    src: [`/audio/padC.mp3`],
    volume: 0,
    loop: true,
  });
  const padD = new Howl({
    src: [`/audio/padD.mp3`],
    volume: 0,
    loop: true,
  });
  const padF = new Howl({
    src: [`/audio/padF.mp3`],
    volume: 0,
    loop: true,
  });
  const casette = new Howl({
    src: [`/audio/casette.mp3`],
    volume: 0,
    loop: true,
  });
  const arpC = new Howl({
    src: [`/audio/arpC.mp3`],
    volume: 0.5,
    loop: true,
  });
  const arpF = new Howl({
    src: [`/audio/arpF.mp3`],
    volume: 0,
    loop: true,
  });

  let padCRef;
  let padDRef;

  useEffect(() => {
    padF.play();
    padD.play();
    arpF.play();
    arpC.play();
    casette.play();
    casette.fade(0, 0.5, 5000);
    padCRef = padC.play();
    padC.fade(0, 0.5, 15000);
  }, []);

  useEffect(() => {
    if (word === "optimistic") {
    }
    if (word === "pessimistic") {
      console.log("should have worked");
      padC.fade(0.5, 0, 1000);
      // padD.fade(0, 0.5, 3000);
    }
  }, [word]);

  const inputStore = useStore((state) => state.inputStore);
  // const step = useStore((state) => state.step);
  const [firstInput, setFirstInput] = useState(false);
  const [inputHeaderText, setInputHeaderText] = useState("");
  const [enterIncrement, setEnterIncrement] = useState(0);
  useEffect(() => {
    setEnterIncrement(enterIncrement + 1);
    // console.log(step);
    if (inputStore.length > 0) {
      // gsap.to(camera.position, {
      //   z: 20,
      //   duration: 4,
      //   ease: "power1.inOut",
      // });
      setLoading(true);
      // setFirstInput(true);

      api.start({
        delay: 100,

        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
        config: {
          duration: 2000,
        },
        onResolve: () => {
          setFirstInput(true);
        },
      });
      api2.start({
        delay: 100,

        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
        config: {
          duration: 2000,
        },
        onResolve: () => {
          // setInputHeaderText('"' + inputStore + '"');
          setInputHeaderText(inputStore);
        },
      });
      api2.start({
        delay: 2000,

        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
        config: {
          duration: 2000,
        },
      });
      api3.start({
        delay: 0,

        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
        config: {
          duration: 1000,
        },
      });
      api4.start({
        delay: 1500,

        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        },
        config: {
          duration: 1500,
        },
      });

      generateResponse2(inputStore);
    }
  }, [inputStore]);

  const [springs, api] = useSpring(() => ({
    from: { opacity: 0 },
  }));
  const [springs2, api2] = useSpring(() => ({
    from: { opacity: 0 },
  }));
  const [springs3, api3] = useSpring(() => ({
    from: { opacity: 1 },
  }));
  const [springs4, api4] = useSpring(() => ({
    from: { opacity: 1 },
  }));
  const [springs5, api5] = useSpring(() => ({
    from: { opacity: 0 },
  }));

  useEffect(() => {
    api.start({
      delay: 1000,

      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
      config: {
        duration: 7000,
      },
    });
    api5.start({
      delay: 1000,

      from: {
        opacity: 0,
      },
      to: {
        opacity: 1,
      },
      config: {
        duration: 3000,
      },
    });
  }, []);
  const [loading, setLoading] = useState(false);

  return (
    <>
      {/* <CenterMantine> */}

      <Image
        className="wordmark"
        // onMouseOver={({ target }) => (target.style.opacity = 1)}
        // onMouseOut={({ target }) => (target.style.opacity = 0.5)}
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          // left: 0,
          margin: "2rem",
          // opacity: 0.3,
          // padding: "2rem",
          // width: "100%",
        }}
        // pr={"xl"}
        src={"/wordmark.png"}
        width={60}
      ></Image>
      {/* </CenterMantine> */}
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          right: 0,
          padding: "1rem",
        }}
      >
        <ActionIcon color={"dark"} variant="transparent">
          {/* <GrCircleQuestion
              color="white"
              fill="white"
              style={{ color: "white", fill: "white" }}
            /> */}
          <VscQuestion
            className="questionIcon"
            // onMouseOver={({ target }) => (target.style.opacity = 1)}
            // onMouseOut={({ target }) => (target.style.opacity = 0.5)}
            size={25}
            style={{ fill: "white" }}
          />
        </ActionIcon>
      </div>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          padding: "1rem",
          width: "100%",
          textAlign: "center",
        }}
      >
        <CenterMantine>
          <Stack mt={60}>
            {firstInput ? (
              <Container>
                <animated.div style={springs2}>
                  <Text className="theHeaderInput">{inputHeaderText}</Text>
                </animated.div>
              </Container>
            ) : (
              <animated.div style={springs}>
                <TypeIt
                  className="theHeader"
                  options={{
                    afterComplete: () => {
                      document.querySelector(".ti-cursor").style.display =
                        "none";
                    },
                  }}
                >
                  How do you feel right now?
                </TypeIt>
              </animated.div>
            )}
            <Container mt={40}>
              {loading ? (
                <animated.div style={springs4}>
                  <PulseLoader
                    color={"#53504A"}
                    loading={true}
                    size={10}
                    speedMultiplier={0.5}
                  />
                </animated.div>
              ) : (
                <animated.div style={springs3}>
                  {typeIts.map((typeIt, index) => {
                    if (index === typeIts.length - 1) {
                      return <div key={index}>{typeIt}</div>;
                    }
                  })}
                </animated.div>
              )}
            </Container>
          </Stack>
        </CenterMantine>
      </div>
      <animated.div style={springs5}>
        <AudioController />
      </animated.div>
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          padding: "1rem",
          width: "100%",
        }}
      >
        {/* <Mantine /> */}
        {/* <Center> */}
        {/* <Group mt={50}>
          <Text class="line-1 anim-typewriter">
            what are you struggling with today?
          </Text>
        </Group> */}
        <Stack hidden>
          <TextInput
            mt={200}
            label="How are you feeling?"
            // classNames={classes}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            // onKeyPress={handleKeyPress}
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
        </Stack>
        {/* </Center> */}
      </div>
      {/* <Canvas eventPrefix="client" shadows camera={{ position: [1, 0, 0] }}> */}
      <Canvas
        shadows
        // camera={{ position: [0, 0, 4.5], fov: 50 }}
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: false }}
      >
        {/* <fog attach="fog" args={[0x000000, 5, 20]} /> */}
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
            // enterIncrement={enterIncrement}
            firstClick={firstClick}
            colorOne={colorOne}
            colorTwo={colorTwo}
            colorThree={colorThree}
            colorFour={colorFour}
            colorFive={colorFive}
          />
        </group>
        <Env enterIncrement={enterIncrement} />
        {/* <OrbitControls enablePan={false} enableZoom={false} /> */}
        <OrbitControls
          enabled={false}
          // autoRotate
          // autoRotateSpeed={0.5}
          // enableRotate={false}
          // enablePan={false}
          // enableZoom={false}
          // minPolarAngle={Math.PI / 2.1}
          // maxPolarAngle={Math.PI / 2.1}
          // minPolarAngle={Math.PI / 3.1}
          // maxPolarAngle={Math.PI / 2.1}
        />
        {/* <group>
          <Particles />
        </group> */}
      </Canvas>
    </>
  );
}

function Env(props) {
  const [preset, setPreset] = useState("sunset");
  let vec = new THREE.Vector3();
  let enterIncrement = 0;
  useFrame((state) => {
    enterIncrement = props.enterIncrement % 13;

    // console.log(state.camera.position);
    // console.log(state.camera);
    // {x: -6.0358791643389145, y: 3.028888268496038, z: 6.405432772282838}
    // {x: 5.248097238306234, y: 2.5015889415213106, z: 5.4666839498488295}
    // {x: 0, y: 4.332061055971331, z: 6.700236003219422}
    // {x: 0, y: -0.902270925328769, z: 7.929117645891684}
    // {x: 0, y: 2.522576945620514e-15, z: 41.19680788578111}
    // x: 10.830953118825398;
    // y: 0.6206651180632762;
    // z: -0.40251601096885026;
    if (enterIncrement === 2) {
      state.camera.position.lerp(vec.set(0, 3, 15), 0.01);
      state.camera.lookAt(0, 0, 0);
    }
    if (enterIncrement === 3) {
      state.camera.position.lerp(vec.set(15, 0, 12.5), 0.01);
      state.camera.lookAt(0, 0, 0);
    }
    if (enterIncrement === 4) {
      state.camera.position.lerp(vec.set(-15, 0, 12.5), 0.01);
      state.camera.lookAt(0, 0, 0);
    }
    if (enterIncrement === 5) {
      state.camera.position.lerp(
        vec.set(-6.0358791643389145, 3.028888268496038, 6.405432772282838),
        0.01
      );
      state.camera.lookAt(0, 1, 0);
    }
    if (enterIncrement === 6) {
      state.camera.position.lerp(
        vec.set(5.248097238306234, 2.5015889415213106, 5.4666839498488295),
        0.01
      );
      state.camera.lookAt(0, 1, 0);
    }
    if (enterIncrement === 7) {
      state.camera.position.lerp(
        vec.set(0, 4.332061055971331, 6.700236003219422),
        0.01
      );
      state.camera.lookAt(0, 1, 0);
    }
    if (enterIncrement === 8) {
      state.camera.position.lerp(
        vec.set(0, -0.902270925328769, 7.929117645891684),
        0.01
      );
      state.camera.lookAt(0, 1, 0);
    }
    if (enterIncrement === 9) {
      state.camera.position.lerp(
        vec.set(0, 2.522576945620514e-15, 41.19680788578111),
        0.01
      );
      state.camera.lookAt(0, 0, 0);
    }
    if (enterIncrement === 10) {
      state.camera.position.lerp(
        vec.set(10.830953118825398, 0.6206651180632762, -0.40251601096885026),
        0.01
      );
      state.camera.lookAt(0, 1, 0);
    }
    if (enterIncrement === 11) {
      state.camera.position.lerp(
        vec.set(0, -0.902270925328769, 7.929117645891684),
        0.01
      );
      state.camera.lookAt(0, 0, 0);
    }
    if (enterIncrement === 12) {
      state.camera.position.lerp(
        vec.set(-10.830953118825398, 0.6206651180632762, -0.40251601096885026),
        0.01
      );
      state.camera.lookAt(0, 1, 0);
    }
  });
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
  // const { camera } = useThree();

  // useEffect(() => {
  //   if (enterIncrement === 2) {
  //     gsap.to(camera.position, {
  //       z: 20,
  //       duration: 3,
  //       ease: "power1.out",
  //     });
  //   }
  // }, [enterIncrement]);
  // useFrame((state, delta) => {
  //   // if (enterIncrement === 2) {
  //   //   gsap.to(state.camera.position, {
  //   //     z: 20,
  //   //     duration: 3,
  //   //     ease: "power1.out",
  //   //   });
  //   // }

  // });

  // useFrame((state, delta) => {
  //   x += delta;
  //   // console.log(randomLight.current);
  //   randomLight.current.position.x = Math.sin(x);
  // });

  // const moveCamera = () => {
  //   gsap.to(camera.position, {
  //     // x: -8,
  //     z: -20,
  //     duration: 3,
  //     ease: "power1.out",
  //   });
  // };
  // let y = 0;
  // useFrame((state, delta) => {
  //   x += delta / 4;
  //   y += delta /2;
  //   camera.position.x = Math.sin(x) * 5;
  //   camera.position.z = Math.cos(y) * 3 + 3;
  // });

  return (
    <>
      <AccumulativeShadows
        // temporal
        frames={100}
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
            // position={[7, 6, 2]}
            position={[0, 6, -7]}
            bias={0.001}
          />
        </group>
      </AccumulativeShadows>

      <group scale={20}>
        <GradientTwo
          firstClick={props.firstClick}
          shape={"sphere"}
          // opacity={0.5}
          // opacity={0.5}
          // opacity={0}
          colorOne={props.colorOne}
          colorTwo={props.colorTwo}
          colorThree={props.colorThree}
          colorFour={props.colorFour}
          colorFive={props.colorFive}
        />
      </group>
      <group>
        <GradientTwo
          shape={"statue"}
          opacity={1}
          colorOne={props.colorOne}
          colorTwo={props.colorTwo}
          colorThree={props.colorThree}
          colorFour={props.colorFour}
          colorFive={props.colorFive}
        />
      </group>
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

const DEFAULT_LAYER = 0;
const OCCLUSION_LAYER = 1;

function Postpro() {
  const { gl, camera, size } = useThree();
  const occlusionRenderTarget = useFBO();
  const occlusionComposer = useRef();
  const composer = useRef();
  let x = 0;
  // useEffect(() => {
  //   gsap.to(occlusionComposer.current.passes[1].uniforms.weight, {
  //     value: 0.4,
  //     duration: 8,
  //     // ease: "power1.out",
  //   });
  // }, []);
  useFrame((state, delta) => {
    x += delta / 2;
    camera.layers.set(OCCLUSION_LAYER);
    occlusionComposer.current.render();
    camera.layers.set(DEFAULT_LAYER);
    // console.log(composer.current.passes[4].uniforms);
    // console.log(occlusionComposer.current.passes[1].uniforms);
    // occlusionComposer.current.passes[1].uniforms.weight.value =
    //   Math.sin(x / 2 + 0.5) / 5;
    // gsap.to(occlusionComposer.current.passes[1].uniforms.weight, {
    //   value: 0.5,
    //   duration: 6,
    //   ease: "power1.out",
    // });
    // decay: {
    //   value: 0.95;
    // }
    // density: {
    //   value: 0.8;
    // }
    // exposure: {
    //   value: 0.1;
    // }
    // lightPosition: {
    //   value: Vector2;
    // }
    // samples: {
    //   value: 50;
    // }
    // tDiffuse: {
    //   value: Texture;
    // }
    // weight: {
    //   value: 0.5;
    // }

    // composer.current.passes[4].uniforms.time.value += delta / 2;
    // composer.current.passes[5].uniforms.time.value += delta;

    // composer.current.passes[4].uniforms.tDiffuse.value =
    //   occlusionRenderTarget.texture;
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
        <shaderPass
          uniforms-weight-value={0.4}
          args={[VolumetricLightShader]}
          needsSwap={false}
        />
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
        {/* <shaderPass
          args={[TrailsShader]}
          uniforms-tDiffuse-value={occlusionRenderTarget.texture}
          // uniforms-amount-value={0.5}
          uniforms-time-value={0}
          renderToScreen
        /> */}
        <shaderPass
          args={[GrainyShader]}
          uniforms-tDiffuse-value={occlusionRenderTarget.texture}
          // uniforms-amount-value={0.5}
          uniforms-time-value={0}
          renderToScreen
        />

        {/* <shaderPass
          args={[Infinite]}
          // uniforms-tDiffuse-value={occlusionRenderTarget.texture}
          // uniforms-amount-value={0.5}
          uniforms-tMap-value={occlusionRenderTarget.texture}
          uniforms-time-value={0}
          renderToScreen
        /> */}
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

export default App;
