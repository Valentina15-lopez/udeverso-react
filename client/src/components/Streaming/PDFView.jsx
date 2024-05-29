import React, { useEffect, useRef, useState } from "react";
import pdfjs from "pdfjs-dist";

export const PDFPreview = ({ file }) => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
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
    if (file) {
      loadAndRenderPDF(file);
    }
  }, [file]);

  return (
    <>
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
          top: 10,
          left: 10,
        }}
      />
    </>
  );
};
