import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream, userId }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  const isMyStream = stream && stream.id === userId; // Suponiendo que stream tiene un atributo 'id'

  return (
    <video
      data-testid="peer-video"
      style={{ width: "100%" }}
      ref={videoRef}
      autoPlay
      muted={!isMyStream} // Se silencia si no es tu propio stream
    />
  );
};
