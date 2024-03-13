import React, { useEffect, useRef, useContext } from "react";
import Peer from "peerjs";
import { SocketContext, socket, userAtom } from "./ContexProvider";
import { useAtom } from "jotai";

const LiveStreamingComponent = () => {
  const myVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const [users] = useAtom(userAtom);

  console.log("usernames", users);
  const { me, name, call } = useContext(SocketContext);

  useEffect(() => {
    let peer;

    const publicarMensaje = (msg) => {
      // Puedes manejar la lógica para mostrar mensajes en tu interfaz aquí
      console.log(msg);
    };

    const loadCamera = (stream) => {
      myVideoRef.current.srcObject = stream;
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
          socket.emit("answerCall", { signal: data, to: call.from });
          socket.emit("callUser", {
            signalData: data,
            from: me,
            name,
          });
        });

        peer.on("stream", (currentStream) => {
          userVideoRef.srcObject = currentStream;
        });

        socket.on("callAccepted", (signal) => {
          peer.signal(signal);
        });
      } catch (error) {
        console.error("Error al obtener la corriente de medios local:", error);
      }
    };

    setupWebRTC();

    return () => {
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
        ref={myVideoRef}
        style={{ width: "800px", height: "600px" }}
        autoPlay
      />
      <video
        ref={userVideoRef}
        style={{ width: "800px", height: "600px" }}
        autoPlay
      />
    </div>
  );
};

export default LiveStreamingComponent;
