import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

export const AvatarConfigContext = createContext();

export const AvatarConfigProvider = ({ children }) => {
  const [avatarConfig, setAvatarConfig] = useState({
    hairColor: "#ffffff",
    topColor: "#00ff00",
    bottomColor: "#000000",
  });

  const [saveAvatar, setSaveAvatar] = useState(false);

  useEffect(() => {
    // Fetch the avatar configuration from the server when the component mounts
    const fetchAvatarConfig = async () => {
      try {
        const response = await axios.get("/api/user/avatar");
        setAvatarConfig(response.data);
      } catch (error) {
        console.error("Error fetching avatar config:", error);
      }
    };

    fetchAvatarConfig();
  }, []);

  useEffect(() => {
    if (saveAvatar) {
      const saveAvatarConfig = async () => {
        try {
          await axios.post("/api/user/avatar", avatarConfig);
        } catch (error) {
          console.error("Error saving avatar config:", error);
        }
      };

      saveAvatarConfig();
      setSaveAvatar(false);
    }
  }, [saveAvatar, avatarConfig]);

  return (
    <AvatarConfigContext.Provider
      value={{ avatarConfig, setAvatarConfig, setSaveAvatar }}
    >
      {children}
    </AvatarConfigContext.Provider>
  );
};
