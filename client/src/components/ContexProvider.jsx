import React, { createContext, useState, useRef, useEffect } from "react";
import { atom, useAtom } from "jotai";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const SocketContext = createContext();

export const avatarAtom = atom([]);
export const usernameAtom = atom([]);
export const idsAtom = atom([]);
export const socket = io("http://localhost:3001");

const ContextProvider = ({ children }) => {
  const [avatar, setAvatar] = useAtom(avatarAtom);
  const [username, setUsername] = useAtom(usernameAtom);
  const [me, setMe] = useAtom(idsAtom);

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

    function onCharacters(value) {
      setAvatar(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("me", (id) => setMe(id));
    socket.on("username", (name) => setUsername(name));

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
    };
  }, [username]);
  return (
    <SocketContext.Provider
      value={{
        me,
        username,
        avatar,
        socket,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
