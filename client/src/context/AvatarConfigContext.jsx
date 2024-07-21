import React, { createContext, useState } from "react";

export const AvatarConfigContext = createContext();

export const AvatarConfigProvider = ({ children }) => {
  const [avatarConfig, setAvatarConfig] = useState({
    hairColor: "#ffffff",
    topColor: "#ffffff",
    bottomColor: "#ffffff",
  });

  return (
    <AvatarConfigContext.Provider value={{ avatarConfig, setAvatarConfig }}>
      {children}
    </AvatarConfigContext.Provider>
  );
};
