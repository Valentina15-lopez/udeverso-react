import React from "react";
import {Link} from "react-router-dom";

const Abm = () => {
  return (
      <div>
          <h1>ABM</h1>
          <div>
              <nav>
                  <ul>
                      <li>
                          <Link to="/asignar-alumno-sala">Asignar alumno a sala</Link>
                      </li>
                      <li>
                          <Link to="/asignar-docente-sala">Asignar docente a sala</Link>
                      </li>
                      <li>
                          <Link to="/borrar-sala">Borrar sala</Link>
                      </li>
                      <li>
                          <Link to="/borrar-usuario">Borrar usuario</Link>
                      </li>
                      <li>
                          <Link to="/buscar-usuario">Buscar usuario</Link>
                      </li>
                      <li>
                          <Link to="/cambiar-docente-sala">Cambiar docente de sala</Link>
                      </li>
                      <li>
                          <Link to="/ver-salas">Ver salas</Link>
                      </li>
                      <li>
                          <Link to="/borrar-material-docente">Borrar material de docente</Link>
                      </li>
                      <li>
                          <Link to="/login">Login</Link>
                      </li>
                      <li>
                          <Link to="/salir-sala">Salir de sala</Link>
                      </li>
                  </ul>
              </nav>
          </div>
      </div>
  );
};

export default Abm;
