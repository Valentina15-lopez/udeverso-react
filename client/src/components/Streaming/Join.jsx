import React, { useContext, useState } from "react";
import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { socket } from "../../context/ContexProvider";
import { useNavigate } from "react-router-dom";
import { AvatarConfigPage } from "../AvatarConfigPage";
import { AvatarConfigContext } from "../../context/AvatarConfigContext";
import { Modal } from "../../common/Modal";

export const Join = () => {
  const { saveAvatar } = useContext(AvatarConfigContext);
  const [isModalOpen, setisModalOpen] = useState(false);
  const closeModal = () => setisModalOpen(false);

  const navigate = useNavigate();

  const createRoom = () => {
    if (saveAvatar) {
      socket.emit("create-room");
    } else {
      setisModalOpen(true);
    }
  };
  // Función para manejar la redirección a la página anterior
  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior en el historial
  };

  return (
    <>
      <div className="flex flex-row items-center justify-center bg-gray-100">
        <div>
          <AvatarConfigPage />
        </div>
        <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white mb-4">
            Crear una Sala
          </h2>
          <NameInput />
          <div className="flex flex-col gap-2">
            <Button onClick={createRoom} isLight={false}>
              Crear sala
            </Button>
            <Button onClick={handleGoBack}>Volver al inicio</Button>
          </div>
        </div>
      </div>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <h1 className="text-lg font-semibold mb-4">
          Debe guardar su avatar para continuar
        </h1>
      </Modal>
    </>
  );
};
