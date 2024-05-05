import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { socket } from "../ContexProvider";

export const Join = () => {
  const createRoom = () => {
    socket.emit("create-room");
  };
  return (
    <div className="flex flex-col">
      <NameInput />
      <Button onClick={createRoom} className="py-2 px-8 text-xl">
        Unirme a la sala
      </Button>
    </div>
  );
};
