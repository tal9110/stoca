import React, { useState, useEffect } from "react";
import ReactHowler from "react-howler";
import gsap from "gsap";

const audioTracks = [
  { name: "padC", src: "/audio/padC.mp3", initialVolume: 0 },
  { name: "padF", src: "/audio/padFAndArp.mp3", initialVolume: 0 },
  { name: "casette", src: "/audio/casette.mp3", initialVolume: 0 },
  { name: "arpC", src: "/audio/arpC.mp3", initialVolume: 0.5 },
];

export default function AudioController({ firstInteraction, word }) {
  const [audioStates, setAudioStates] = useState(
    audioTracks.reduce(
      (acc, track) => ({
        ...acc,
        [track.name]: { volume: track.initialVolume, playing: false },
      }),
      {}
    )
  );

  const updateVolume = (trackName, volume) => {
    setAudioStates((prev) => ({
      ...prev,
      [trackName]: { ...prev[trackName], volume },
    }));
  };

  useEffect(() => {
    if (firstInteraction === 1) {
      setAudioStates((prev) =>
        Object.keys(prev).reduce(
          (acc, key) => ({
            ...acc,
            [key]: { ...prev[key], playing: true },
          }),
          {}
        )
      );

      gsap.to(audioStates.padC, {
        delay: 6,
        volume: 0.5,
        duration: 4,
        onUpdate: () => updateVolume("padC", audioStates.padC.volume),
      });

      gsap.to(audioStates.casette, {
        delay: 4,
        volume: 0.3,
        duration: 3,
        onUpdate: () => updateVolume("casette", audioStates.casette.volume),
      });
    }
  }, [firstInteraction]);

  useEffect(() => {
    const optimisticSettings = { padC: 0.5, padF: 0, arpC: 0.5 };
    const pessimisticSettings = { padC: 0, padF: 0.5, arpC: 0 };
    const settings =
      word === "optimistic" ? optimisticSettings : pessimisticSettings;

    Object.entries(settings).forEach(([trackName, targetVolume]) => {
      gsap.to(audioStates[trackName], {
        volume: targetVolume,
        duration: 5,
        onUpdate: () => updateVolume(trackName, audioStates[trackName].volume),
      });
    });
  }, [word]);

  if (firstInteraction === 0) return null;

  return (
    <>
      {audioTracks.map((track) => (
        <ReactHowler
          key={track.name}
          src={track.src}
          playing={audioStates[track.name].playing}
          volume={audioStates[track.name].volume}
          loop={true}
        />
      ))}
    </>
  );
}
