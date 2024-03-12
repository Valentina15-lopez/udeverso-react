import React, { useEffect, useRef, useContext } from "react";
import Peer from "peerjs";
import { SocketContext, socket, usernameAtom, idsAtom } from "./ContexProvider";
import { useAtom } from "jotai";

const LiveStreamingComponent = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const videoContainerRef = useRef(null);
  const { me, username } = useContext(SocketContext);
  const [usernames] = useAtom(usernameAtom);
  const [ids] = useAtom(idsAtom);

  console.log("usernames", usernames);
  console.log("ids", ids);

  useEffect(() => {
    let peer;

    const publicarMensaje = (msg) => {
      // Puedes manejar la lógica para mostrar mensajes en tu interfaz aquí
      console.log(msg);
    };

    const loadCamera = (stream) => {
      videoRef.current.srcObject = stream;
      publicarMensaje("Cámara funcionando");
    };

    const errorCamera = () => {
      publicarMensaje("Error al acceder a la cámara");
    };

    const setupWebRTC = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        loadCamera(stream);

        peer = new Peer({
          initiator: true,
          trickle: false,
          stream,
        });

        peer.on("signal", (data) => {
          socket.emit("callAllUsers", {
            signalData: data,
            from: me,
            name: username,
          });
        });

        peer.on("stream", (currentStream) => {
          const newVideo = document.createElement("video");
          newVideo.srcObject = currentStream;
          newVideo.autoplay = true;
          videoContainerRef.current.appendChild(newVideo);
        });

        socket.on("callAccepted", (signal) => {
          peer.signal(signal);
        });
      } catch (error) {
        console.error("Error al obtener la corriente de medios local:", error);
      }
    };

    setupWebRTC();

    const intervalId = setInterval(() => {
      const context = canvasRef.current.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, context.width, context.height);
      socket.emit("stream", canvasRef.current.toDataURL("image/webp"));
    }, 30);

    return () => {
      clearInterval(intervalId);
      if (peer) {
        peer.destroy();
      }
      socket.disconnect();
    };
  }, []); // La dependencia vacía asegura que useEffect solo se ejecute una vez

  return (
    <div>
      <h1>Emisión en directo</h1>
      <video
        ref={videoRef}
        style={{ width: "800px", height: "600px" }}
        autoPlay
      />
      <canvas ref={canvasRef} id="preview" width="512" height="384" />
      <div ref={videoContainerRef} id="videoContainer" />
      <div className="status" />
    </div>
  );
};

export default LiveStreamingComponent;
