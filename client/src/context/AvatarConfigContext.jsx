// AvatarConfigContext.js
import React, { createContext, useState, useContext } from "react";

export const AvatarConfigContext = createContext();

export const AvatarConfigProvider = ({ children }) => {
  const [avatarConfigs, setAvatarConfigs] = useState({});

  const setAvatarConfig = (userId, config) => {
    setAvatarConfigs((prevConfigs) => ({
      ...prevConfigs,
      [userId]: config,
    }));
  };

  return (
    <AvatarConfigContext.Provider value={{ avatarConfigs, setAvatarConfig }}>
      {children}
    </AvatarConfigContext.Provider>
  );
};

export const useAvatarConfig = () => useContext(AvatarConfigContext);
