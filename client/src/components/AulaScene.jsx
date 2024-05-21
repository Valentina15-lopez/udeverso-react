import React, { useState, useLayoutEffect} from "react";
import {CubeCamera,  Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { socket} from "../context/ContexProvider";
import { Avatar } from "./Avatar";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import modeloGlb from "../assets/modeloAula3.glb";

const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);

  const [firstAvatarPosition, setFirstAvatarPosition] = useState(
    new THREE.Vector3(...users[0].position)
  ); //majito
  const [keysPressed, setKeysPressed] = useState({}); //majito

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
              onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
              dispose={null}
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
        {users.map(
          (
            user,
            index //majo2
          ) => (
            <Avatar
              key={user.id}
              position={
                index === 0
                  ? firstAvatarPosition
                  : new THREE.Vector3(...user.position)
              } //majo2
              hairColor={user.hairColor}
              topColor={user.topColor}
              bottomColor={user.bottomColor}
            />
          )
        )}
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
