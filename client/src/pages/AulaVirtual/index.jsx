import React, { useContext } from "react";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import LiveStreamingComponent from "../../components/LiveStreamingComponent";
import {
  SocketContext,
  usernameAtom,
  idsAtom,
} from "../../components/ContexProvider";
import { useAtom } from "jotai";

const AulaVirtual = () => {
  const { me } = useContext(SocketContext);
  const [usernames] = useAtom(usernameAtom);
  const [ids] = useAtom(idsAtom);

  console.log("usernames", usernames);
  console.log("ids", ids);
  console.log("##id", me);
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
