import React, { createContext, useState, useRef, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { io } from "socket.io-client";

const SocketContext = createContext();

export const userAtom = atom([]);
export const roomAtom = atom([]);
export const socket = io("http://localhost:3001");

const ContextProvider = ({ children }) => {
  const [user, setUser] = useAtom(userAtom);
  const [room, setRoom] = useAtom(userAtom);
  const [call, setCall] = useState({});

  useEffect(() => {
    function onConnect() {
      console.log("connected");
    }
    function onDisconnect() {
      console.log("disconnected");
    }

    function onHello() {
      console.log("hello");
    }

    function onUsers(value) {
      setUser(value);
    }
    function onRooms(value) {
      setRoom(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("users", onUsers);
    socket.on("rooms", onRooms);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("users", onUsers);
      socket.off("rooms", onRooms);
    };
  }, []);
  return (
    <SocketContext.Provider
      value={{
        user,
        socket,
        call,
        room,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
