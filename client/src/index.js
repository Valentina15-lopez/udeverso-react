import React from "react";
import ReactDOM from "react-dom/client";
import { ContextProvider } from "../src/context/ContexProvider";
import App from "./App";
import pdfjs from "pdfjs-dist";
import urlWorker from "./pdf.worker";

pdfjs.GlobalWorkerOptions.workerSrc = urlWorker;

ReactDOM.createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <App />
  </ContextProvider>
);
