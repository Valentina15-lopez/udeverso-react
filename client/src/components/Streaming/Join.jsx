import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { socket } from "../../context/ContexProvider";

export const Join = () => {
  const createRoom = () => {
    socket.emit("create-room");
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
      </div>
    </div>
  );
};
