import React, { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import { Button } from "../../common/Button";
import axios from "axios";
import { Modal } from "../../common/Modal";
import { UserContext } from "../../context/UserContext";
import { PDFView } from "./PDFView";

export const UploadButton = () => {
  const { setFileTexture, shareScreen } = useContext(RoomContext); // Asegúrate de tener una función para actualizar la textura
  const [materiales, setMateriales] = useState([]);
  const { userName } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpen2, setIsModalOpen2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const closeModal = () => setIsModalOpen(false);
  const closeModal2 = () => {
    setIsModalOpen2(false);
    setIsModalOpen(false);
  };

  const openModal = () => {
    if (isSharing) {
      setIsModalOpen(false);
    } else {
      setIsModalOpen(true);
    }
    setIsSharing(!isSharing);
  };
  const loadmaterials = async () => {
    if (isSharing) {
      setIsModalOpen2(false);
      setFileTexture();
      setIsSharing(false);
    } else {
      setIsModalOpen2(true);
      setLoading(true); // Iniciar el estado de carga
      try {
        const response = await axios.get(
          `https://metaversoude2.ddns.net:3001/api/users/${userName}/material`
        );
        console.log("materiales", response);
        setMateriales(response.data);
      } catch (error) {
        console.error("Error al cargar materiales del usuario:", error);
      }
      setLoading(false); // Terminar el estado de carga
    }
  };

  const selectMaterial = (materialName) => {
    setFileTexture(materialName);
    closeModal2();
    setIsSharing(true);
  };

  return (
    <div>
      <Button onClick={openModal} type="button" isLight={false}>
        {isSharing ? "Detener presentación" : "Compartir Material"}
      </Button>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div>
          <div className="flex flex-col gap-1">
            <Button onClick={shareScreen} isLight={true}>
              <span>Compartir Pantalla</span>
            </Button>
            <Button onClick={loadmaterials} isLight={true}>
              <span>Compartir Material</span>
            </Button>
          </div>
        </div>
      </Modal>
      <Modal isOpen={isModalOpen2} closeModal={closeModal2}>
        <div>
          <h1 className="text-lg font-semibold mb-4">
            Selecciona el archivo que desea compartir
          </h1>
          {loading ? (
            <div className="fixed inset-0 flex justify-center items-center bg-gray-800 bg-opacity-75 z-50">
              <div className="flex flex-col justify-center items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
                <p className="text-white text-lg">Cargando materiales...</p>
              </div>
            </div>
          ) : (
            materiales.map((material) => (
              <div className="mb-2">
                <Button
                  onClick={() => selectMaterial(material.nombre)}
                  isLight={true}
                >
                  <span>{material.nombre}</span>
                </Button>
              </div>
            ))
          )}
        </div>
      </Modal>
    </div>
  );
};
