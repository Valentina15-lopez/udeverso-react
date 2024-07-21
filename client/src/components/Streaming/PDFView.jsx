import React, { useEffect, useRef, useState } from "react";
import { getDocument } from "pdfjs-dist";

export const PDFView = ({ file }) => {
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef(null);

  useEffect(() => {
    const loadAndRenderPDF = async (file) => {
      setLoading(true);
      // eslint-disable-next-line no-undef
      const loadingTask = getDocument(file);

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
        <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
          <div className="flex flex-col justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
            <p className="text-white text-lg">Cargando...</p>
          </div>
        </div>
      )}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          width: "25%",
          right: 47,
          bottom: 121,
        }}
      />
    </>
  );
};
