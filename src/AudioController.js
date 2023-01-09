import React, { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Howl, Howler } from "howler";
import { Text, Group, TextInput, Stack, Center, Button } from "@mantine/core";
import TypeIt from "typeit-react";
import App from "./App";
import useStore from "./store";
import { useSpring, animated } from "@react-spring/web";
import gsap from "gsap";
import { logDOM } from "@testing-library/react";
import { Image } from "@mantine/core";
import ReactHowler from "react-howler";

export default function AudioController() {
  // const step = useStore((state) => state.step);
  const changeInput = useStore((state) => state.changeInput);
  const incrementStep = useStore((state) => state.incrementStep);

  const [playing, setPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(0);
  const [entered, setEntered] = useState(false);
  const keySound = new Howl({
    src: [`/audio/${currentNote}.mp3`],
    volume: 0.3,
  });
  const enterSound = new Howl({
    src: [`/audio/enter.mp3`],
    volume: 0.5,
  });
  // const keySound = useRef();
  // const enterSound = useRef();
  // const [keySoundVolume, setKeySoundVolume] = useState(0.5);
  // const [keySoundPlaying, setKeySoundPlaying] = useState(false);
  const handleKeyPress = (event) => {
    if (event.key === " ") {
      setPlaying(true);
    } else if (playing) {
      keySound.play();
      // setKeySoundPlaying(true);
      setCurrentNote((currentNote + 1) % 22);
      setPlaying(false);
    }
    if (event.key === "Enter") {
      enterSound.play();
      setEntered(true);
    }
  };
  const inputElement = document.querySelector(".theInput");

  useEffect(() => {
    if (entered) {
      // console.log(inputElement);
      gsap.to(inputElement, {
        delay: 0.1,
        opacity: 0,
        duration: 2,
        onComplete: () => {
          setInputValue("");
        },
      });
      gsap.to(inputElement, {
        delay: 2.1,
        opacity: 1,
        duration: 2,
      });
      changeInput(inputValue);
      // console.log(inputValue);
      // incrementStep();
      // const newTypeIt = (
      //   <TypeIt
      //     className="theHeader"
      //     options={{
      //       afterComplete: () => {
      //         document.querySelector(".ti-cursor").style.display = "none";
      //       },
      //     }}
      //   >
      //     well hello there
      //   </TypeIt>
      // );
      // setTypeIts([newTypeIt]);
      // typeIts.shift();
      api.start({
        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
        duration: 3000,
      });
      // api.start({
      //   delay: 2000,
      //   from: {
      //     opacity: 0,
      //   },
      //   to: {
      //     opacity: 1,
      //   },
      //   duration: 2000,
      // });
      setEntered(false);
      // setInputValue("");
      // settimeout for 5 seconds then setinputvalue('')
      // setTimeout(() => {
      //   setInputValue("");
      // }, 6000);

      // console.log(step);
    }
  }, [entered]);
  // useEffect(() => {
  //   const sound = new Howl({
  //     src: [`/audio/bed.mp3`],
  //     volume: 0.5,
  //     loop: true,
  //   });
  //   sound.play();
  // }, []);
  const [inputValue, setInputValue] = useState("");

  const [typeIts, setTypeIts] = useState([]);

  const [springs, api] = useSpring(() => ({
    from: { opacity: 1 },
    // config: {
    // duration: 8000,
    // easing: (t) => t * t,
    // },
  }));

  return (
    <>
      {/* <ReactHowler
        // src="/audio/1.mp3"
        // volume={keySoundVolume}
        playing={keySoundPlaying}
        // ref={keySound}
      />
      <ReactHowler
        src="/audio/enter.mp3"
        volume={1}
        playing={false}
        ref={enterSound}
      /> */}

      <div
        style={{
          visibility: "hidden",
          position: "absolute",
          zIndex: 1,
          padding: "1rem",
          width: "100%",
          textAlign: "center",
          // ...springs,
        }}
      >
        <Center>
          <Stack mt={70}>
            <TypeIt
              className="theHeader"
              options={{
                afterComplete: () => {
                  document.querySelector(".ti-cursor").style.display = "none";
                },
              }}
            >
              How do you feel right now?
            </TypeIt>
            {/* {typeIts.map((typeIt) => typeIt)} */}
            {typeIts.map((typeIt) => typeIt)}
          </Stack>
        </Center>
      </div>

      <Center>
        {/* <animated.div> */}
        {/* <div style={{ position: "absolute", zIndex: 1 }}> */}
        <input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          spellCheck="false"
          autoFocus
          type="text"
          className="theInput"
          style={{
            // caretColor: "#53504A",
            caretColor: "white",
            fontSize: 35,
            textAlign: "center",
            width: "1000px",
            height: "70px",
            bottom: 80,
            position: "absolute",
            zIndex: 1,
          }}
          onKeyDown={handleKeyPress}
        />
        {/* </div> */}

        {/* </animated.div> */}
      </Center>

      {/* <App /> */}
    </>
  );
}
