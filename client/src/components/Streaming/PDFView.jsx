import React, { useEffect, useRef, useState, useContext } from "react";
import pdfjs from "pdfjs-dist";
import { Html } from "@react-three/drei";
import { RoomContext } from "../../context/RoomContext";

export const PDFView = ({ file }) => {
  const [loading, setLoading] = useState(false);
  const { screenStream } = useContext(RoomContext);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAndRenderPDF = async (screenStream) => {
      setLoading(true);
      // eslint-disable-next-line no-undef
      const loadingTask = pdfjs.getDocument(screenStream);

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
    if (screenStream) {
      loadAndRenderPDF(screenStream);
    }
  }, [screenStream]);

  return (
    <>
      <Html transform width={"300px"} height={"300px"}>
        <canvas ref={canvasRef} />
      </Html>
    </>
  );
};
