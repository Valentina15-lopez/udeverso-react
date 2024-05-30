import React, { useEffect, useRef, useState } from "react";
import pdfjs from "pdfjs-dist";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

pdfjs.GlobalWorkerOptions.workerSrc =
  window.location.origin + "/pdf.worker.min.js";

export const PDFView = ({ file }) => {
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pdfImages, setPdfImages] = useState([]);
  const texture = useLoader(THREE.TextureLoader, pdfImages[page - 1] || "");
  const canvasRef = useRef(null);
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
      {loading ? (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-white text-lg">Cargando...</p>
          </div>
        </div>
      ) : (
        <>
          <canvas
            ref={canvasRef}
            style={{
              position: "absolute",
              width: "25%",
              right: 47,
              bottom: 121,
            }}
          />
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
        </>
      )}
    </>
  );
};
