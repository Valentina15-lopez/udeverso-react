import React, {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from "react";
import * as THREE from "three";

import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { peersReducer } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
} from "../reducers/peerActions";
import { SocketContext } from "../context/ContexProvider";
import { UserContext } from "../context/UserContext";
import { Modal } from "../common/Modal"; // Asegúrate de importar el modal

// Creación del contexto de la sala
export const RoomContext = createContext({
  peers: {},
  shareScreen: () => {},
  setRoomId: (id) => {},
  screenSharingId: "",
  roomId: "",
});

export const RoomProvider = ({ children }) => {
  const { socket } = useContext(SocketContext);
  const [fileTexture, setFileTexture] = useState(null);
  const navigate = useNavigate();
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState();
  const [stream, setStream] = useState();
  const [screenStream, setScreenStream] = useState();
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const enterRoom = ({ roomId }) => {
    console.log("En 46 el screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    navigate(`/aulavirtual/${roomId}`);
  };

  const getUsers = ({ participants }) => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId) => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    dispatch(removePeerStreamAction(peerId));
  };

  const [connections, setConnections] = useState({});

  useEffect(() => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    if (!me) return;

    me.on("connection", (conn) => {
      // Almacenar la nueva conexión en el estado
      setConnections((prevConnections) => {
        const newConnections = {
          ...prevConnections,
          [conn.peer]: conn,
        };
        return newConnections;
      });

    });


    return () => {
      me.off("connection");
    };
  }, [me]);

  const switchStream = (newStream) => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    setScreenSharingId(me?.id || "");
    console.log('Switching stream. Current connections:', connections); // Agregar registro de consola para las conexiones actuales
    Object.values(connections).forEach((connection) => {
      const videoTrack = newStream
          ?.getTracks()
          .find((track) => track.kind === "video");
      connection.peerConnection
          .getSenders()
          .find((sender) => sender.track.kind === "video")
          .replaceTrack(videoTrack)
          .then(() => console.log('Stream switched for connection:', connection)) // Agregar registro de consola cuando el flujo se cambia exitosamente
          .catch((err) => {
            console.error('Error switching stream for connection:', connection, err); // Agregar registro de consola cuando ocurre un error al cambiar el flujo
          });
    });
  };

  const shareScreen = (switchToCamera = false) => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    if (Object.keys(connections).length === 0) {
      return;
    }

    if (switchToCamera) {
      setScreenSharingId("");
      console.log("En sharScreen tengo que switchear a la camara, el screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
      navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            switchStream(stream);
            setScreenStream(stream);
          });
    } else if (screenSharingId) {
      console.log("En shareScreen el screeSharingId es':",screenSharingId); // Agregar registro de consola para el screenSharingId
      navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(switchStream);
    } else {
      console.log("En shareScreen el screenSharingId es:",screenSharingId); // Agregar registro de consola para el screenSharingId
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        switchStream(stream);
        setScreenStream(stream);
      });
    }
  };

  const nameChangedHandler = ({ peerId, userName }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    socket.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    const peer = new Peer(userId, {
      host: "metaversoude2.ddns.net",
      port: 9000,
      path: "/",
    });

    setMe(peer);

    peer.on('error', (err) => {
      console.error('PeerJS error:', err);
    });

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        })
        .catch((error) => {
          console.error(error);
          setModalOpen(true); // Abrir el modal si no se concede el permiso
        });
    } catch (error) {
      console.error(error);
      setModalOpen(true); // Abrir el modal si no se concede el permiso
    }

    socket.on("room-created", enterRoom);
    socket.on("room-joined", enterRoom);
    socket.on("get-users", getUsers);
    socket.on("user-disconnected", removePeer);
    socket.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    socket.on("user-stopped-sharing", () => setScreenSharingId(""));
    socket.on("name-changed", nameChangedHandler);

    return () => {
      socket.off("room-created");
      socket.off("room-joined");
      socket.off("get-users");
      socket.off("user-disconnected");
      socket.off("user-started-sharing");
      socket.off("user-stopped-sharing");
      socket.off("user-joined");
      socket.off("name-changed");
      me?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    if (screenSharingId) {
      socket.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      socket.emit("stop-sharing");
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {
    console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
    if (!me) return;
    if (!stream) return;
    socket.on("user-joined", ({ peerId, userName: name }) => {
      console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
        dispatch(addPeerStreamAction(peerId, peerStream));

        // Agregar la llamada a las conexiones
        setConnections((prevConnections) => {
          const newConnections = {
            ...prevConnections,
            [peerId]: call,
          };
          return newConnections;
        });
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on("call", (call) => {
      console.log("El screenSharingId es:", screenSharingId); // Agregar registro de consola para el screenSharingId
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });

    });

    return () => {
      socket.off("user-joined");
      me.off("call");
    };
  }, [me, stream, userName]);

  return (
    <RoomContext.Provider
      value={{
        stream,
        screenStream,
        peers,
        shareScreen,
        roomId,
        setRoomId,
        screenSharingId,
        setScreenSharingId,
        setFileTexture,
        fileTexture,
        setScreenStream,
      }}
    >
      {children}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
        <h1>Acceso a la cámara denegado</h1>
        <p>No puede interactuar en UDEVERSO sin habilitar la cámara.</p>
        <p>Por favor, conceda el permiso y recargue la pagina.</p>
      </Modal>
    </RoomContext.Provider>
  );
};
