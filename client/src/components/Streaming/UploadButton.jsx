import React, { useRef, useContext } from "react";
import { RoomContext } from "../../context/RoomContext";
import { Button } from "../../common/Button";

export const UploadButton = () => {
  const { uploadFile } = useContext(RoomContext);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div>
      <Button onClick={handleButtonClick} type="button">
        Compartir Material
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
    </div>
  );
};
