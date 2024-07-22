import React, { useContext, useState, useEffect } from "react";
import { Environment, OrbitControls, ContactShadows } from "@react-three/drei";
import * as THREE from "three";
import { CubeCamera, useCursor } from "@react-three/drei";
import { socket, userAtom } from "./../context/ContexProvider";
import { useAtom } from "jotai";
import { Avatar } from "./Avatar";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import modeloGlb from "../assets/modeloAula3.glb";
import { AvatarConfigContext } from "../context/AvatarConfigContext";
import { Pizarron } from "./Pizarron";
//esta es la version final
const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);
  const { avatarConfig } = useContext(AvatarConfigContext);

  const [users] = useAtom(userAtom);

  const { screenStream, peers, screenSharingId, fileTexture } =
    useContext(RoomContext);
  const { userId, userName } = useContext(UserContext);

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const handleFloorClick = (e) => {
    const newPosition = [e.point.x, 0, e.point.z];
    socket.emit("move", newPosition);
  };

  const applyAvatarConfig = (user) => {
    if (avatarConfig) {
      user.hairColor = avatarConfig.hairColor;
      user.topColor = avatarConfig.topColor;
      user.bottomColor = avatarConfig.bottomColor;
    }
    return user;
  };

  return (
    <>
      <Environment preset="sunset" />
      <ambientLight intensity={0.1} />
      <OrbitControls />
      <group>
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
            <>
              <mesh
                receiveShadow
                geometry={gltf.nodes.PisoAula.geometry}
                rotation-x={-Math.PI / 2}
                position-y={-0.467}
                onClick={handleFloorClick}
                onPointerEnter={() => setOnFloor(true)}
                onPointerLeave={() => setOnFloor(false)}
              >
                <planeGeometry
                  args={[10, 10]}
                  rotateX={-Math.PI / 2}
                  position={[0, -0.467, 0]}
                />
                <meshStandardMaterial
                  map={gltf.materials.piso.map}
                  normalMap={gltf.materials.piso.normalMap}
                  envMap={texture}
                  metalness={0.0}
                />
              </mesh>
            </>
          )}
        </CubeCamera>
        <Pizarron />
        {users.map((user) => {
          const isCurrentUser = userName === avatarConfig.userId;

          return (
            <Avatar
              key={user.id}
              position={
                new THREE.Vector3(
                  user.position[0],
                  user.position[1],
                  user.position[2]
                )
              }
              hairColor={
                isCurrentUser ? avatarConfig.hairColor : avatarConfig.hairColor
              }
              topColor={
                isCurrentUser ? avatarConfig.topColor : avatarConfig.topColor
              }
              bottomColor={
                isCurrentUser
                  ? avatarConfig.bottomColor
                  : avatarConfig.bottomColor
              }
            />
          );
        })}
      </group>
    </>
  );
};

export default AulaScene;
