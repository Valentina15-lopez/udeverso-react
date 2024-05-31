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
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Unirse a una Sala
        </h2>
        <div className="w-80 ">
          <NameInput />
        </div>
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Ingrese el ID de la Sala"
          className="mb-4 p-2 border w-80 text-center border-gray-300 rounded"
        />
        <div className="w-80 text-center">
          <Button onClick={joinRoom} isLight={false}>
            Unirse a la Sala
          </Button>
        </div>
      </div>
    </div>
  );
};
