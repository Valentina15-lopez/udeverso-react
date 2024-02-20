import React from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import { SocketManager } from "../../components/SocketManager";
import routes from "../../routes";
import { useRoutes } from "react-router-dom";
import { useUserMedia } from "../../useUSerMedia";

const AulaVirtual = () => {
  const element = useRoutes(routes);
  const { stream, error } = useUserMedia({ audio: true, video: true });

  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
      {error ? (
        <p>error</p>
      ) : (
        <video
          autoPlay
          ref={(video) => {
            if (video) {
              video.srcObject = stream;
            }
          }}
        />
      )}
      {element}
    </div>
  );
};

export default AulaVirtual;
