import React, { useEffect, useContext, useState, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";

import { UserContext } from "../context/UserContext";

export function Pizarron(props) {
  const { nodes, materials } = useGLTF(
    "/models/items/Pizarron-transformed.glb"
  );
  const { userName } = useContext(UserContext);

  const { screenStream, peers, screenSharingId, fileTexture, userId } =
    useContext(RoomContext);
  const [materialTexture, setMaterialTexture] = useState(null);

  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const response = await axios.get(
          `https://metaversoude2.ddns.net:3001/api/users/${userName}/material`
        );
        const materials = response.data;

        console.log("materialesfetchmateriales", materials);

        // Encuentra el material con nombre "fileTexture"
        const fileTextureMaterial = materials.find(
          (material) => material.nombre === fileTexture
        );

        if (fileTextureMaterial) {
          const textureLoader = new THREE.TextureLoader();
          const texture = await textureLoader.loadAsync(
            fileTextureMaterial.path
          );
          setMaterialTexture(texture);
        }
      } catch (error) {
        console.error("Error al obtener materiales:", error);
      }
    };

    fetchMaterials();
  }, [userName, fileTexture]);

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
