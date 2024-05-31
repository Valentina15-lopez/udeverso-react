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
    <div>
      <h1>Configura tu Avatar</h1>
      <div>
        <label>
          Color de Pelo:
          <select
            value={hairColor}
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
      <div style={{ width: "300px", height: "300px" }}>
        <Canvas>
          <ambientLight />
          <OrbitControls />
          <Avatar
            position={[0, 0, 0]}
            hairColor={hairColor}
            topColor={topColor}
            bottomColor={bottomColor}
          />
        </Canvas>
      </div>
    </div>
  );
};
