import React, { useEffect, useRef } from "react";

const AudioPlayer = ({ audioUrl }) => {
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      // load new audio source
      setTimeout(() => {
        audioRef.current.load();
      }, 3000);
    }
  }, [audioUrl]); //re-run when audio url changes

  if (!audioUrl) {
    return <p>No audio URL provided.</p>;
  }

  return (
    <div>
      <audio ref={audioRef} key={audioUrl} controls>
        <source src={audioUrl} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
};

export default AudioPlayer;
