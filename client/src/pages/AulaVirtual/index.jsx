import React, { useContext } from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import LiveStreamingComponent from "../../components/LiveStreamingComponent";
import { SocketContext } from "../../components/ContexProvider";

const AulaVirtual = () => {
  const { me, username } = useContext(SocketContext);
  console.log("##id", me);
  console.log("##username", username);
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
