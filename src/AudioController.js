import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import { Howl, Howler } from "howler";

export default function AudioController() {
  // const [currentNote, setCurrentNote] = useState(0);
  // const [audioElements, setAudioElements] = useState([]);
  // useEffect(() => {
  //   return () => {
  //     // Pause all audio elements
  //     audioElements.forEach((audioElement) => {
  //       audioElement.pause();

  //       // Reset the currentTime after the sound has finished playing
  //       setTimeout(() => {
  //         audioElement.currentTime = 0;
  //       }, audioElement.duration * 1000);
  //     });
  //   };
  // }, []);

  // const handleKeyPress = (event) => {
  //   // Create a new Audio object
  //   const audioElement = new Audio(`/audio/${currentNote}.wav`);

  //   // Play the sound
  //   // audioElement.volume = 0.1;
  //   let volume = 0;
  //   const interval = setInterval(() => {
  //     audioElement.volume = volume;
  //     volume += 0.1;

  //     if (volume >= 1) {
  //       clearInterval(interval);
  //     }
  //   }, 50);

  //   audioElement.play();

  //   // Increment the current note
  //   setCurrentNote((currentNote + 1) % 13);

  //   // Add the audio element to the array
  //   setAudioElements([...audioElements, audioElement]);
  // };
  const [playing, setPlaying] = useState(false);
  const [currentNote, setCurrentNote] = useState(0);

  const handleKeyPress = (event) => {
    if (event.key === " " || event.key === "Enter") {
      setPlaying(true);
    } else if (playing) {
      const sound = new Howl({
        src: [`/audio/${currentNote}.mp3`],
        volume: 0.5,
      });
      sound.play();
      setCurrentNote((currentNote + 1) % 13);
      setPlaying(false);
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 1,
        padding: "1rem",
        width: "100%",
      }}
    >
      <input
        type="text"
        style={{
          color: "black",
          boxShadow: "0 0 4px rgba(0, 0, 0, 0.1)",
          width: "200px",
          height: "100px",
        }}
        onKeyDown={handleKeyPress}
      />
    </div>
  );
}
