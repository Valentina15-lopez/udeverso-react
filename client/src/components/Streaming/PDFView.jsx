import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import pdfjs from "pdfjs-dist";

const PDFView = ({ file }) => {
  const [page, setPage] = useState(1);
  const [pdfImages, setPdfImages] = useState([]);
  const texture = useLoader(THREE.TextureLoader, pdfImages[page - 1] || "");

  useEffect(() => {
    const loadPDF = async () => {
      try {
        const arrayBuffer = file;
        const pdfData = new Uint8Array(arrayBuffer);
        const loadingTask = pdfjs.getDocument({ data: pdfData });
        const pdf = await loadingTask.promise;
        const totalPageCount = pdf.numPages;

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
          setPdfImages((prevImages) => [...prevImages, imageDataUrl]);
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
    };

    if (file) {
      loadPDF();
    }
  }, [file]);

  return (
    <>
      <Html transform position={[0, 0, 0]}>
        <button
          onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 1))}
        >
          Prev
        </button>
        <button
          onClick={() =>
            setPage((prevPage) => Math.min(prevPage + 1, pdfImages.length))
          }
        >
          Next
        </button>
      </Html>
      {texture && (
        <mesh position={[0, 0, -1]}>
          <planeGeometry args={[2, 2]} />
          <meshBasicMaterial map={texture} />
        </mesh>
      )}
    </>
  );
};

export default PDFView;
