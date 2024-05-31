import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../common/Button";

const NotFound = () => {
  const navigate = useNavigate();

  // Función para manejar la redirección a la página anterior
  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior en el historial
  };
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4 text-red-500">
          PAGINA NO ENCONTRADA
        </h1>
        <div className="flex flex-col gap-2">
          <Button onClick={handleGoBack}>Volver al inicio</Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
