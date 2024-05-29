import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "../src/context/ContexProvider";
import App from "./App";
import pdfjs from "pdfjs-dist";
import workerurl from "../public/pdf.worker";

pdfjs.GlobalWorkerOptions.workerSrc = workerurl;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
