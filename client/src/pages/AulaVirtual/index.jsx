import React, { useContext } from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import LiveStreamingComponent from "../../components/LiveStreamingComponent";

const AulaVirtual = () => {
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
      <LiveStreamingComponent />
    </div>
  );
};

export default AulaVirtual;
