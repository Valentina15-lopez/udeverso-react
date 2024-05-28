import React, { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import { Button } from "../../common/Button";
import axios from "axios";
import { Modal } from "../../common/Modal";
import { UserContext } from "../../context/UserContext";

export const UploadButton = () => {
  const { setFileTexture } = useContext(RoomContext); // Asegúrate de tener una función para actualizar la textura
  const [materiales, setMateriales] = useState([]);
  const { userName } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const openModal = async () => {
    setIsModalOpen(true);
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
  };

  const selectMaterial = (materialPath) => {
    setFileTexture(materialPath);
    closeModal();
  };

  return (
    <div>
      <Button onClick={openModal} type="button">
        Compartir Material
      </Button>
      <Modal isOpen={isModalOpen} closeModal={closeModal}>
        <div>
          <h1 className="text-lg font-semibold mb-4">
            Selecciona el archivo que desea compartir
          </h1>
          {loading ? (
            <div className="flex justify-center items-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
              <p>Cargando materiales...</p>
            </div>
          ) : (
            materiales.map((material) => (
              <div key={material.id} className="mb-2">
                <Button onClick={() => selectMaterial(material.path)}>
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
