import { NameInput } from "../../common/Name";
import { Button } from "../../common/Button";
import { socket } from "../../context/ContexProvider";

export const Join = () => {
  const createRoom = () => {
    socket.emit("create-room");
  };
  return (
    <div className="flex flex-col">
      <NameInput />
      <Button onClick={createRoom}>Unirme a la sala</Button>
    </div>
  );
};
