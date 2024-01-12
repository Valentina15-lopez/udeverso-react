import React, { createContext, useContext, useState } from "react";
import AulaService from "./AulaService";
const http = require("http");

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [mySocket, setMySocket] = useState(null);

  const initSocket = () => {
    const socket = AulaService.initSocketConnection((clientId) => {
      // Lógica para agregar un cliente
      console.log("Adding client with id:", clientId);
    });
    // Almacenar el socket en el estado
    setMySocket(socket);
  };

  return (
    <SocketContext.Provider value={{ mySocket, initSocket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};
