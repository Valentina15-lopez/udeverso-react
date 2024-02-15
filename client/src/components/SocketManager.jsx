import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export const useSocketManager = () => {
  const [characters, setCharacters] = useState([]);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:3001", {
      // Puedes añadir configuraciones adicionales aquí, si es necesario
    });

    setSocket(newSocket);

    const handleConnect = (userId) => {
      console.log(`User connected: ${userId}`);

      // Agregar el nuevo usuario a la lista de personajes
      setCharacters((prevCharacters) => [
        ...prevCharacters,
        {
          id: userId,
          position: [Math.random() * 3, 0, Math.random() * 3],
          color: "#" + ((userId + 1) * 16777215).toString(16),
        },
      ]);
    };

    const handleDisconnect = (userId) => {
      console.log(`User disconnected: ${userId}`);

      // Eliminar al usuario desconectado de la lista de personajes
      setCharacters((prevCharacters) =>
        prevCharacters.filter((character) => character.id !== userId)
      );
    };

    const handleCharacters = (updatedCharacters) => {
      setCharacters(updatedCharacters);
    };

    newSocket.on("connect", () => {
      handleConnect(newSocket.id);
    });

    newSocket.on("disconnect", () => {
      handleDisconnect(newSocket.id);
    });

    newSocket.on("characters", handleCharacters);

    return () => {
      newSocket.off("connect", handleConnect);
      newSocket.off("disconnect", handleDisconnect);
      newSocket.off("characters", handleCharacters);
      newSocket.disconnect();
    };
  }, []);

  return { socket, characters, setCharacters };
};
