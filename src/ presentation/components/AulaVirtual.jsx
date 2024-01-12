import React from "react";
import AulaScene from "../scenes/AulaScene";

const AulaVirtual = () => {
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <AulaScene />
      <div className="aula">
        <div id="canvas-container"></div>
      </div>
    </div>
  );
};

export default AulaVirtual;
