import React, { useEffect, useRef, useState } from "react";
import { MicrophoneButton } from "./Micro";

export const VideoPlayer = ({ stream, isOwnStream }) => {
  const videoRef = useRef(null);
  const [isMicMuted, setIsMicMuted] = useState(false);

  // Función de devolución de llamada para recibir actualizaciones del estado del micrófono
  const handleMicToggle = (newState) => {
    setIsMicMuted(newState);
  };
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <video
        data-testid="peer-video"
        style={{ width: "100%" }}
        ref={videoRef}
        autoPlay
        muted={isOwnStream || isMicMuted} // Se silencia si no es tu propio stream
      />
      <MicrophoneButton onToggle={handleMicToggle} />
    </>
  );
};
