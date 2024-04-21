import React, { useEffect, useRef } from "react";

export const VideoPlayer = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      data-testid="peer-video"
      style={{ width: "100%" }}
      ref={videoRef}
      autoPlay
      muted={true}
    />
  );
};
