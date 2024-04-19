import React, { useEffect, useRef, useContext } from "react";
import Peer from "peerjs";
import { SocketContext, userAtom, roomAtom } from "../ContexProvider";
import { useAtom } from "jotai";
import { v4 as uuidV4 } from "uuid";

const LiveStreamingComponent = () => {
  const [rooms] = useAtom(roomAtom);
  const myVideoRef = useRef(null);
  const [users] = useAtom(userAtom);
  const { socket } = useContext(SocketContext);
  const myPeer = useRef(null);
  const peers = useRef({});

  useEffect(() => {
    const roomId = uuidV4(); // Genera el ID único

    // Inicializar PeerJS
    myPeer.current = new Peer(undefined, {
      host: "/",
      port: "3002",
    });

    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        addVideoStream(myVideoRef.current, stream);

        myPeer.current.on("call", (call) => {
          call.answer(stream);
          const video = document.createElement("video");
          call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
          });
        });

        socket.on("user-connected", (userId) => {
          connectToNewUser(userId, stream);
        });
      });

    socket.on("user-disconnected", (userId) => {
      if (peers.current[userId]) {
        peers.current[userId].close();
        delete peers.current[userId];
      }
    });

    myPeer.current.on("open", (id) => {
      socket.emit("join-room", roomId, id); // Envía el ID de la sala al servidor
    });

    return () => {
      socket.off("user-connected");
      socket.off("user-disconnected");
    };
  }, []);

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
      video = document.createElement("video");
    }
    video.srcObject = stream;
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
      <div id="video-grid">
        <video ref={myVideoRef} muted autoPlay playsInline />
        {console.log("USERS", users)}
        {users.map((user) => (
          <video key={user.id} id={user.id} playsInline autoPlay />
        ))}
      </div>
    </div>
  );
};

export default LiveStreamingComponent;
