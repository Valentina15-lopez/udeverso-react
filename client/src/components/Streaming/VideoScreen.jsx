import React, { useEffect, useRef } from "react";

export const VideoScreen = ({ stream }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <>
      <video
        id="screen-video"
        style={{ width: "100%" }}
        ref={videoRef}
        autoPlay
      />
    </>
  );
};
