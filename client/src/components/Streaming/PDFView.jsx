import React, { useEffect, useRef, useState } from "react";
import * as pdfjsLib from "pdfjs-dist";

pdfjsLib.GlobalWorkerOptions.workerSrc =
  window.location.origin + "/pdf.worker.min.mjs";

export const PDFView = ({ file, className, width, height, padding }) => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAndRenderPDF = async (file) => {
      setLoading(true);
      // eslint-disable-next-line no-undef
      const loadingTask = pdfjsLib.getDocument(file);

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
        className={className}
        style={{
          position: "absolute",
          width: width - padding * 2,
          height: height - padding * 2,
          top: padding,
          left: padding,
        }}
      />
    </>
  );
};
