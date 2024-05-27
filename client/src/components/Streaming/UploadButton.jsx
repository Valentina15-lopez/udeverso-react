import React, { useContext } from "react";
import { RoomContext } from "../../context/RoomContext";

export const UploadButton = () => {
  const { uploadFile } = useContext(RoomContext);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      uploadFile(file);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
