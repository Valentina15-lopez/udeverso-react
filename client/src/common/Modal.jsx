import React from "react";
import { Button } from "../../common/Button";

export const Modal = ({ isOpen, children, closeModal }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-blue-500 p-8 rounded-lg shadow-lg text-white">
        {children}
        <Button onClick={closeModal}>Cerrar</Button>
      </div>
    </div>
  );
};
