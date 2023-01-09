import React from "react";
import ReactHowler from "react-howler";
import { useState, useEffect } from "react";
import gsap from "gsap";

export default function AudioController2(props) {
  useEffect(() => {
    if (props.word === "optimistic") {
      gsap.to(padCVolume, {
        volume: 0.5,
        duration: 3,
        onUpdate: () => setPadCVolume({ volume: padCVolume.volume }),
      });
      gsap.to(padFVolume, {
        volume: 0,
        duration: 5,
        onUpdate: () => setPadFVolume({ volume: padFVolume.volume }),
      });
      gsap.to(arpCVolume, {
        volume: 0.5,
        duration: 5,
        onUpdate: () => setArpCVolume({ volume: arpCVolume.volume }),
      });
      //   gsap.to(arpFVolume, {
      //     volume: 0,
      //     duration: 5,
      //     onUpdate: () => setArpFVolume({ volume: arpFVolume.volume }),
      //   });
    }

    if (props.word === "pessimistic") {
      gsap.to(padCVolume, {
        volume: 0,
        duration: 5,
        onUpdate: () => setPadCVolume({ volume: padCVolume.volume }),
      });
      gsap.to(padFVolume, {
        volume: 0.5,
        duration: 5,
        onUpdate: () => setPadFVolume({ volume: padFVolume.volume }),
      });
      gsap.to(arpCVolume, {
        volume: 0,
        duration: 5,
        onUpdate: () => setArpCVolume({ volume: arpCVolume.volume }),
      });
      //   gsap.to(arpFVolume, {
      //     volume: 0.5,
      //     duration: 5,
      //     onUpdate: () => setArpFVolume({ volume: arpFVolume.volume }),
      //   });
    }
  }, [props.word]);

  useEffect(() => {
    gsap.to(padCVolume, {
      delay: 6,
      volume: 0.5,
      duration: 4,
      onUpdate: () => setPadCVolume({ volume: padCVolume.volume }),
    });
    gsap.to(casetteVolume, {
      delay: 4,
      volume: 0.3,
      duration: 3,
      onUpdate: () => setCasetteVolume({ volume: casetteVolume.volume }),
    });
  }, []);
  const [padCPlaying, setPadCPlaying] = useState(true);
  //   const [padDPlaying, setPadDPlaying] = useState(true);
  const [padFPlaying, setPadFPlaying] = useState(true);
  const [casettePlaying, setCasettePlaying] = useState(true);
  const [arpCPlaying, setArpCPlaying] = useState(true);
  //   const [arpFPlaying, setArpFPlaying] = useState(true);
  const [padCVolume, setPadCVolume] = useState({ volume: 0 });
  //   const [padDVolume, setPadDVolume] = useState({ volume: 0 });
  const [padFVolume, setPadFVolume] = useState({ volume: 0 });
  const [casetteVolume, setCasetteVolume] = useState({ volume: 0 });
  const [arpCVolume, setArpCVolume] = useState({ volume: 0.5 });
  //   const [arpFVolume, setArpFVolume] = useState({ volume: 0 });
  return (
    <>
      <ReactHowler
        src="/audio/padC.mp3"
        playing={padCPlaying}
        volume={padCVolume.volume}
        loop={true}
      />
      {/* <ReactHowler
        src="/audio/padD.mp3"
        playing={padDPlaying}
        volume={padDVolume.volume}
        loop={true}
      /> */}
      <ReactHowler
        src={"/audio/padFAndArp.mp3"}
        playing={padFPlaying}
        volume={padFVolume.volume}
        loop={true}
      />
      <ReactHowler
        src={"/audio/casette.mp3"}
        playing={casettePlaying}
        volume={casetteVolume.volume}
        loop={true}
      />
      <ReactHowler
        src={"/audio/arpC.mp3"}
        playing={arpCPlaying}
        volume={arpCVolume.volume}
        loop={true}
      />
      {/* <ReactHowler
        src={"/audio/arpF.mp3"}
        playing={arpFPlaying}
        volume={arpFVolume.volume}
        loop={true}
      /> */}
    </>
  );
}
