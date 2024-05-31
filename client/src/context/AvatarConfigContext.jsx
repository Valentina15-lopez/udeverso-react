import React, { createContext, useState } from "react";

export const AvatarConfigContext = createContext();

export const AvatarConfigProvider = ({ children }) => {
  const [avatarConfig, setAvatarConfig] = useState({
    hairColor: "#00ff00",
    topColor: "#ff00ff",
    bottomColor: "#a52a2a",
  });

  return (
    <AvatarConfigContext.Provider value={{ avatarConfig, setAvatarConfig }}>
      {children}
    </AvatarConfigContext.Provider>
  );
};
