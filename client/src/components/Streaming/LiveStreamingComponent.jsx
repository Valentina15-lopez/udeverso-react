import React, { useEffect, useRef, useContext } from "react";
import Peer from "peerjs";
import { SocketContext, userAtom, roomAtom } from "../ContexProvider";
import { io } from "socket.io-client";
import { useAtom } from "jotai";
import { v4 as uuidV4 } from "uuid";

const LiveStreamingComponent = () => {
  const [rooms] = useAtom(roomAtom);
  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const [users] = useAtom(userAtom);
  console.log("usernames", users);
  const roomId = uuidV4(); // Genera el ID único
  console.log("roomId", roomId); // Verifica si el ID se genera correctamentes
  const myPeer = useRef(null);
  const peers = useRef({});

  useEffect(() => {
    // Inicializar PeerJS
    const socket = io("/");

    myPeer.current = new Peer(undefined, {
      host: "/",
      port: "3001",
    });

    // Obtener el stream del usuario actual
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        // Añadir el stream de vídeo del usuario actual
        addVideoStream(myVideoRef.current, stream);

        // Cuando se recibe una llamada, contestarla y añadir el stream del usuario remoto
        myPeer.current.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        // Cuando un nuevo usuario se conecta, establecer conexión y añadir su stream
        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    // Manejar la desconexión de un usuario
    socket.on("user-disconnected", (userId) => {
      if (peers.current[userId]) {
        peers.current[userId].close();
        delete peers.current[userId];
      }
    });

    // Al abrir la conexión PeerJS, unirse a la sala de chat
    myPeer.current.on("open", (id) => {
      socket.emit("join-room", rooms, id);
    });

    // Limpiar efecto
    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, []); // Solo se ejecuta una vez al montar el componente

  function connectToNewUser(userId, stream) {
    const call = myPeer.current.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
    call.on("close", () => {
      video.remove();
    });

    peers.current[userId] = call;
  }

  function addVideoStream(video, stream) {
    if (!video) {
      // Si el elemento de vídeo es nulo, creamos uno nuevo
      video = document.createElement("video");
    }
    video.srcObject = stream;
    console.log("videoUsuario", video);
    video.addEventListener("loadedmetadata", () => {
      video.play();
    });

    const videoGrid = document.getElementById("video-grid");
    if (videoGrid) {
      videoGrid.appendChild(video);
    }
  }

  return (
    <div>
      <div id="video-grid"></div>
    </div>
  );
};

export default LiveStreamingComponent;
