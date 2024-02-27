import React, { useRef, useLayoutEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";
import {
  Box,
  useGLTF,
  useBoxProjectedEnv,
  BakeShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { avatarAtom, socket } from "./SocketManager";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useControls } from "leva";
import modeloGlb from "../assets/modeloAula3.glb";
import {
  Environment,
  OrbitControls,
  useCursor,
  CubeCamera,
  KeyboardControls,
} from "@react-three/drei";

const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);
  const [avatars] = useAtom(avatarAtom);
  const [keysPressed, setKeysPressed] = useState({});

  const { up, scale, ...config } = useControls({
    up: { value: -0.5, min: -10, max: 10 },
    scale: { value: 27, min: 0, max: 50 },
    roughness: { value: 0.06, min: 0, max: 0.15, step: 0.001 },
    envMapIntensity: { value: 1, min: 0, max: 5 },
  });
  const projection = useBoxProjectedEnv([0, up, 0], [scale, scale, scale]);
  const handleKeyDown = (event) => {
    setKeysPressed((prev) => ({ ...prev, [event.code]: true }));
  };

  const handleKeyUp = (event) => {
    setKeysPressed((prev) => ({ ...prev, [event.code]: false }));
  };

  useLayoutEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const handleAvatarMovement = () => {
    avatars.forEach((avatar) => {
      const speed = 0.1;
      if (keysPressed["ArrowUp"] || keysPressed["KeyW"]) {
        avatar.position[2] -= speed;
      }
      if (keysPressed["ArrowDown"] || keysPressed["KeyS"]) {
        avatar.position[2] += speed;
      }
      if (keysPressed["ArrowLeft"] || keysPressed["KeyA"]) {
        avatar.position[0] -= speed;
      }
      if (keysPressed["ArrowRight"] || keysPressed["KeyD"]) {
        avatar.position[0] += speed;
      }
    });
  };

  useFrame(() => {
    handleAvatarMovement();
  });

  return (
    <>
      <fog attach="fog" args={["purple", 0, 130]} />
      <ambientLight intensity={0.1} />
      <group position={[0, -1, 0]}>
        <primitive object={gltf.scene} />
        <CubeCamera
          frames={1}
          position={[0, 0.5, 0]}
          rotation={[0, 0, 0]}
          resolution={2048}
          near={1}
          far={1000}
        >
          {(texture) => (
            <mesh
              receiveShadow
              position={[-13.68, -0.467, 17.52]}
              scale={0.02}
              geometry={gltf.nodes.PisoAula.geometry}
              dispose={null}
            >
              <meshStandardMaterial
                map={gltf.materials.piso.map}
                normalMap={gltf.materials.piso.normalMap}
                envMap={texture}
                metalness={0.0}
                normalScale={[0.25, -0.25]}
                color="#aaa"
                {...projection}
                {...config}
              />
            </mesh>
          )}
        </CubeCamera>
        {avatars.map((avatar) => (
          <Avatar
            key={avatar.id}
            position={
              new THREE.Vector3(avatar.position[0], 0, avatar.position[2])
            }
            hairColor={avatar.hairColor}
            topColor={avatar.topColor}
            bottomColor={avatar.bottomColor}
          />
        ))}
      </group>
      <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      <Environment
        files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr"
        background
      />
      <BakeShadows />
    </>
  );
};

export default AulaScene;
