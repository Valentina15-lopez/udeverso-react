import React, { useState } from "react";
import { useAuth } from "../AuthContext";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate(); // Inicializa el hook useHistory

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://metaversoude2.ddns.net:3001/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ nombreUsuario, contrasena }),
        }
      );

      if (response.ok) {
        login();
        const userData = await response.json();
        navigate("/aulavirtual"); // Redirige a la página de aulavirtual si el inicio de sesión es exitoso
        // Aquí manejas los datos del usuario recibidos del servidor
        console.log(userData);
      } else {
        // Maneja errores de autenticación
        const errorMessage = await response.text();
        console.error(errorMessage);
        setMensaje("Credenciales incorrectas");
      }
    } catch (error) {
      console.error("Error al intentar iniciar sesión:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md overflow-hidden my-8">
        <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Iniciar sesión
        </h2>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="nombreUsuario"
              className="block font-semibold text-gray-600"
            >
              Nombre de usuario:
            </label>
            <input
              id="nombreUsuario"
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="contrasena"
              className="block font-semibold text-gray-600"
            >
              Contraseña:
            </label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Iniciar sesión
          </button>
        </form>
        {mensaje && <p className="text-red-500 text-center">{mensaje}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
