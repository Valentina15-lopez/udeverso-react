import React, { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import { userAtom } from "../../context/ContexProvider";
import { Room } from "../../components/Streaming/room";
import { Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";

import {
  Gltf,
  Environment,
  Fisheye,
  KeyboardControls,
} from "@react-three/drei";
import { PDFView } from "../../components/Streaming/PDFView";
import { RoomContext } from "../../context/RoomContext";

import { useAtom } from "jotai";

const AulaVirtual = () => {
  const [users] = useAtom(userAtom);
  const { roomId } = useParams(); // Obtiene el ID de la sala de los parámetros de ruta
  const { screenStream } = useContext(RoomContext);

  // Lógica de redirección aquí, por ejemplo, redirigir a / si no hay ID de sala
  if (!roomId) {
    return <Navigate to="/" />;
  }

  // Renderizar la página de AulaVirtual con el ID de la sala
  return (
    <div className="h-screen flex flex-col">
      <div className="flex-1 flex">
        <div className="w-3/4">
          <Canvas
            frameloop="demand"
            dpr={[1, 1.5]}
            shadows
            camera={{ near: 0.1, far: 40, fov: 75 }}
            className="w-full h-full z-0"
          >
            <AulaScene />
          </Canvas>
          <PDFView file={screenStream} />
        </div>
        <div className="w-1/4 ">
          <Room />
        </div>
      </div>
    </div>
  );
};

export default AulaVirtual;
