import React, { useState } from "react";
import axios from "axios";

const LoginForm = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        nombreUsuario,
        contrasena,
      });
      setMensaje(response.data.message);
    } catch (error) {
      console.error("Error al iniciar sesión:", error.response.data.message);
      setMensaje(error.response.data.message);
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
