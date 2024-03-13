import React, { useContext } from "react";
import { useParams, Navigate } from "react-router-dom";
import AulaScene from "../../components/AulaScene";
import { Canvas } from "@react-three/fiber";
import LiveStreamingComponent from "../../components/Streaming/LiveStreamingComponent";
import { userAtom } from "../../components/ContexProvider";
import { useAtom } from "jotai";

const AulaVirtual = () => {
  const [users] = useAtom(userAtom);
  const { roomId } = useParams(); // Obtiene el ID de la sala de los parámetros de ruta

  // Lógica de redirección aquí, por ejemplo, redirigir a / si no hay ID de sala
  if (!roomId) {
    return <Navigate to="/" />;
  }

  // Renderizar la página de AulaVirtual con el ID de la sala
  return (
    <div>
      <h1>Udeverso - Aula Virtual</h1>
      <Canvas shadows camera={{ position: [8, 8, 8], fov: 30 }}>
        <AulaScene />
      </Canvas>
      <LiveStreamingComponent />;
    </div>
  );
};

export default AulaVirtual;
