import React, { useContext } from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import LiveStreamingComponent from "../../components/Streaming/LiveStreamingComponent";
import { userAtom } from "../../components/ContexProvider";
import { useAtom } from "jotai";

const AulaVirtual = () => {
  const [users] = useAtom(userAtom);

  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
      <LiveStreamingComponent />;
    </div>
  );
};

export default AulaVirtual;
