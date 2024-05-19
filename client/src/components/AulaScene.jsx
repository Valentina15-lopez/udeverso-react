import React, { useState, useLayoutEffect, useContext } from "react";
import { Environment, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { CubeCamera } from "@react-three/drei";
import { socket } from "../context/ContexProvider";
import { Avatar } from "./Avatar";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";
import modeloGlb from "../assets/modeloAula3.glb";
import { UserContext } from "../context/UserContext";

const AulaScene = () => {
  const gltf = useLoader(GLTFLoader, modeloGlb);
  const { usersList } = useContext(UserContext); // majo2

  const [firstAvatarPosition, setFirstAvatarPosition] = useState(
    new THREE.Vector3(...usersList[0].position)
  ); //majito
  const [keysPressed, setKeysPressed] = useState({}); //majito
  const [avatarPosition, setAvatarPosition] = useState(
    new THREE.Vector3(0, 0, 0)
  ); //majito2
  const currentUserID = "ID_del_usuario_actual"; // Debes obtener este valor de alguna parte //majito2

  console.log("Usuarios actuales:", usersList); // Mostrar los usuarios actuales majito, se muestra cada vez que se actuliza la escena
  console.log("PRIMER AVATAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAR", [
    firstAvatarPosition,
    setFirstAvatarPosition,
  ]); // Mostrar los usuarios actuales majito, se muestra cada vez que se actuliza la escena

  /* majito2 vieja
  const handleKeyDown = (event) => {
    setKeysPressed((prev) => ({ ...prev, [event.code]: true }));
  };
  */

  const handleKeyDown = (event) => {
    setKeysPressed((prev) => ({ ...prev, [event.code]: true }));

    switch (event.code) {
      case "KeyW":
        console.log("UBICACION w");
        //setFirstAvatarPosition(prev => new THREE.Vector3(prev.x, prev.y, prev.z - 15));
        break;
      case "KeyS":
        console.log("UBICACION s");
        //setFirstAvatarPosition(prev => new THREE.Vector3(prev.x, prev.y, prev.z + 15));
        break;
      case "KeyA":
        console.log("UBICACION a");
        //setFirstAvatarPosition(prev => new THREE.Vector3(prev.x - 15, prev.y, prev.z));
        break;
      case "KeyD":
        //setFirstAvatarPosition(prev => new THREE.Vector3(prev.x + 15, prev.y, prev.z));
        console.log("UBICACION d");
        break;
      default:
        break;
    }
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
        {usersList.map((user) => (
          <Avatar
            key={user.id}
            //position={new THREE.Vector3(user.position[0], 0, user.position[2])}
            // position={
            //   index === 0
            //     ? firstAvatarPosition
            //     : new THREE.Vector3(...user.position)
            // } //majo2
            position={user.position}
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
