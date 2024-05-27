import React, { useContext, useState } from "react";
import { RoomContext } from "../../context/RoomContext";
import { Button } from "../../common/Button";

export const UploadButton = () => {
  const { uploadFile } = useContext(RoomContext);
  const [isSharing, setIsSharing] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
      setIsSharing(!isSharing);
    }
  };

  return (
    <div>
      <Button className="p-4 mx-2" onClick={handleFileChange}>
        {isSharing ? "Detener compartición" : "Compartir Material"}
      </Button>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
