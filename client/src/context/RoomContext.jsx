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
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState();
  const [fileTexture, setFileTexture] = useState(null);
  const [stream, setStream] = useState();
  const [screenStream, setScreenStream] = useState();

  const [peers, dispatch] = useReducer(peersReducer, {});
  const [screenSharingId, setScreenSharingId] = useState("");
  const [roomId, setRoomId] = useState("");

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

  const peer = new Peer(userId, {
    //host: "localhost",
    host: "metaversoude2.ddns.net",
    port: "9000",
    path: "/",
  });

  /*
fs.readFileSync('privkey.pem', 'utf8');
fs.readFileSync('fullchain.pem', 'utf8');
*/

  const nameChangedHandler = ({ peerId, userName }) => {
    dispatch(addPeerNameAction(peerId, userName));
  };

  useEffect(() => {
    socket.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    const peer = new Peer(userId, {
      //host: "localhost",
      host: "metaversoude2.ddns.net",
      port: 9000,
      path: "/",
    });

    setMe(peer);

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
    socket.on("get-users", getUsers);
    socket.on("user-disconnected", removePeer);
    socket.on("user-started-sharing", (peerId) => setScreenSharingId(peerId));
    socket.on("user-stopped-sharing", () => setScreenSharingId(""));
    socket.on("name-changed", nameChangedHandler);

    return () => {
      socket.off("room-created");
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

  const shareScreen = () => {
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
    socket.emit("change-name", { peerId: userId, userName, roomId });
  }, [userName, userId, roomId]);

  useEffect(() => {
    if (!me) return;

    me.on("connection", (conn) => {
      // Almacenar la nueva conexión en el estado
      setConnections((prevConnections) => ({
        ...prevConnections,
        [conn.peer]: conn,
      }));
    });

    return () => {
      me.off("connection");
    };
  }, [me]);

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
      const call = me.call(peerId, stream, {
        metadata: {
          userName,
        },
      });
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(peerId, peerStream));
      });
      dispatch(addPeerNameAction(peerId, name));
    });

    socket.on("call", (call) => {
      const { userName } = call.metadata;
      dispatch(addPeerNameAction(call.peer, userName));
      call.answer(stream);
      call.on("stream", (peerStream) => {
        dispatch(addPeerStreamAction(call.peer, peerStream));
      });
    });

    return () => {
      socket.off("user-joined");
    };
  }, [me, stream, userName]);

  const switchStream = (stream) => {
    setScreenSharingId(me?.id || "");
    Object.values(connections).forEach((connection) => {
      const videoTrack = stream
        ?.getTracks()
        .find((track) => track.kind === "video");
      connection.peerConnection
        .getSenders()
        .find((sender) => sender.track.kind === "video")
        .replaceTrack(videoTrack)
        .catch((err) => console.error(err));
    });
  };
  const startScreenSharing = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
      });
      setScreenStream(stream);
      setScreenSharingId(socket.id);

      stream.getTracks().forEach((track) => {
        for (const peerId in peers) {
          const peerConnection = peers[peerId].peerConnection;
          peerConnection.addTrack(track, stream);
        }
      });

      socket.emit("screen-sharing-start", { id: socket.id });
    } catch (error) {
      console.error("Error al compartir pantalla:", error);
    }
  };

  const stopScreenSharing = () => {
    screenStream.getTracks().forEach((track) => track.stop());
    setScreenStream(null);
    setScreenSharingId(null);
    socket.emit("screen-sharing-stop", { id: socket.id });
  };

  useEffect(() => {
    socket.on("screen-sharing-start", (data) => {
      setScreenSharingId(data.id);
    });

    socket.on("screen-sharing-stop", (data) => {
      setScreenSharingId(null);
      setScreenStream(null);
    });

    socket.on("file-upload", async (data) => {
      const textureLoader = new THREE.TextureLoader();
      const texture = await textureLoader.loadAsync(data.filePath);
      setFileTexture(texture);
    });

    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append("archivo", file);

    try {
      const response = await fetch("http://localhost:3000/api/users/material", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Error al subir el archivo");
      }

      const data = await response.json();
      const textureLoader = new THREE.TextureLoader();
      const texture = await textureLoader.loadAsync(data.material.path);

      setFileTexture(texture);

      socket.emit("file-upload", { filePath: data.material.path });
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    }
  };

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
        startScreenSharing,
        stopScreenSharing,
        uploadFile,
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
