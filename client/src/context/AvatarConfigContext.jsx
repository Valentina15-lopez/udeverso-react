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
  const { userId } = useContext(UserContext);
  console.log("userId", userId);

  useEffect(() => {
    if (userId) {
      // Obtener la configuración del avatar del usuario
      const fetchAvatarConfig = async () => {
        try {
          const response = await axios.get(`/api/users/${userId}/avatar`);
          setAvatarConfig(response.data);
        } catch (error) {
          console.error("Error fetching avatar config:", error);
        }
      };

      fetchAvatarConfig();
    }
  }, [userId]);

  useEffect(() => {
    if (saveAvatar && userId) {
      // Guardar la configuración del avatar del usuario
      const saveAvatarConfig = async () => {
        try {
          await axios.post(`/api/users/${userId}/avatar`, avatarConfig);
          setSaveAvatar(false);
          alert("Configuración del avatar guardada con éxito");
        } catch (error) {
          console.error("Error saving avatar config:", error);
          alert("Error al guardar la configuración del avatar");
        }
      };

      saveAvatarConfig();
    }
  }, [saveAvatar, userId, avatarConfig]);

  return (
    <AvatarConfigContext.Provider
      value={{ avatarConfig, setAvatarConfig, setSaveAvatar }}
    >
      {children}
    </AvatarConfigContext.Provider>
  );
};
