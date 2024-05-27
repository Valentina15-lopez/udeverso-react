import React from "react";

export const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center">
      <div className="bg-blue-500 p-8 rounded-lg shadow-lg text-white">
        {children}
      </div>
    </div>
  );
};
