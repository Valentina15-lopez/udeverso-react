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
  const [currentStream, setCurrentStream] = useState(null); // Nuevo estado para almacenar el flujo actual
  const [attemptedScreenShare, setAttemptedScreenShare] = useState(false);

  const enterRoom = ({ roomId }) => {
    navigate(`/aulavirtual/${roomId}`);
  };

  const getUsers = ({ participants }) => {
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const [connections, setConnections] = useState({});

  useEffect(() => {
    if (!me) return;

    me.on("call", (call) => {
      console.log('Call established 65:', call);
    });

    me.on("connection", (conn) => {
      console.log('New connection 65:', conn); // Agregar registro de consola para las nuevas conexiones
      // Almacenar la nueva conexión en el estado
      setConnections((prevConnections) => {
        const newConnections = {
          ...prevConnections,
          [conn.peer]: conn,
        };
        console.log('Updated connections:', newConnections); // Agregar registro de consola para las conexiones actualizadas
        return newConnections;
      });

      // Si ya hay un flujo actual, envíalo al nuevo par
      if (currentStream) {
        const call = me.call(conn.peer, currentStream, {
          metadata: {
            userName,
          },
        });
        call.on("stream", (peerStream) => {
          dispatch(addPeerStreamAction(conn.peer, peerStream));
        });
        dispatch(addPeerNameAction(conn.peer, userName));
      }
    });

    me.on('error', (err) => {
      console.error('PeerJS error 95:', err);
    });

    return () => {
      me.off("connection");
    };
  }, [me, currentStream]); // Agregar currentStream a las dependencias del efecto

  const switchStream = (newStream) => {
    setCurrentStream(newStream); // Actualizar el flujo actual
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

  const shareScreen = () => {
    if (Object.keys(connections).length === 0) {
      console.log('No connections established. Delaying screen share.');
      setAttemptedScreenShare(true);
      return;
    }

    if (screenSharingId) {
      navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then(switchStream);
    } else {
      navigator.mediaDevices.getDisplayMedia({}).then((stream) => {
        switchStream(stream);
        setScreenStream(stream);
      });
    }
  };

  useEffect(() => {
    if (attemptedScreenShare && Object.keys(connections).length > 0) {
      shareScreen();
      setAttemptedScreenShare(false);
    }
  }, [connections, attemptedScreenShare]);

  const nameChangedHandler = ({ peerId, userName }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    socket.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    const peer = new Peer(userId, {
      host: "metaversoude2.ddns.net",
      port: 9000,
      path: "/",
    });

    setMe(peer);

    peer.on('open', (id) => {
      console.log('PeerJS connection established. ID:', id);
    });

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
    if (screenSharingId) {
      socket.emit("start-sharing", { peerId: screenSharingId, roomId });
    } else {
      socket.emit("stop-sharing");
    }
  }, [screenSharingId, roomId]);

  useEffect(() => {

    if (!me) return;
    if (!stream) return;

    socket.on("user-joined", ({ peerId, userName: name }) => {
      console.log('UserJoined con peerId ' +  peerId + ' y name ' + name);
      if (!me || !stream) return; // Verificar que 'me' y 'stream' estén definidos
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream));

        // Agregar la llamada a las conexiones
        setConnections((prevConnections) => {
          const newConnections = {
            ...prevConnections,
            [peerId]: call,
          };
          console.log('Updated connections:', newConnections); // Agregar registro de consola para las conexiones actualizadas
          return newConnections;
        });
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    me.on("call", (call) => {
      console.log('Call established 234:', call);
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });

      // Si el usuario ha intentado compartir su pantalla, intenta compartir la pantalla ahora
      if (attemptedScreenShare) {
        shareScreen();
        setAttemptedScreenShare(false);
      }
    });

    return () => {
      socket.off("user-joined");
      me.off("call");
    };
  }, []); // Array de dependencias vacío para que se ejecute solo una vez

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
