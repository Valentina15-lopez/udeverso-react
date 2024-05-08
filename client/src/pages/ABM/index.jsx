import React from "react";
import { Link } from "react-router-dom";

const Abm = () => {
  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md w-full overflow-hidden my-8">
        <h1 className="text-2xl font-semibold text-center mb-4">
          ABM USUARIOS
        </h1>
        <nav>
          <ul>
            <li>
              <Link
                to="/abm/createUsers"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Crear Usuario
              </Link>
            </li>
            <li>
              <Link
                to="/abm/listUsers"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Lista de Usuarios
              </Link>
            </li>
            <li>
              <Link
                to="/abm/modifyUsers"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Modificar Usuario
              </Link>
            </li>
            <li>
              <Link
                to="/abm/deleteUsers"
                className="block py-2 px-4 mb-2 bg-indigo-500 text-white font-semibold rounded-md text-center hover:bg-indigo-600 transition duration-300"
              >
                Borrar Usuario
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Abm;
