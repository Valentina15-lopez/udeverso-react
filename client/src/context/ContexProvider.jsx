import React, { createContext, useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const userAtom = atom([]);
export const roomAtom = atom([]);
export const mapAtom = atom(null);

export const socket = io("https://metaversoude2.ddns.net:3001");

const ContextProvider = ({ children }) => {
  const [user, setUser] = useAtom(userAtom);
  const [room, setRoom] = useAtom(roomAtom);
  const [_map, setMap] = useAtom(mapAtom);
  const [call, setCall] = useState({});

  const onPlayerMove = (value) => {
    setUser((prev) => {
      return prev.map((user) => {
        if (user.id === value.id) {
          return value;
        }
        return user;
      });
    });
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    socket.on("hello", () => {
      console.log("Received hello from server");
    });

    socket.on("usersList", (value) => {
      setUser(value);
    });

    socket.on("rooms", (value) => {
      setRoom(value);
    });
    socket.on("playerMove", onPlayerMove);

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ user, socket, call, room }}>
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
