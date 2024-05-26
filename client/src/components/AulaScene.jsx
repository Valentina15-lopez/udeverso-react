import React, { useContext, useState, useEffect } from "react";
import { Environment, OrbitControls, Html } from "@react-three/drei";
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
  const [users, setUsers] = useAtom(userAtom);

  console.log(users);
  const { screenStream, peers, screenSharingId } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  const [onFloor, setOnFloor] = useState(false);
  useCursor(onFloor);
  useEffect(() => {
    socket.on("move", (newPosition) => {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, position: newPosition } : user
        )
      );
    });

    return () => {
      socket.off("move");
    };
  }, [setUsers, userId]);
  const handleFloorClick = (e) => {
    console.log("hago click en la mesh");
    const newPosition = [e.point.x, 0, e.point.z];
    socket.emit("move", newPosition);
  };

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
              position={[0, 0, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
              scale={0.02}
              geometry={gltf.nodes.PisoAula.geometry}
              onClick={handleFloorClick}
              onPointerEnter={() => setOnFloor(true)}
              onPointerLeave={() => setOnFloor(false)}
            >
              <planeGeometry args={[100, 100]} />
              <meshStandardMaterial
                map={gltf.materials.piso.map}
                normalMap={gltf.materials.piso.normalMap}
                envMap={texture}
                metalness={0.0}
                normalScale={[0.25, -0.25]}
              />
            </mesh>
          )}
        </CubeCamera>
        <Html
          transform
          className="w-full h-full"
          rotation-y={Math.PI / 2}
          position={[-35, 0, 0]}
        >
          <VideoScreen stream={screenSharingVideo} />
        </Html>
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
