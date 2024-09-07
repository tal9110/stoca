import React, { useState, useEffect } from "react";
import { Howl } from "howler";
import { Center, ActionIcon } from "@mantine/core";
import { useSpring } from "@react-spring/web";
import gsap from "gsap";
import { isMobile } from "react-device-detect";
import { VscArrowSmallRight } from "react-icons/vsc";

import useStore from "./store";
import AudioController from "./AudioController";

export default function InputBar({ word }) {
  const changeInput = useStore((state) => state.changeInput);

  // State
  const [inputValue, setInputValue] = useState("");
  const [entered, setEntered] = useState(false);
  const [firstInteraction, setFirstInteraction] = useState(0);
  const [currentNote, setCurrentNote] = useState(0);

  // Audio setup
  const keySound = new Howl({
    src: [`/audio/${currentNote}.mp3`],
    volume: 0.4,
  });
  const enterSound = new Howl({
    src: ["/audio/enter.mp3"],
    volume: 0.5,
  });

  // Animation setup
  const [springs, api] = useSpring(() => ({
    from: { opacity: 1 },
  }));

  // Handle key press events
  const handleKeyPress = (event) => {
    setFirstInteraction((prev) => prev + 1);

    if (isMobile) {
      if (event.key === "Enter") {
        setEntered(true);
      }
    } else {
      if (event.key === " ") {
        keySound.play();
        setCurrentNote((prev) => (prev + 1) % 22);
      }
      if (event.key === "Enter") {
        enterSound.play();
        setEntered(true);
      }
    }
  };

  // Handle input submission
  useEffect(() => {
    if (entered) {
      const inputElement = document.querySelector(".theInput");

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

      api.start({
        from: { opacity: 1 },
        to: { opacity: 0 },
        duration: 3000,
      });

      setEntered(false);
    }
  }, [entered, inputValue, changeInput, api]);

  return (
    <>
      <Center>
        {isMobile ? (
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              bottom: 70,
              border: "1px solid #A8A28F",
              borderRadius: "10px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                spellCheck="false"
                autoFocus
                type="text"
                className="theInput"
                style={{
                  caretColor: "white",
                  fontSize: 20,
                  textAlign: "center",
                  width: "80%",
                  height: "50px",
                }}
                onKeyDown={handleKeyPress}
              />
              <ActionIcon onClick={() => setEntered(true)}>
                <VscArrowSmallRight style={{ fill: "#A8A28F" }} size={100} />
              </ActionIcon>
            </div>
          </div>
        ) : (
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            spellCheck="false"
            autoFocus
            type="text"
            className="theInput"
            style={{
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
        )}
      </Center>
      {!isMobile && (
        <AudioController firstInteraction={firstInteraction} word={word} />
      )}
    </>
  );
}
