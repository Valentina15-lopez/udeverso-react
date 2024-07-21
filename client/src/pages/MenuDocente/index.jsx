import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const MenuDocente = () => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/login");
  };
  return (
    <div className="flex justify-center items-center  ">
      <div className="max-w-md w-full overflow-hidden my-8">
        <h1 className="text-2xl font-semibold text-center mb-4">
          MENU DOCENTE
        </h1>
        <nav>
          <ul>
            <li>
              <Link
                to="/inicioDocente"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Crear sala
              </Link>
            </li>
            <li>
              <Link
                to="/abm/material"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Insertar Material
              </Link>
            </li>
            <li>
              <Link
                to="/abm/listMaterials"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Listar materiales
              </Link>
            </li>
            <li>
              <button
                type="button"
                onClick={handleBackToHome}
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Volver al inicio
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default MenuDocente;
