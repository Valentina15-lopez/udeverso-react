import React, { useEffect, useRef, useContext } from "react";
import { useGLTF, Html } from "@react-three/drei";
import { VideoScreen } from "./Streaming/VideoScreen";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";
import * as THREE from "three";
import html2canvas from "html2canvas";

export function Pizarron(props) {
  const { nodes, materials } = useGLTF(
    "/models/items/Pizarron-transformed.glb"
  );
  const { screenStream, peers, screenSharingId } = useContext(RoomContext);
  const { userId } = useContext(UserContext);
  const canvasRef = useRef(null);
  const textureRef = useRef(
    new THREE.CanvasTexture(document.createElement("canvas"))
  );

  const screenSharingVideo =
    screenSharingId === userId ? screenStream : peers[screenSharingId]?.stream;

  useEffect(() => {
    const canvas = canvasRef.current;
    const texture = textureRef.current;

    html2canvas(canvas).then((c) => {
      texture.image = c;
      texture.needsUpdate = true;
    });

    const interval = setInterval(() => {
      html2canvas(canvas).then((c) => {
        texture.image = c;
        texture.needsUpdate = true;
      });
    }, 1000 / 30); // Update at 30 fps

    return () => clearInterval(interval);
  }, [screenSharingVideo]);

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
          material={new THREE.MeshBasicMaterial({ map: textureRef.current })}
        />
      </group>
      <Html>
        <div ref={canvasRef} style={{ width: 384, height: 224 }}>
          <VideoScreen stream={screenSharingVideo} />
        </div>
      </Html>
    </group>
  );
}

useGLTF.preload("/models/items/Pizarron-transformed.glb");
