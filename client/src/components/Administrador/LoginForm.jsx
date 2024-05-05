import React, { useState } from "react";
import { useAuth } from "../AuthContext";

const LoginForm = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("https://metaversoude2.ddns.net:3001/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ nombreUsuario, contrasena }),
      });

      if (response.ok) {
        login();
        const userData = await response.json();
        // Aquí manejas los datos del usuario recibidos del servidor
        console.log(userData);
      } else {
        // Maneja errores de autenticación
        const errorMessage = await response.text();
        console.error(errorMessage);
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
    }
  };

  return (
    <div>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Nombre de usuario:</label>
          <input
            type="text"
            value={nombreUsuario}
            onChange={(e) => setNombreUsuario(e.target.value)}
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
          />
        </div>
        <button type="submit">Iniciar sesión</button>
      </form>
      {mensaje && <p>{mensaje}</p>}
    </div>
  );
};

export default LoginForm;
