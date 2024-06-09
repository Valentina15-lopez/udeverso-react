import React, { createContext, useEffect, useState, useReducer, useContext } from "react";
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
import { Modal } from "../common/Modal";

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
  const [me, setMe] = useState(null);
  const [stream, setStream] = useState(null);
  const [screenStream, setScreenStream] = useState(null);
  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState("");
  const [roomId, setRoomId] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [connections, setConnections] = useState({});

  const enterRoom = ({ roomId }) => {
    navigate(`/aulavirtual/${roomId}`);
  };

  const getUsers = ({ participants }) => {
    dispatch(addAllPeersAction(participants));
  };

  const removePeer = (peerId) => {
    dispatch(removePeerStreamAction(peerId));
  };

  const switchStream = (stream) => {
    setScreenSharingId(me?.id || "");
    Object.values(connections).forEach((connection) => {
      const videoTrack = stream?.getTracks().find((track) => track.kind === "video");
      connection.peerConnection.getSenders().find((sender) => sender.track.kind === "video").replaceTrack(videoTrack)
          .catch((err) => console.error(err));
    });
  };

  const shareScreen = async () => {
    if (screenSharingId) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        switchStream(stream);
      } catch (error) {
        console.error("Error al obtener medios de usuario", error);
        setModalOpen(true);
      }
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({});
        switchStream(stream);
        setScreenStream(stream);
      } catch (error) {
        console.error("Error al compartir pantalla", error);
        setModalOpen(true);
      }
    }
  };

  const nameChangedHandler = ({ peerId, userName }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    socket.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId, socket]);

  useEffect(() => {
    const peer = new Peer(userId, {
      host: "metaversoude2.ddns.net",
      port: 9000,
      path: "/",
    });

    peer.on('open', () => {
      setMe(peer);
    });

    peer.on('error', (err) => {
      console.error("PeerJS error:", err);
      setModalOpen(true);
    });

    return () => {
      peer.disconnect();
    };
  }, [userId]);

  useEffect(() => {
    if (!me) return;

    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        })
        .catch((error) => {
          console.error(error);
          setModalOpen(true);
        });

    socket.on("room-created", enterRoom);
    socket.on("room-joined", enterRoom);
    socket.on("get-users", getUsers);
    socket.on("user-disconnected", removePeer);
    socket.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    socket.on("user-stopped-sharing", () => setScreenSharingId(""));
    socket.on("name-changed", nameChangedHandler);

    return () => {
      socket.off("room-created", enterRoom);
      socket.off("room-joined", enterRoom);
      socket.off("get-users", getUsers);
      socket.off("user-disconnected", removePeer);
      socket.off("user-started-sharing", (peerId) => setScreenSharingId(peerId));
      socket.off("user-stopped-sharing", () => setScreenSharingId(""));
      socket.off("name-changed", nameChangedHandler);
    };
  }, [me, socket]);

  useEffect(() => {
    if (!screenSharingId) return;

    if (screenSharingId === userId) {
      socket.emit("start-sharing", { peerId: userId, roomId });
    } else {
      socket.emit("stop-sharing");
    }
  }, [screenSharingId, userId, roomId, socket]);

  useEffect(() => {
    if (!me || !stream) return;

    const handleUserJoined = ({ peerId, userName: name }) => {
      if (me && !me.disconnected) {
        const call = me.call(peerId, stream, { metadata: { userName } });
        if (call) {
          call.on("stream", (peerStream) => {
            dispatch(addPeerStreamAction(peerId, peerStream));
          });
          dispatch(addPeerNameAction(peerId, name));
        } else {
          console.error("Error al realizar la llamada.");
        }
      } else {
        console.error("El peer no está conectado.");
      }
    };

    socket.on("user-joined", handleUserJoined);

    me.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      socket.off("user-joined", handleUserJoined);
    };
  }, [me, stream, userId, socket]);

  useEffect(() => {
    if (!me) return;

    const handleConnection = (conn) => {
      setConnections((prevConnections) => ({
        ...prevConnections,
        [conn.peer]: conn,
      }));

      conn.on('close', () => {
        setConnections((prevConnections) => {
          const { [conn.peer]: _, ...remaining } = prevConnections;
          return remaining;
        });
      });
    };

    me.on("connection", handleConnection);

    return () => {
      me.off("connection", handleConnection);
    };
  }, [me]);

  useEffect(() => {
    return () => {
      stream?.getTracks().forEach(track => track.stop());
      screenStream?.getTracks().forEach(track => track.stop());
      Object.values(connections).forEach(conn => conn.close());
      me?.disconnect();
    };
  }, [stream, screenStream, connections, me]);

  return (
      <RoomContext.Provider
          value={{
            peers,
            shareScreen,
            setRoomId,
            screenSharingId,
            roomId,
          }}
      >
        {children}
        {modalOpen && (
            <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
              <h1>Acceso a la cámara denegado</h1>
              <p>No puede interactuar en UDEVERSO sin habilitar la cámara.</p>
              <p>Por favor, conceda el permiso y recargue la página.</p>
            </Modal>
        )}
      </RoomContext.Provider>
  );
};

