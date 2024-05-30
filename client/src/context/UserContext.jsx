import React, { createContext, useEffect, useState, useContext } from "react";
import { v4 as uuidV4 } from "uuid";
import { SocketContext } from "../../src/context/ContexProvider";
import axios from "axios";

// Definición de la forma de los valores del contexto
const UserContext = createContext({
  userId: "",
  userName: "",
  setUserName: (userName) => {},
});

// Componente proveedor de contexto de usuario
const UserProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
  {
    console.log("entro al user provider");
  }
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          "https://metaversoude2.ddns.net:3001/api/checkAuth",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          const userData = await axios.get(
            `https://metaversoude2.ddns.net:3001/api/users/${response.data.usuario}`
          );
          setUser(userData.data);
          console.log(userData.data);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, []);

  // Renderiza el proveedor de contexto de usuario con sus valores proporcionados a los hijos
  return (
    <UserContext.Provider
      value={{ userId, userName, setUserName, usersList, user, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export { UserProvider, UserContext };
