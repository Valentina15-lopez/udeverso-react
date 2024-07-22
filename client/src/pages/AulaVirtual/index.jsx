import React, { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import { userAtom } from "../../context/ContexProvider";
import { Room } from "../../components/Streaming/room";
import { Physics, RigidBody } from "@react-three/rapier";
import Controller from "ecctrl";
import { useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";
import {
  Gltf,
  Environment,
  Fisheye,
  KeyboardControls,
} from "@react-three/drei";
import { PDFView } from "../../components/Streaming/PDFView";
import { RoomContext } from "../../context/RoomContext";
import { SocketContext } from "../../context/ContexProvider";
import { UserContext } from "../../context/UserContext";

import { useAtom } from "jotai";

const AulaVirtual = () => {
  const [users] = useAtom(userAtom);
  const { socket } = useContext(SocketContext);
  const { roomId } = useParams(); // Obtiene el ID de la sala de los parámetros de ruta
  const { fileTexture } = useContext(RoomContext);
  const { userId } = useContext(UserContext);

  const navigate = useNavigate();

  // Lógica de redirección aquí, por ejemplo, redirigir a / si no hay ID de sala
  if (!roomId) {
    return <Navigate to="/" />;
  }

  // Función para manejar la redirección a la página anterior
  const handleGoBack = () => {
    socket.emit("user-disconnected", {
      peerId: userId,
    });
    socket.emit("disconnect");
    navigate(-1); // Redirige a la página anterior en el historial
  };

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
          {fileTexture && <PDFView file={fileTexture} />}
        </div>
        <div className="w-1/4 ">
          <Button onClick={handleGoBack}>Salir del aula</Button>
          <Room />
        </div>
      </div>
    </div>
  );
};

export default AulaVirtual;
