import React, { useEffect, useContext, useState, useRef } from "react";
import { useGLTF, Html } from "@react-three/drei";
import * as THREE from "three";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";

export function Pizarron(props) {
  const { nodes, materials } = useGLTF(
    "/models/items/Pizarron-transformed.glb"
  );
  const { screenStream, peers, screenSharingId } = useContext(RoomContext);
  const videoRef = useRef(null);

  const { userId } = useContext(UserContext);
  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  // Crear referencia para el elemento de video
  const [videoTexture, setVideoTexture] = useState(null);

  useEffect(() => {
    const video = document.getElementById("video-screen");
    console.log(video);

    if (video && screenStream) {
      video.srcObject = screenStream;
      videoRef.current.srcObject = screenStream;
      video.play();
      const texture = new THREE.VideoTexture(video);
      setVideoTexture(texture);
    }
  }, [screenStream]);

  return (
    <group {...props} dispose={null}>
      <mesh
        geometry={nodes.Cylinder005.geometry}
        material={materials["Material #45"]}
        position={[-4.854, 2.798, -1.338]}
        rotation={[Math.PI / 2, 0, -3.122]}
        scale={[0.009, 0.01, 0.009]}
      />
      <group
        position={[-4.889, 0.798, 0.429]}
        rotation={[-Math.PI, 0.02, -Math.PI]}
        scale={[0.008, 0.02, 0.022]}
      >
        <mesh
          geometry={nodes.Malla003.geometry}
          material={materials["01 - Default"]}
        />
        <mesh
          geometry={nodes.Malla003_1.geometry}
          material={materials["02 - Default"]}
        />
        <mesh
          geometry={nodes.Malla003_2.geometry}
          material={
            videoTexture
              ? new THREE.MeshBasicMaterial({ map: videoTexture })
              : materials["Material #49"]
          }
        />
      </group>
      {/* Usar el componente Html para renderizar el video */}
      <Html>
        <video
          id="video-screen"
          style={{ display: "none" }}
          autoPlay
          muted
          ref={videoRef}
          width={"100%"}
          height={"100%"}
        />
      </Html>
    </group>
  );
}

useGLTF.preload("/models/items/Pizarron-transformed.glb");
