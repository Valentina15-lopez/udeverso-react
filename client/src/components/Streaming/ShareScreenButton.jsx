import React, { useContext, useState } from "react";
import { Button } from "../../common/Button";
import { RoomContext } from "../../context/RoomContext";

export const ShareScreenButton = () => {
  const { startScreenSharing, stopScreenSharing, screenStream } =
    useContext(RoomContext);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareScreen = async () => {
    if (isSharing) {
      stopScreenSharing();
    } else {
      await startScreenSharing();
    }
    setIsSharing(!isSharing);
  };

  return (
    <div>
      <Button onClick={handleShareScreen}>
        {isSharing ? "Detener compartición" : "Compartir pantalla"}
      </Button>
    </div>
  );
};
