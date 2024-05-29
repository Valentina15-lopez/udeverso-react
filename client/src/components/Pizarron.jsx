import React, { useEffect, useContext, useState, useRef } from "react";
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
  const { userName } = useContext(UserContext);

  const { screenStream, peers, screenSharingId, fileTexture, userId } =
    useContext(RoomContext);
  const [materialTexture, setMaterialTexture] = useState(null);
  const [pdfImages, setPdfImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);
  const loadAndRenderPDF = async (file) => {
    setLoading(true);
    // eslint-disable-next-line no-undef
    const loadingTask = pdfjs.getDocument(file);

    try {
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);

      const canvas = canvasRef.current;
      const context = canvas.getContext("2d");
      const viewport = page.getViewport({ scale: 1 });

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      });
    } catch (error) {
      console.error("Error loading PDF:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        const response = await axios.get(
          `https://metaversoude2.ddns.net:3001/api/users/${userName}/material/${fileTexture}`
        );
        const material = response.data;

        if (material && material.material && material.material.data) {
          const materialBuffer = new Uint8Array(material.material.data);
          if (material.ext === "pdf") {
            await loadAndRenderPDF(materialBuffer);
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

  const loadImage = (buffer, ext) => {
    const blob = new Blob([buffer], { type: `image/${ext}` });
    const image = new Image();
    const objectURL = URL.createObjectURL(blob);

    image.onload = () => {
      const texture = new THREE.Texture();
      texture.image = image;
      texture.needsUpdate = true;
      setMaterialTexture(texture);
      URL.revokeObjectURL(objectURL);
    };

    image.src = objectURL;
  };

  const loadPDF = async (pdfData) => {
    const loadingTask = pdfjs.getDocument({ data: pdfData });
    const pdf = await loadingTask.promise;
    const totalPageCount = pdf.numPages;

    const images = [];
    for (let i = 1; i <= totalPageCount; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      };
      await page.render(renderContext).promise;

      const imageDataUrl = canvas.toDataURL();
      const image = new Image();
      image.src = imageDataUrl;
      images.push(image);
    }

    setPdfImages(images);
    showPage(currentPage);
  };

  const showPage = (pageNumber) => {
    if (pageNumber < 0 || pageNumber >= pdfImages.length) {
      return;
    }

    const image = pdfImages[pageNumber];
    const texture = new THREE.Texture(image);
    texture.needsUpdate = true;

    setMaterialTexture(texture);
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
      {loading && (
        <div style={{ position: "absolute", top: "48%", left: "43%" }}>
          Loading...
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: 100,
          height: 100,
        }}
      />
    </group>
  );
}

useGLTF.preload("/models/items/Pizarron-transformed.glb");
