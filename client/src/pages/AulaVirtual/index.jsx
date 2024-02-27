import React from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import { SocketManager } from "../../components/SocketManager";

const AulaVirtual = () => {
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <SocketManager />
      <Canvas
        frameloop="demand"
        dpr={[1, 1.5]}
        shadows
        camera={{ near: 0.1, far: 40, fov: 75 }}
      >
        <AulaScene />
      </Canvas>
    </div>
  );
};

export default AulaVirtual;
