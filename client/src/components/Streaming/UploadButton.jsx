import React, { useContext, useEffect, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import { Button } from "../../common/Button";
import axios from "axios";
import * as THREE from "three";

import { UserContext } from "../../context/UserContext";
import MaterialModal from "./MaterialModal"; // Asegúrate de tener la ruta correcta

export const UploadButton = () => {
  const { setFileTexture } = useContext(RoomContext); // Asegúrate de tener una función para actualizar la textura
  const [materiales, setMateriales] = useState([]);
  const { userName } = useContext(UserContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadMaterials = async () => {
      try {
        const response = await axios.get(
          `https://metaversoude2.ddns.net:3001/api/users/${userName}/material`
        );
        setMateriales(response.data);
      } catch (error) {
        console.error("Error al cargar materiales del usuario:", error);
      }
    };

    loadMaterials();
  }, [userName]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const selectMaterial = (materialPath) => {
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(materialPath, (texture) => {
      setFileTexture(texture);
    });
    closeModal();
  };

  return (
    <div>
      <Button onClick={openModal} type="button">
        Compartir Material
      </Button>
      <MaterialModal
        isOpen={isModalOpen}
        closeModal={closeModal}
        materials={materiales}
        selectMaterial={selectMaterial}
      />
    </div>
  );
};
