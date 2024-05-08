import React, { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    contrasenia: "",
    nombre_para_mostrar: "",
    avatar_id: "",
    correo: "",
    es_estudiante: "",
  });
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Si no existe el ID del usuario, es una solicitud de inserción
      await axios.post(
        "https://metaversoude2.ddns.net:3001/api/users",
        formData
      );
      console.log("Usuario creado exitosamente");
    } catch (error) {
      if (error.response) {
        // La solicitud fue realizada y el servidor respondió con un código de estado que no está en el rango 2xx
        //console.error("Error de respuesta del servidor:", error.response.data);
      } else if (error.request) {
        // La solicitud fue realizada pero no se recibió respuesta
        console.error("No se recibió respuesta del servidor");
      } else {
        // Ocurrió un error durante la configuración de la solicitud
        console.error("Error al configurar la solicitud:", error.message);
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md overflow-hidden my-8">
        <h1 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Insertar Usuario
        </h1>
        <form onSubmit={handleSubmit} className="p-4">
          <label className="block mb-2">
            Usuario:
            <input
              type="text"
              name="usuario"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Contraseña:
            <input
              type="password"
              name="contrasenia"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Nombre para mostrar:
            <input
              type="text"
              name="nombre_para_mostrar"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Avatar ID:
            <input
              type="text"
              name="avatar_id"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Correo:
            <input
              type="email"
              name="correo"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Es Estudiante:
            <input
              type="text"
              name="es_estudiante"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Enviar
          </button>
          <button
            type="reset"
            className="w-full mt-2.5 bg-indigo-300 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Volver al inicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;
