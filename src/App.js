import "./styles.css";
import { Canvas } from "@react-three/fiber";
import useStore from "./store";
import { useSpring, animated } from "@react-spring/web";
import { PulseLoader } from "react-spinners";
import InputBar from "./InputBar";
import AudioController from "./AudioController";
import { Configuration, OpenAIApi } from "openai";
import {
  Image,
  Text,
  Group,
  Center as CenterMantine,
  Container,
  ActionIcon,
  Stack,
  Modal,
} from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { isMobile } from "react-device-detect";
import { VscGithub, VscQuestion } from "react-icons/vsc";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";
import Env from "./Env";
import Scene from "./Scene";
import Postproduction from "./Postproduction";
import TypeIt from "typeit-react";

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

  const [finalPrompt, setFinalPrompt] = useState(
    "The following is a conversation with an AI Stoic Philosopher. The philosopher is helpful, creative, clever, friendly, gives brief stoic advice, and asks deep questions.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
  );
  const [firstClick, setFirstClick] = useState(0);
  const [aiOutput, setAiOutput] = useState();
  const inputStore = useStore((state) => state.inputStore);
  const [firstInput, setFirstInput] = useState(false);
  const [inputHeaderText, setInputHeaderText] = useState("");
  const [enterIncrement, setEnterIncrement] = useState(0);
  const [loading, setLoading] = useState(false);
  const [opened, setOpened] = useState(false);
  const [about, setAbout] = useState(false);
  const [modalSize, setModalSize] = useState("50%");
  const [modalFont, setModalFont] = useState(26);
  const [typeIts, setTypeIts] = useState([]);

  const generateResponse2 = async (inputt) => {
    setFirstClick(firstClick + 1);
    const combined = finalPrompt + "\nHuman:" + inputt + "\nAI:";

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

  useEffect(() => {
    if (isMobile) {
      setOpened(true);
      setModalSize("100%");
      setModalFont(18);
    }
  }, [isMobile]);

  return (
    <>
      {/* React Three Fiber Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 0, 6.5], fov: 50 }}
        gl={{ antialias: false }}
      >
        <group position={[0.2, -1.5, 0]}>
          <Scene
            firstClick={firstClick}
            colorOne={colorOne}
            colorTwo={colorTwo}
            colorThree={colorThree}
            colorFour={colorFour}
            colorFive={colorFive}
          />
        </group>
        <Env enterIncrement={enterIncrement} />
        {!isMobile && <Postproduction />}
      </Canvas>

      {/* Wordmark and Question Mark */}
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

      {/* Header */}
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

      {/* Input Bar */}
      <animated.div style={springs5}>
        <InputBar />
      </animated.div>

      {/* About  */}
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
              Stoca takes you on a reflective journey with a stoic philosopher
              AI while changing the colors & music to reflect your mood in real
              time
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
      {/* Audio Controller */}
      {!isMobile && <AudioController word={word} />}

      {/* Modal to display if user is on mobile */}
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
    </>
  );
}

export default App;
