import React, { createContext, useEffect, useState } from "react";
import { v4 as uuidV4 } from "uuid";

// Definición de la forma de los valores del contexto
const UserContext = createContext({
  userId: "",
  userName: "",
  setUserName: (userName) => {},
});

// Componente proveedor de contexto de usuario
const UserProvider = ({ children }) => {
  // Estado local para almacenar el ID de usuario
  const [userId] = useState(localStorage.getItem("userId") || uuidV4());
  // Estado local para almacenar el nombre de usuario
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );

  // Efecto para guardar el nombre de usuario en el almacenamiento local
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  // Efecto para guardar el ID de usuario en el almacenamiento local
  useEffect(() => {
    localStorage.setItem("userId", userId);
  }, [userId]);

  // Renderiza el proveedor de contexto de usuario con sus valores proporcionados a los hijos
  return (
    <UserContext.Provider value={{ userId, userName, setUserName }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
