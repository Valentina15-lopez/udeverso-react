import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-semibold text-center mb-4 text-red-500">
          Acceso Denegado
        </h1>
        <p className="text-center text-gray-700 mb-6">
          No tienes permiso para acceder a esta página.
        </p>
        <div className="text-center">
          <Link
            to="/"
            className="inline-block py-2 px-4 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
          >
            Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
