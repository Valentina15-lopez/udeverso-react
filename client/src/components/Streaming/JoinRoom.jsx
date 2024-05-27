import React, { useState, useContext } from "react";
import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { SocketContext } from "../../context/ContexProvider";
import { UserContext } from "../../context/UserContext";

export const JoinRoom = () => {
  const { socket } = useContext(SocketContext);
  const { userId, userName } = useContext(UserContext);
  const [roomId, setRoomId] = useState("");

  const joinRoom = () => {
    socket.emit("join-room", { roomId: roomId, peerId: userId, userName });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Unirse a una Sala</h1>
      <NameInput />
      <input
        type="text"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
        placeholder="Ingrese el ID de la Sala"
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <Button onClick={joinRoom}>Unirse a la Sala</Button>
    </div>
  );
};
