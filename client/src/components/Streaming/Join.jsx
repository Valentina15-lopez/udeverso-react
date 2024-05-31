import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { socket } from "../../context/ContexProvider";
import { useNavigate } from "react-router-dom";

export const Join = () => {
  const navigate = useNavigate();

  const createRoom = () => {
    socket.emit("create-room");
  };
  // Función para manejar la redirección a la página anterior
  const handleGoBack = () => {
    navigate(-1); // Redirige a la página anterior en el historial
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Crear una Sala
        </h2>
        <NameInput />
        <Button onClick={createRoom} isLight={false}>
          Crear sala
        </Button>
        <Button onClick={handleGoBack}>Volver al inicio</Button>
      </div>
    </div>
  );
};
