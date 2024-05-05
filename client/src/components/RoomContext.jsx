import React, {
  createContext,
  useEffect,
  useState,
  useReducer,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import Peer from "peerjs";
import { peersReducer } from "../reducers/peerReducer";
import {
  addPeerStreamAction,
  addPeerNameAction,
  removePeerStreamAction,
  addAllPeersAction,
} from "../reducers/peerActions";
import { SocketContext } from "../components/ContexProvider";
import { UserContext } from "../context/UserContext";

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
  const { userName, userId } = useContext(UserContext);
  const [me, setMe] = useState();
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

    try {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setStream(stream);
        });
    } catch (error) {
      console.error(error);
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

    me.on("call", (call) => {
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
      }}
    >
      {children}
    </RoomContext.Provider>
  );
};
