import React, { useRef, useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { avatarAtom, socket } from "./SocketManager";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import floorTexture from "../assets/pisoAula.jpg"; // Ajusta la ruta a tu textura

const AulaScene = () => {
  const aulaRef = useRef();
  const [avatars] = useAtom(avatarAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <Environment preset="sunset" />
      <OrbitControls />
      <mesh
        ref={aulaRef}
        onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
        onPointerEnter={() => setOnFloor(true)}
        onPointerLeave={() => setOnFloor(false)}
      >
        {/* Paredes */}
        <Box args={[10, 5, 1]} position={[0, 0, -5]}>
          <meshStandardMaterial color={"blue"} />
        </Box>
        <Box args={[1, 5, 10]} position={[-5, 0, 0]}>
          <meshStandardMaterial color={"blue"} />
        </Box>
        <Box args={[1, 5, 10]} position={[5, 0, 0]}>
          <meshStandardMaterial color={"blue"} />
        </Box>

        {/* Suelo  */}
        <mesh rotation-x={-Math.PI / 2} position={[0, -2.5, 0]}>
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color={"red"} />
        </mesh>

        {avatars.map((avatar) => (
          <Avatar
            key={avatar.id}
            position={
              new THREE.Vector3(avatar.position[0], -2.5, avatar.position[2])
            }
            hairColor={avatar.hairColor}
            topColor={avatar.topColor}
            bottomColor={avatar.bottomColor}
          />
        ))}
      </mesh>
    </>
  );
};

export default AulaScene;
