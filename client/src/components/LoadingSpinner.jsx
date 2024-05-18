import React from "react";
import { Spinner } from "react-bootstrap"; // Importa el spinner de la biblioteca de Bootstrap

const LoadingSpinner = () => {
  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Spinner animation="border" role="status">
        <span className="sr-only">Cargando...</span>
      </Spinner>
    </div>
  );
};

export default LoadingSpinner;
