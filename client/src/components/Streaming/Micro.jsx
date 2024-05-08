import React, { useState } from "react";

export const MicrophoneButton = ({ onToggle }) => {
  // Estado para almacenar el valor del botón
  const [isMuted, setIsMuted] = useState(false);

  // Función para alternar el estado de silencio
  const toggleMute = () => {
    const newMutedState = !isMuted;
    setIsMuted(newMutedState);
    // Llama a la función proporcionada por las props para informar al componente externo
    onToggle(newMutedState);
  };

  return (
    <button
      onClick={toggleMute}
      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {isMuted ? "Activar Micrófono" : "Silenciar Micrófono"}
    </button>
  );
};
