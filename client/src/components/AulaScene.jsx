import React, { useRef, useEffect, useState, useMemo } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import { Box } from "@react-three/drei";
import * as THREE from "three";
import { avatarAtom, socket } from "./SocketManager";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import {
  ContactShadows,
  Environment,
  OrbitControls,
  useCursor,
} from "@react-three/drei";
import modeloGlb from "../assets/version1aula.glb";

const AulaScene = () => {
  const aulaRef = useRef();
  const [avatars] = useAtom(avatarAtom);
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  // Cargar modelo glb
  const gltf = useLoader(GLTFLoader, modeloGlb);

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
        {/* Renderizar modelo glb */}
        <primitive object={gltf.scene} position={[0, -2.5, 0]} />
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
