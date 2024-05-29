import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "../src/context/ContexProvider";
import App from "./App";
import pdfjs from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = "https://d2v5g.csb.app/pdf.worker.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
