import React, { useEffect, useContext, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomContext } from "../context/RoomContext";
import { UserContext } from "../context/UserContext";

export function Pizarron(props) {
  const { nodes, materials } = useGLTF(
    "/models/items/Pizarron-transformed.glb"
  );
  const { userName } = useContext(UserContext);

  const { screenStream, peers, screenSharingId, fileTexture, userId } =
    useContext(RoomContext);
  const videoRef = useRef(null);
  const [materialTexture, setMaterialTexture] = useState(null);

  useEffect(() => {
    const video = document.createElement("video");
    video.id = "video-screen";
    video.style.display = "none";
    video.autoPlay = true;
    video.muted = true;

    document.body.appendChild(video);

    if (screenStream) {
      video.srcObject = screenStream;
      video.play();

      const texture = new THREE.VideoTexture(video);
      setMaterialTexture(texture);
    }

    return () => {
      document.body.removeChild(video);
    };
  }, [screenStream]);

  useEffect(() => {
    if (fileTexture) {
      setMaterialTexture(fileTexture);
    }
  }, [fileTexture]);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await fetch(
          `https://metaversoude2.ddns.net:3001/api/users/${userName}/material`
        );
        const materials = await response.json();

        if (materials.length > 0) {
          const textureLoader = new THREE.TextureLoader();
          const texture = await textureLoader.loadAsync(materials[0].path);
          setMaterialTexture(texture);
        }
      } catch (error) {
        console.error("Error al obtener materiales:", error);
      }
    };

    fetchMaterials();
  }, [userName]);

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
            materialTexture
              ? new THREE.MeshBasicMaterial({ map: materialTexture })
              : materials["Material #49"]
          }
        />
      </group>
    </group>
  );
}

useGLTF.preload("/models/items/Pizarron-transformed.glb");
