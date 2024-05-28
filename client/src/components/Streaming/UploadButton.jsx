import React, { useContext, useEffect, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import { Button } from "../../common/Button";
import axios from "axios";
import * as THREE from "three";
import { Modal } from "../../common/Modal";
import { UserContext } from "../../context/UserContext";

export const UploadButton = () => {
  const { setFileTexture } = useContext(RoomContext); // Asegúrate de tener una función para actualizar la textura
  const [materiales, setMateriales] = useState([]);
  const { userName } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const closeModal = () => setIsModalOpen(false);

  const openModal = async () => {
    setIsModalOpen(true);
    try {
      const response = await axios.get(
        `https://metaversoude2.ddns.net:3001/api/users/${userName}/material`
      );
      console.log("materiales", response);
      setMateriales(response.data);
    } catch (error) {
      console.error("Error al cargar materiales del usuario:", error);
    }
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
          <h1>Selecciona el archivo que desea compartir </h1>
          {materiales.map((material) => (
            <div key={material.id}>
              <Button onClick={() => selectMaterial(material.path)}>
                <span>{material.id.nombre}</span>
              </Button>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};
