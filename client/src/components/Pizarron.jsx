import React, { useEffect, useState, useContext } from "react";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { UserContext } from "../context/UserContext";
import { RoomContext } from "../context/RoomContext";
import axios from "axios";
import pdfjs from "pdfjs-dist";
import { PDFView } from "../components/Streaming/PDFView"; // Asegúrate de importar PDFView correctamente

pdfjs.GlobalWorkerOptions.workerSrc =
  window.location.origin + "/pdf.worker.min.js";

export function Pizarron(props) {
  const { nodes, materials } = useGLTF(
    "/models/items/Pizarron-transformed.glb"
  );
  const { userName } = useContext(UserContext);
  const { fileTexture, setScreenStream } = useContext(RoomContext);
  const [materialTexture, setMaterialTexture] = useState(null);

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await axios.get(
          `https://metaversoude2.ddns.net:3001/api/users/${userName}/material/${fileTexture}`
        );
        const material = response.data;

        if (material && material.material && material.material.data) {
          const materialBuffer = new Uint8Array(material.material.data);
          setScreenStream(materialBuffer);

          if (material.ext === "pdf") {
            return; // PDFView se encargará de renderizar el PDF
          } else {
            loadImage(materialBuffer, material.ext);
          }
        }
      } catch (error) {
        console.error("Error al obtener material:", error);
      }
    };

    fetchMaterial();
  }, [userName, fileTexture]);

  const handlePDFRender = (canvas) => {
    const texture = new THREE.Texture(canvas);
    texture.needsUpdate = true;
    setMaterialTexture(texture);
  };

  const loadImage = (buffer, ext) => {
    const blob = new Blob([buffer], { type: `image/${ext}` });
    const image = new Image();
    const objectURL = URL.createObjectURL(blob);

    image.onload = () => {
      const texture = new THREE.Texture(image);
      texture.needsUpdate = true;
      setMaterialTexture(texture);
      URL.revokeObjectURL(objectURL);
    };

    image.src = objectURL;
  };

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
      {fileTexture && <PDFView file={fileTexture} onRender={handlePDFRender} />}
    </group>
  );
}

useGLTF.preload("/models/items/Pizarron-transformed.glb");
