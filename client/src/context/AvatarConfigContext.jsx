import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export const AvatarConfigContext = createContext();

export const AvatarConfigProvider = ({ children }) => {
  const [avatarConfig, setAvatarConfig] = useState({
    hairColor: "#000000",
    topColor: "#ffffff",
    bottomColor: "#000000",
  });
  const [saveAvatar, setSaveAvatar] = useState(false);
  const { userName } = useContext(UserContext);
  console.log("userId", userName);
  console.log("userName", userName);

  useEffect(() => {
    if (userName) {
      // Obtener la configuración del avatar del usuario
      const fetchAvatarConfig = async () => {
        try {
          const response = await axios.get(`/api/users/${userName}/avatar`);
          setAvatarConfig(response.data);
        } catch (error) {
          console.error("Error fetching avatar config:", error);
        }
      };

      fetchAvatarConfig();
    }
  }, [userName]);

  useEffect(() => {
    if (saveAvatar && userName) {
      // Guardar la configuración del avatar del usuario
      const saveAvatarConfig = async () => {
        try {
          await axios.post(`/api/users/${userName}/avatar`, avatarConfig);
          setSaveAvatar(false);
          alert("Configuración del avatar guardada con éxito");
        } catch (error) {
          console.error("Error saving avatar config:", error);
          alert("Error al guardar la configuración del avatar");
        }
      };

      saveAvatarConfig();
    }
  }, [saveAvatar, userName, avatarConfig]);

  return (
    <AvatarConfigContext.Provider
      value={{ avatarConfig, setAvatarConfig, setSaveAvatar }}
    >
      {children}
    </AvatarConfigContext.Provider>
  );
};
