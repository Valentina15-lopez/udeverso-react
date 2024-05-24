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
  CubeCamera,
} from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";
import { Canvas, useLoader } from "@react-three/fiber";
import { socket, userAtom } from "./../context/ContexProvider";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import * as THREE from "three";
import modeloGlb from "../assets/modeloAula3.glb";

const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);
  const [users] = useAtom(userAtom);
  const [onFloor, setOnFloor] = useState(false);
  const [targetPositions, setTargetPositions] = useState({});

  useCursor(onFloor);

  useEffect(() => {
    console.log("Socket:", socket);
  }, []);

  const handleMeshClick = (e) => {
    const newTargetPosition = [e.point.x, 0, e.point.z];
    console.log("Mesh clicked:", newTargetPosition);
    socket.emit("move", newTargetPosition);
    // Set target position for all avatars (or for specific avatars as needed)
    const newPositions = users.reduce((acc, user) => {
      acc[user.id] = newTargetPosition;
      return acc;
    }, {});
    setTargetPositions(newPositions);
  };

  const keyboardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "jump", keys: ["Space"] },
    { name: "run", keys: ["Shift"] },
  ];

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
        <Physics timeStep="vary" gravity={[0, -9.81, 0]}>
          <KeyboardControls map={keyboardMap}>
            {users.map((user) => (
              <RigidBody
                key={user.id}
                position={
                  new THREE.Vector3(
                    user.position[0] ?? 0,
                    user.position[1] ?? 0,
                    user.position[2] ?? 0
                  )
                }
                colliders="ball"
                restitution={0.2}
                friction={1}
              >
                <Avatar
                  key={user.id}
                  hairColor={user.hairColor}
                  topColor={user.topColor}
                  bottomColor={user.bottomColor}
                  position={
                    new THREE.Vector3(
                      user.position[0] ?? 0,
                      user.position[1] ?? 0,
                      user.position[2] ?? 0
                    )
                  }
                  targetPosition={targetPositions[user.id]}
                />
              </RigidBody>
            ))}
          </KeyboardControls>
        </Physics>
      </group>
      <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} />
      <Environment
        files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr"
        background
      />
    </>
  );
};

export default AulaScene;
