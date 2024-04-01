import React from "react";
import { Link } from "react-router-dom";

const Abm = () => {
  return (
    <div>
      <h1>ABM USUARIOS</h1>
      <nav>
        <ul>
          <li>
            <Link to="/abm/createUsers">Crear Usuario</Link>
          </li>
          <li>
            <Link to="/abm/listUsers">Lista de Usuarios</Link>
          </li>
          <li>
            <Link to="/abm/modifyUsers">Modificar Usuario</Link>
          </li>
          <li>
            <Link to="/abm/material">Insertar Material</Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Abm;
