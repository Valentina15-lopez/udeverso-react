import React, { useState, useContext } from "react";
import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { SocketContext } from "../../context/ContexProvider";
import { UserContext } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { AvatarConfigPage } from "../AvatarConfigPage";
import { AvatarConfigContext } from "../../context/AvatarConfigContext";

export const JoinRoom = () => {
  const { socket } = useContext(SocketContext);
  const { saveAvatar } = useContext(AvatarConfigContext);

  const { userId, userName } = useContext(UserContext);
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const joinRoom = () => {
    if (saveAvatar) {
      socket.emit("join-room", { roomId: roomId, peerId: userId, userName });
    }
  };
  // Función para manejar la redirección a la página anterior
  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior en el historial
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <AvatarConfigPage />
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white mb-4">
          Unirse a una Sala
        </h2>
        <NameInput />
        <input
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Ingrese el ID de la Sala"
          className="mb-4 p-2 border w-full text-center border-gray-300 rounded"
        />
        <div className="flex flex-col gap-2">
          <Button onClick={joinRoom} isLight={false}>
            Unirse a la Sala
          </Button>
          <Button onClick={handleGoBack}>Volver al inicio</Button>
        </div>
      </div>
    </div>
  );
};
