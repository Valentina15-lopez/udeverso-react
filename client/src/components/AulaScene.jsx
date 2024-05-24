import React, {
  useRef,
  useEffect,
  useState,
  useMemo,
  useContext,
  useLayoutEffect,
} from "react";
import {
  Environment,
  OrbitControls,
  useCursor,
  KeyboardControls,
} from "@react-three/drei";
import { createRoot } from "react-dom/client";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stats } from "@react-three/drei";

import Controller from "ecctrl";

import {
  Box,
  useGLTF,
  useBoxProjectedEnv,
  BakeShadows,
} from "@react-three/drei";
import * as THREE from "three";
import { CubeCamera } from "@react-three/drei";
import { socket, userAtom } from "./../context/ContexProvider";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { useControls } from "leva";
import modeloGlb from "../assets/modeloAula3.glb";

const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);
  const [users] = useAtom(userAtom);
  console.log(users);
  const ref = useRef();
  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];

  useEffect(() => {
    console.log("Socket:", socket);
  }, []);

  const handleMeshClick = (e) => {
    console.log("Mesh clicked:", e.point);
    socket.emit("move", [e.point.x, 0, e.point.z]);
  };
  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);

  return (
    <>
      <fog attach="fog" args={["purple", 0, 130]} />
      <ambientLight intensity={0.1} />
      <OrbitControls />
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
              onClick={handleMeshClick}
              onPointerEnter={() => setOnFloor(true)}
              onPointerLeave={() => setOnFloor(false)}
            >
              <meshStandardMaterial
                map={gltf.materials.piso.map}
                normalMap={gltf.materials.piso.normalMap}
                envMap={texture}
                metalness={0.0}
                normalScale={[0.25, -0.25]}
                color="#aaa"
              />
            </mesh>
          )}
        </CubeCamera>
        <KeyboardControls map={keyboardMap}>
          <Controller maxVelLimit={5}>
            {users.map((user) => (
              <Avatar
                key={user.id}
                position={
                  new THREE.Vector3(
                    user.position[0],
                    user.position[1],
                    user.position[2]
                  )
                }
                hairColor={user.hairColor}
                topColor={user.topColor}
                bottomColor={user.bottomColor}
              />
            ))}
          </Controller>
        </KeyboardControls>
      </group>

      <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      {/* tener en cuenta que es una url externa */}
      <Environment
        files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr"
        background
      />
    </>
  );
};

export default AulaScene;
