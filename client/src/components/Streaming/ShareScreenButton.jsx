import React from "react";
import { Button } from "../../common/Button";

export const ShareScreenButton = ({ onClick }) => {
  return (
    <Button className="p-4 mx-2" onClick={onClick}>
      Compartir pantalla
    </Button>
  );
};
