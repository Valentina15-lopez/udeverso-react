import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap"; // o cualquier biblioteca de modal que estés usando
import { Button } from "../../common/Button";

const MaterialModal = ({ isOpen, closeModal, materials, selectMaterial }) => {
  return (
    <Modal isOpen={isOpen} toggle={closeModal}>
      <ModalHeader toggle={closeModal}>Selecciona un Material</ModalHeader>
      <ModalBody>
        {materials.map((material) => (
          <div key={material.id}>
            <Button onClick={() => selectMaterial(material.path)}>
              {material.name}
            </Button>
          </div>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button onClick={closeModal}>Cerrar</Button>
      </ModalFooter>
    </Modal>
  );
};

export default MaterialModal;
