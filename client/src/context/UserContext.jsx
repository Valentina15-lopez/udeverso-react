import React, { createContext, useEffect, useState, useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import { SocketContext } from "../../src/context/ContexProvider";

// Definición de la forma de los valores del contexto
const UserContext = createContext({
  userId: "",
  userName: "",
  setUserName: (userName) => {},
});

// Componente proveedor de contexto de usuario
const UserProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);

  // Estado local para almacenar el ID de usuario
  const [userId] = useState(localStorage.getItem("userId") || uuidV4());
  // Estado local para almacenar el nombre de usuario
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || ""
  );
  const [usersList, setUsersList] = useState([]);

  console.log("userId", userId);

  // Efecto para guardar el nombre de usuario en el almacenamiento local
  useEffect(() => {
    localStorage.setItem("userName", userName);
  }, [userName]);

  // Efecto para guardar el ID de usuario en el almacenamiento local
  useEffect(() => {
    localStorage.setItem("userId", userId);
    socket.on("usersList", (usersList) => {
      console.log("Lista de usuarios:", usersList);
      setUsersList(usersList);
      // Aquí puedes hacer lo que necesites con la lista de usuarios
    });
  }, [userId]);

  // Renderiza el proveedor de contexto de usuario con sus valores proporcionados a los hijos
  return (
    <UserContext.Provider value={{ userId, userName, setUserName, usersList }}>
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
