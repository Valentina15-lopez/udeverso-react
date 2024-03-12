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
  const [name, setName] = useState("");
  const [me, setMe] = useAtom(idsAtom);
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

    function onCharacters(value) {
      setAvatar(value);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("hello", onHello);
    socket.on("characters", onCharacters);
    socket.on("me", (id) => setMe(id));

    socket.on("callUser", ({ from, name: callerName, signal }) => {
      setCall({ isReceivingCall: true, from, name: callerName, signal });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("hello", onHello);
      socket.off("characters", onCharacters);
    };
  }, []);
  return (
    <SocketContext.Provider
      value={{
        me,
        avatar,
        socket,
        call,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export { ContextProvider, SocketContext };
