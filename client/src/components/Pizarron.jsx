import React, { useEffect, useContext, useState } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";
import pdfjs from "pdfjs-dist";

export function Pizarron(props) {
  const { nodes, materials } = useGLTF(
    "/models/items/Pizarron-transformed.glb"
  );
  const { fileTexture, setScreenStream } = useContext(RoomContext);
  const [materialTexture, setMaterialTexture] = useState(null);

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
