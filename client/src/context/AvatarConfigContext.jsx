import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export const AvatarConfigContext = createContext();

export const AvatarConfigProvider = ({ children }) => {
  const [avatarConfig, setAvatarConfig] = useState({
    hairColor: "#000000",
    topColor: "#ffffff",
    bottomColor: "#000000",
    userName: "",
  });
  const [saveAvatar, setSaveAvatar] = useState(false);

  return (
    <AvatarConfigContext.Provider
      value={{ avatarConfig, setAvatarConfig, setSaveAvatar }}
    >
      {children}
    </AvatarConfigContext.Provider>
  );
};
