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
import { VideoScreen } from "../components/Streaming/VideoScreen";

const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);
  const [users] = useAtom(userAtom);

  console.log(users);
  const { screenStream, peers, screenSharingId } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  const handleFloorClick = (e) => {
    const newPosition = [e.point.x, -0.467, e.point.z];
    console.log("newPosition", newPosition);
    socket.emit("move", newPosition);
  };

  return (
    <>
      <fog attach="fog" args={["purple", 0, 130]} />
      <ambientLight intensity={0.1} />
      <ContactShadows blur={2} />
      <OrbitControls />
      <group>
        <primitive object={gltf.scene} />
        <mesh
          rotation-x={-Math.PI / 2}
          onClick={(e) => socket.emit("move", [e.point.x, 0, e.point.z])}
          onPointerEnter={() => setOnFloor(true)}
          onPointerLeave={() => setOnFloor(false)}
        >
          <planeGeometry args={[10, 10]} />
          <meshStandardMaterial color="#f0f0f0" />
        </mesh>
        {users.map((user) => (
          <Avatar
            key={user.id}
            user={user}
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
      </group>
      {/* tener en cuenta que es una url externa */}
      <Environment
        files="https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/hdris/noon-grass/noon_grass_1k.hdr"
        background
      />
    </>
  );
};

export default AulaScene;
