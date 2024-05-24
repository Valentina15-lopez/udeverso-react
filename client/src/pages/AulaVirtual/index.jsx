import React from "react";
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

import { useAtom } from "jotai";

const AulaVirtual = () => {
  const [users] = useAtom(userAtom);
  const { roomId } = useParams(); // Obtiene el ID de la sala de los parámetros de ruta
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];
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
            <Physics timeStep="vary">
              <KeyboardControls map={keyboardMap}>
                <Controller maxVelLimit={5}>
                  <AulaScene />
                </Controller>
              </KeyboardControls>
            </Physics>
          </Canvas>
        </div>
        <div className="w-1/4 ">
          <Room />
        </div>
      </div>
    </div>
  );
};

export default AulaVirtual;
