import React from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import { SocketManager } from "../../components/SocketManager";

const AulaVirtual = () => {
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <SocketManager />
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
    </div>
  );
};

export default AulaVirtual;
