import React, { useState, useContext, useEffect } from "react";
import { AvatarConfigContext } from "../context/AvatarConfigContext";
import { Avatar } from "./Avatar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "../common/Button";
import { socket, userAtom } from "./../context/ContexProvider";
import { useAtom } from "jotai";
import axios from "axios";

import { UserContext } from "../context/UserContext";
const colors = {
  hair: [
    { value: "#ffffff", label: "Blanco" },
    { value: "#000000", label: "Negro" },
    { value: "#ff0000", label: "Rojo" },
    { value: "#ffff00", label: "Amarillo" },
  ],
  top: [
    { value: "#00ff00", label: "Verde" },
    { value: "#ffffff", label: "Blanco" },
    { value: "#000000", label: "Negro" },
    { value: "#0000ff", label: "Azul" },
    { value: "#ff0000", label: "Rojo" },
    { value: "#ffff00", label: "Amarillo" },
  ],
  bottom: [
    { value: "#00ff00", label: "Verde" },
    { value: "#ffffff", label: "Blanco" },
    { value: "#000000", label: "Negro" },
    { value: "#0000ff", label: "Azul" },
    { value: "#ff0000", label: "Rojo" },
    { value: "#ffff00", label: "Amarillo" },
  ],
};

export const AvatarConfigPage = () => {
  const { avatarConfig, setAvatarConfig } = useContext(AvatarConfigContext);
  const { userName } = useContext(UserContext);
  const [users] = useAtom(userAtom);

  const [hairColor, setHairColor] = useState(
    avatarConfig.hairColor || "#ffffff"
  );
  const [topColor, setTopColor] = useState(avatarConfig.topColor || "#ffffff");
  const [bottomColor, setBottomColor] = useState(
    avatarConfig.bottomColor || "#ffffff"
  );

  const fetchAvatarConfig = async () => {
    try {
      await axios.post(
        `https://metaversoude2.ddns.net:3001/api/updateAvatar/${userName}`,
        avatarConfig
      );
    } catch (error) {
      console.error("Error fetching avatar config:", error);
    }
  };

  const handleSave = () => {
    const newAvatarConfig = { hairColor, topColor, bottomColor };
    setAvatarConfig(newAvatarConfig);
    setAvatarConfig(true);
    fetchAvatarConfig();
    console.log("newAvatarConfig", newAvatarConfig);
    // Emit the updated avatar config to the server
    socket.emit("update-avatar-config", { userName, newAvatarConfig });
  };

  return (
    <div className="flex flex-row gap-36 items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white mb-4">
          Configura tu Avatar
        </h2>
        <div>
          <label className="block mb-2">
            Color de Pelo:
            <select
              value={hairColor}
              className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${"bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
              onChange={(e) => setHairColor(e.target.value)}
            >
              {colors.hair.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block mb-2">
            Color de Remera:
            <select
              value={topColor}
              className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${"bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
              onChange={(e) => setTopColor(e.target.value)}
            >
              {colors.top.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label className="block mb-2">
            Color de Pantalón:
            <select
              value={bottomColor}
              className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${"bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
              onChange={(e) => setBottomColor(e.target.value)}
            >
              {colors.bottom.map((color) => (
                <option key={color.value} value={color.value}>
                  {color.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <Button onClick={handleSave}>Guardar Avatar</Button>
        <div className="mt-8" style={{ width: "500px", height: "500px" }}>
          <Canvas camera={{ position: [0, 2, 5], fov: 50 }}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
            <OrbitControls />
            <Avatar
              position={[0, -1.5, 0]} // Ajusta la posición para centrar el avatar
              hairColor={hairColor}
              topColor={topColor}
              bottomColor={bottomColor}
              scale={[1.5, 1.5, 1.5]} // Ajusta la escala para aumentar el tamaño
            />
          </Canvas>
        </div>
      </div>
    </div>
  );
};
