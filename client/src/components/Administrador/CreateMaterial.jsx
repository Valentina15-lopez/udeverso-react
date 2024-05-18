import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const CreateMaterial = () => {
  const [usuarios, setUsuarios] = useState([]); // Estado para almacenar la lista de usuarios
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    ext: "",
    archivo: null, // Modificamos el estado para almacenar el archivo
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/api/users");
        const users = response.data; // Supongamos que aquí tienes una lista de usuarios
        setUsuarios(users); // Guardar la lista de usuarios en el estado
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };
    loadUsers(); // Llamar a la función para cargar usuarios
  }, []); // Nota que el array de dependencias está vacío para que se ejecute solo una vez

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "archivo") {
      setFormData({ ...formData, archivo: files[0] }); // Almacenar el archivo
    } else {
      setFormData({ ...formData, [name]: value }); // Actualizar el resto del formulario
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData(); // Creamos un objeto FormData
      formDataToSend.append("usuario", formData.usuario); // Usuarios.js seleccionado
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("ext", formData.ext);
      formDataToSend.append("archivo", formData.archivo); // Agregar el archivo

      await axios.post(
        "http://localhost:3001/api/users/material", // Usar el endpoint correcto
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Material agregado exitosamente");
    } catch (error) {
      console.error("Error al enviar el material:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md overflow-hidden my-8">
        <h2 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Insertar Material
        </h2>
        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label
              htmlFor="usuario"
              className="block font-semibold text-gray-600"
            >
              Usuario:
            </label>
            <select
              id="usuario"
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            >
              <option value="">Seleccionar usuario</option>
              {/* Renderizar opciones de usuario */}
            </select>
          </div>
          <div className="mb-4">
            <label
              htmlFor="nombre"
              className="block font-semibold text-gray-600"
            >
              Nombre del archivo:
            </label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="ext" className="block font-semibold text-gray-600">
              Extensión:
            </label>
            <input
              id="ext"
              type="text"
              name="ext"
              value={formData.ext}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="archivo"
              className="block font-semibold text-gray-600"
            >
              Archivo:
            </label>
            <input
              id="archivo"
              type="file"
              name="archivo"
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </div>
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

export default CreateMaterial;
