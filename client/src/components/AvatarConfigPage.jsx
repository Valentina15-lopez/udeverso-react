import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AvatarConfigContext } from "../context/AvatarConfigContext";
import { Avatar } from "./Avatar";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Button } from "../common/Button";

const colors = {
  hair: ["#00ff00", "#ff0000", "#0000ff"],
  top: ["#ff00ff", "#00ffff", "#ffff00"],
  bottom: ["#a52a2a", "#8b4513", "#2e8b57"],
};

export const AvatarConfigPage = () => {
  const { avatarConfig, setAvatarConfig, saveAvatar, setSaveAvatar } =
    useContext(AvatarConfigContext);

  const [hairColor, setHairColor] = useState(avatarConfig.hairColor);
  const [topColor, setTopColor] = useState(avatarConfig.topColor);
  const [bottomColor, setBottomColor] = useState(avatarConfig.bottomColor);

  const handleSave = () => {
    setAvatarConfig({ hairColor, topColor, bottomColor });
    setSaveAvatar(true);
  };

  return (
    <div className="flex flex-row items-center justify-center h-screen bg-gray-100">
      <div className="max-w-md w-full overflow-hidden my-8 bg-white shadow-lg rounded-lg p-6">
        <h1>Configura tu Avatar</h1>
        <div>
          <label>
            Color de Pelo:
            <select
              value={hairColor}
              className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${"bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
              onChange={(e) => setHairColor(e.target.value)}
            >
              {colors.hair.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Color de Remera:
            <select
              value={topColor}
              className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${"bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
              onChange={(e) => setTopColor(e.target.value)}
            >
              {colors.top.map((color) => (
                <option key={color} value={color}>
                  {color}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div>
          <label>
            Color de Pantalón:
            <select
              value={bottomColor}
              className={`w-full py-2 px-8 text-xl rounded-md transition duration-300 ${"bg-blue-200 text-blue-900 hover:bg-blue-300"}`}
              onChange={(e) => setBottomColor(e.target.value)}
            >
              {colors.bottom.map((color) => (
                <option key={color} value={color}>
                  {color}
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
