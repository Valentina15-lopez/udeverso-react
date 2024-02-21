import React, { useRef, useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import * as THREE from "three";
import { avatarAtom, socket } from "./SocketManager";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import { useUserMedia } from '../components/useUSerMedia';
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useCursor,
} from "@react-three/drei";

const AulaScene = () => {
  const ref = useRef();
  const [avatars] = useAtom(avatarAtom);
  const [onFloor, setOnFloor] = useState(false);
  const { stream, error } = useUserMedia({ audio: true, video: true }); //maria
  
  // ----------------------- Inicio: maria  ----------------------
  //Emitir el flujo de audio al servidor cuando esté disponible
   
  useEffect(() => {
    if (stream && !error) {
      socket.emit("audioStream", stream);
    }
  }, [stream, error]);
 // ----------------------- fin: maria  ----------------------

  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <OrbitControls />
      <gridHelper
        ref={ref}
        args={[100, 100]}
        position-y={-0.001}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      />

      
      

      {avatars.map((avatar) => (
        <Avatar
          key={avatar.id}
          position={
            new THREE.Vector3(
              avatar.position[0],
              avatar.position[1],
              avatar.position[2]
            )
          }
        />
      ))}
    </>
  );
};

export default AulaScene;
