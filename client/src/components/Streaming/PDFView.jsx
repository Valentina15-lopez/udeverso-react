import React, { useEffect, useRef, useState } from "react";
import pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc =
  window.location.origin + "/pdf.worker.min.js";

export const PDFView = ({ file, onRender }) => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAndRenderPDF = async (file) => {
      setLoading(true);
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
        }).promise;

        if (onRender) {
          onRender(canvas);
        }
      } catch (error) {
        console.error("Error loading PDF:", error);
      }
      setLoading(false);
    };

    if (file) {
      loadAndRenderPDF(file);
    }
  }, [file, onRender]);

  return (
    <div style={{ display: "none" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};
