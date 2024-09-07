import React, { useState, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import OpenAI from "openai";
import { useSpring, animated } from "@react-spring/web";
import { PulseLoader } from "react-spinners";
import { isMobile } from "react-device-detect";
import TypeIt from "typeit-react";
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
import { VscGithub, VscQuestion } from "react-icons/vsc";
import { BsFillArrowRightCircleFill } from "react-icons/bs";
import { FaLinkedin } from "react-icons/fa";
import { MdOutlineMail } from "react-icons/md";

import useStore from "./store";
import InputBar from "./InputBar";
import Env from "./Env";
import Scene from "./Scene";
import Postproduction from "./Postproduction";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.REACT_APP_OPENAI_API_KEY,
  organization: "org-xl3gZeUkDOQrIqypLNygYEtZ",
  project: "proj_yTxEfQnw1Cq8uGJiGfLSvYaY",
  dangerouslyAllowBrowser: true,
});

function App() {
  // State for color palette
  const [colorOne, setColorOne] = useState("#FF6F61");
  const [colorTwo, setColorTwo] = useState("#F96D00");
  const [colorThree, setColorThree] = useState("#FFD275");
  const [colorFour, setColorFour] = useState("#D64045");
  const [colorFive, setColorFive] = useState("#FF9A8B");

  // State for AI conversation
  const [word, setWord] = useState("");
  const [finalPrompt, setFinalPrompt] = useState(
    "The following is a conversation with an AI Stoic Philosopher. The philosopher is helpful, creative, clever, friendly, gives brief stoic advice, and asks deep questions.\n\nHuman: Hello, who are you?\nAI: I am an AI created by OpenAI. How are you feeling? "
  );
  const [firstClick, setFirstClick] = useState(0);
  const [aiResponses, setAiResponses] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [firstInput, setFirstInput] = useState(false);
  const [inputHeaderText, setInputHeaderText] = useState("");
  const [enterIncrement, setEnterIncrement] = useState(0);
  const [opened, setOpened] = useState(false);
  const [about, setAbout] = useState(false);
  const [modalSize, setModalSize] = useState("50%");
  const [modalFont, setModalFont] = useState(26);
  const [typeIts, setTypeIts] = useState([]);

  // Get input from store
  const inputStore = useStore((state) => state.inputStore);

  // Animation springs
  const [springs, api] = useSpring(() => ({ from: { opacity: 0 } }));
  const [springs2, api2] = useSpring(() => ({ from: { opacity: 0 } }));
  const [springs3, api3] = useSpring(() => ({ from: { opacity: 1 } }));
  const [springs4, api4] = useSpring(() => ({ from: { opacity: 1 } }));
  const [springs5, api5] = useSpring(() => ({ from: { opacity: 0 } }));

  // Generate AI response
  const generateResponse = async (input) => {
    setFirstClick(firstClick + 1);
    setLoading(true);

    try {
      // Generate AI response
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: finalPrompt },
          { role: "user", content: input },
        ],
        temperature: 0.9,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0.76,
        presence_penalty: 0.75,
      });

      const aiResponse = completion.choices[0].message.content.replace(
        /^AI:\s*/,
        ""
      );

      setAiResponses((prevResponses) => [...prevResponses, aiResponse]);
      setFinalPrompt(
        (prevPrompt) => prevPrompt + "\nHuman:" + input + "\nAI:" + aiResponse
      );

      // Generate color palette
      const colorCompletion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a color palette generator. Provide five different hex value colors that create a palette matching the input's sentiment. Then describe that sentiment as either optimistic or pessimistic.",
          },
          { role: "user", content: input },
        ],
        temperature: 0,
        max_tokens: 64,
        top_p: 1.0,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
      });

      const paletteResponse = colorCompletion.choices[0].message.content;
      const hexColors = paletteResponse.match(/#[0-9A-Fa-f]{6}/g);

      if (hexColors && hexColors.length >= 5) {
        setColorOne(hexColors[0]);
        setColorTwo(hexColors[1]);
        setColorThree(hexColors[2]);
        setColorFour(hexColors[3]);
        setColorFive(hexColors[4]);
      }

      setWord(
        paletteResponse.includes("Optimistic") ? "optimistic" : "pessimistic"
      );
    } catch (error) {
      console.error("Error:", error.response?.data || error.message);
    }

    setLoading(false);
  };

  // Typewriter effect for AI responses
  useEffect(() => {
    if (aiResponses.length > 0) {
      const latestResponse = aiResponses[aiResponses.length - 1];
      const newTypeIt = (
        <TypeIt
          key={aiResponses.length}
          className="theResponse"
          options={{
            afterComplete: () => {
              document.querySelector(".ti-cursor").style.display = "none";
            },
            speed: 60,
          }}
        >
          {latestResponse}
        </TypeIt>
      );

      setTypeIts([newTypeIt]);

      api4.start({
        delay: 0,
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 1500 },
      });
    }
  }, [aiResponses]);

  useEffect(() => {
    if (inputStore.length > 0) {
      setEnterIncrement((prev) => prev + 1);
      setLoading(true);

      api.start({
        delay: 100,
        from: { opacity: 1 },
        to: { opacity: 0 },
        config: { duration: 2000 },
        onResolve: () => setFirstInput(true),
      });

      api2.start({
        delay: 100,
        from: { opacity: 1 },
        to: { opacity: 0 },
        config: { duration: 2000 },
        onResolve: () => setInputHeaderText(inputStore),
      });

      api2.start({
        delay: 2000,
        from: { opacity: 0 },
        to: { opacity: 1 },
        config: { duration: 2000 },
      });

      api3.start({
        delay: 0,
        from: { opacity: 1 },
        to: { opacity: 0 },
        config: { duration: 1000 },
      });

      generateResponse(inputStore);
    }
  }, [inputStore]);

  useEffect(() => {
    api.start({
      delay: 999,
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { duration: 7000 },
    });
    api5.start({
      delay: 1000,
      from: { opacity: 0 },
      to: { opacity: 1 },
      config: { duration: 3000 },
    });
  }, []);

  useEffect(() => {
    if (isMobile) {
      setOpened(true);
      setModalSize("100%");
      setModalFont(18);
    }
  }, []);

  return (
    <>
      {/* Header */}
      <div
        style={{
          position: "absolute",
          zIndex: 2,
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
                <animated.div style={springs4}>{typeIts[0]}</animated.div>
              )}
            </Container>
          </Stack>
        </CenterMantine>
      </div>

      {/* Input Bar */}
      <animated.div style={springs5}>
        <InputBar word={word} />
      </animated.div>

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

      {/* About Modal */}
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
            <div style={{ width: "50%" }}>
              <div style={{ fontSize: 21.5 }} className="mobileModal">
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

      {/* Mobile Warning Modal */}
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
    </>
  );
}

export default App;
