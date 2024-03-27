import React, { useState } from "react";
import CreateUser from "../../components/Administrador/CreateUser";
import UserList from "../../components/Administrador/UserList";
import ModifyUser from "../../components/Administrador/ModifyUser";

const Abm = () => {
  const [currentComponent, setCurrentComponent] = useState(null);

  const changeComponent = (component) => {
    setCurrentComponent(component);
  };
  return (
    <div>
      <h1>ABM USUARIOS</h1>
      <nav>
        <ul>
          <li onClick={() => changeComponent("crear")}>Crear Usuario</li>
          <li onClick={() => changeComponent("lista")}>Lista de Usuarios</li>
          <li onClick={() => changeComponent("modificar")}>
            Modificar Usuario
          </li>
        </ul>
      </nav>
      <div>
        {currentComponent === "crear" && <CreateUser />}
        {currentComponent === "lista" && <UserList />}
        {currentComponent === "modificar" && <ModifyUser />}
      </div>
    </div>
  );
};

export default Abm;
