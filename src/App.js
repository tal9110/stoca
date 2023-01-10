import "./styles.css";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlendingShader } from "./shaders/AdditiveBlendingShader";
import { VolumetricLightShader } from "./shaders/VolumetricLightShader";
import { AfterimagePass } from "three/examples/jsm/postprocessing/AfterimagePass";
import { GrainyShader } from "./shaders/GrainyShader";
import TypeIt from "typeit-react";
import useStore from "./store";
import { useSpring, animated } from "@react-spring/web";
import { PulseLoader } from "react-spinners";
import AudioController from "./AudioController";
import AudioController2 from "./AudioController2";
import GradientTwo from "./GradientTwo";
import { Configuration, OpenAIApi } from "openai";
import { WaterPass, GlitchPass, FXAAShader } from "three-stdlib";
import {
  Image,
  Text,
  Group,
  Center as CenterMantine,
  Container,
  ActionIcon,
  Stack,
  TextInput,
  ColorSwatch,
  Modal,
} from "@mantine/core";
import * as THREE from "three";
import { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import {
  AccumulativeShadows,
  RandomizedLight,
  Effects,
  Environment,
  Center,
  useFBO,
} from "@react-three/drei";
import { VscGithub, VscQuestion } from "react-icons/vsc";
import { BsFillArrowRightCircleFill, BsArrowRightShort } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

extend({ WaterPass, GlitchPass, AfterimagePass });

function App() {
  const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const [colorOne, setColorOne] = useState("#F2F2F2");
  const [colorTwo, setColorTwo] = useState("#FECF9E");
  const [colorThree, setColorThree] = useState("#F7A277");
  const [colorFour, setColorFour] = useState("#D8A8A8");
  const [colorFive, setColorFive] = useState("#A8D9D8");
  const [word, setWord] = useState("");

  const [focused, setFocused] = useState(false);

  const [finalPrompt, setFinalPrompt] = useState(
    "The following is a conversation with an AI Stoic Philosopher. The philosopher is helpful, creative, clever, friendly, gives brief stoic advice, and asks deep questions.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
  );
  const [inputValue, setInputValue] = useState("");
  const [firstClick, setFirstClick] = useState(0);
  const [aiOutput, setAiOutput] = useState();
  const generateResponse2 = async (inputt) => {
    setFirstClick(firstClick + 1);
    const combined = finalPrompt + "\nHuman:" + inputt + "\nAI:";

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
    let split = response2.data.choices[0].text
      .split(",")
      .map((color) => color.split("#")[1]);

    setColorOne("#" + split[0].slice(0, 6));
    setColorTwo("#" + split[1].slice(0, 6));
    setColorThree("#" + split[2].slice(0, 6));
    setColorFour("#" + split[3].slice(0, 6));
    setColorFive("#" + split[4].slice(0, 6));
    if (
      split[4].trim().includes("Optimistic") ||
      split[4].trim().includes("optimistic")
    ) {
      setWord("optimistic");
    }
    if (
      split[4].trim().includes("Pessimistic") ||
      split[4].trim().includes("pessimistic")
    ) {
      setWord("pessimistic");
    }
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

    setTypeIts([...typeIts, newTypeIt]);
  }, [aiOutput]);

  const inputStore = useStore((state) => state.inputStore);
  const [firstInput, setFirstInput] = useState(false);
  const [inputHeaderText, setInputHeaderText] = useState("");
  const [enterIncrement, setEnterIncrement] = useState(0);
  useEffect(() => {
    setEnterIncrement(enterIncrement + 1);
    if (inputStore.length > 0) {
      setLoading(true);

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

  const [opened, setOpened] = useState(false);
  useEffect(() => {
    if (isMobile) {
      setOpened(true);
      setModalSize("100%");
      setModalFont(18);
    }
  }, [isMobile]);
  const [about, setAbout] = useState(false);
  const [modalSize, setModalSize] = useState("50%");
  const [modalFont, setModalFont] = useState(26);

  return (
    <>
      <Modal
        size={modalSize}
        overlayOpacity={0.9}
        overlayBlur={5}
        overlayColor="rgba(83, 80, 74, 1)"
        centered
        opened={about}
        onClose={() => setAbout(false)}
        transition="fade"
        transitionDuration={2000}
        transitionTimingFunction="ease"
        exitTransitionDuration={2000}
      >
        <CenterMantine mt={30}>
          <Stack spacing="xl" align="center">
            <Image src="/logo.png" width={60} mb={20} />

            <div style={{ fontSize: modalFont }} className="mobileModal">
              Stoca analyzes your conversation with a stoic philosopher AI and
              changes the colors & music to reflect your mood in real time.
            </div>
            {"\n"}
            <div style={{ width: "50%" }}>
              <div style={{ fontSize: 23 }} className="mobileModal">
                Created by Tal Halperin
              </div>
              <CenterMantine mt={10} mb={20}>
                <Group spacing={30}>
                  <ActionIcon
                    onClick={() =>
                      (window.location = "mailto:tal9110@gmail.com")
                    }
                  >
                    <MdOutlineMail size={30} style={{ fill: "#A8A28F" }} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() =>
                      window.open("http://github.com/tal9110", "_blank")
                    }
                  >
                    <VscGithub size={30} style={{ fill: "#A8A28F" }} />
                  </ActionIcon>
                  <ActionIcon
                    onClick={() =>
                      window.open(
                        "http://www.linkedin.com/in/tal-halperin",
                        "_blank"
                      )
                    }
                  >
                    <FaLinkedin size={30} style={{ fill: "#A8A28F" }} />
                  </ActionIcon>
                </Group>
              </CenterMantine>
            </div>
            <div style={{ fontSize: 13 }} className="mobileModal">
              This web experiment harnesses the technology of OpenAI's ChatGPT3
              API and React Three Fiber. You can find the code{" "}
              <u
                style={{ cursor: "pointer" }}
                onClick={() =>
                  window.open("http://github.com/tal9110", "_blank")
                }
              >
                here
              </u>
            </div>
          </Stack>
        </CenterMantine>
      </Modal>
      {isMobile && (
        <Modal
          overlayOpacity={0.55}
          overlayBlur={3}
          withCloseButton={false}
          centered
          opened={opened}
          onClose={() => setOpened(false)}
          transition="fade"
          transitionDuration={600}
          transitionTimingFunction="ease"
          exitTransitionDuration={600}
        >
          <CenterMantine>
            <Stack align="center">
              <div className="mobileModal">
                For the full audio-immersive experience visit stoca on desktop
              </div>
              <BsFillArrowRightCircleFill
                onClick={() => setOpened(false)}
                style={{ fill: "#A8A28F" }}
                size={20}
              />
            </Stack>
          </CenterMantine>
        </Modal>
      )}
      {!isMobile && <AudioController2 word={word} />}

      <Image
        className="wordmark"
        sx={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          margin: "2rem",
        }}
        src={"/wordmark.png"}
        width={60}
      />
      <div
        style={{
          position: "absolute",
          zIndex: 1,
          bottom: 0,
          right: 0,
          padding: "1rem",
        }}
      >
        <Group>
          <ActionIcon color={"dark"} variant="transparent">
            <VscQuestion
              onClick={() => setAbout(true)}
              className="questionIcon"
              size={25}
              style={{ fill: "white" }}
            />
          </ActionIcon>
        </Group>
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
        <Stack hidden>
          <TextInput
            mt={200}
            label="How are you feeling?"
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
        </Stack>
      </div>
      <Canvas
        shadows
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: false }}
      >
        {!isMobile && <Postpro />}

        <group position={[0.2, -1.5, 0]}>
          <Sphere2
            firstClick={firstClick}
            colorOne={colorOne}
            colorTwo={colorTwo}
            colorThree={colorThree}
            colorFour={colorFour}
            colorFive={colorFive}
          />
        </group>
        <Env enterIncrement={enterIncrement} />
      </Canvas>
    </>
  );
}

function Env(props) {
  let vec = new THREE.Vector3();
  let enterIncrement = 0;
  useFrame((state) => {
    enterIncrement = props.enterIncrement % 13;

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

  return <Environment preset={"night"} background blur={0.65} />;
}
function Sphere2(props) {
  const randomLight = useRef();
  let x = 0;

  return (
    <>
      <AccumulativeShadows
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
            position={[0, 6, -7]}
            bias={0.001}
          />
        </group>
      </AccumulativeShadows>

      <group scale={20}>
        <GradientTwo
          firstClick={props.firstClick}
          shape={"sphere"}
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

  useFrame((state, delta) => {
    x += delta / 2;
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

export default App;
