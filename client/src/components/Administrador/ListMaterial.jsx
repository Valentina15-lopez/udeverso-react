import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ListMaterial = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState("");
  const [materiales, setMateriales] = useState([]);

  // Cargar lista de usuarios al inicio
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get(
          "https://metaversoude2.ddns.net:3001/api/users"
        );
        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    loadUsers(); // Se ejecuta solo una vez
  }, []);

  // Cargar lista de materiales del usuario seleccionado
  useEffect(() => {
    const loadMaterials = async () => {
      if (selectedUsuario) {
        // Solo cargar si hay un usuario seleccionado
        try {
          const response = await axios.get(
            `https://metaversoude2.ddns.net:3001/api/users/${selectedUsuario}/material`
          );
          setMateriales(response.data); // Guardar la lista de materiales
        } catch (error) {
          console.error("Error al cargar materiales del usuario:", error);
        }
      } else {
        setMateriales([]); // Si no hay usuario seleccionado, limpiar materiales
      }
    };

    loadMaterials(); // Se ejecuta cada vez que cambia el usuario seleccionado
  }, [selectedUsuario]);

  const handleChange = (e) => {
    setSelectedUsuario(e.target.value); // Cambia el usuario seleccionado
  };

  const downloadMaterial = (material) => {
    const { nombre, ext, material: content } = material;

    // Crear un Blob a partir del buffer
    const blob = new Blob([new Uint8Array(content.data)], {
      type: "application/octet-stream",
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = `${nombre}.${ext}`; // Nombre del archivo con su extensión
    link.click(); // Simula el clic para descargar
    window.URL.revokeObjectURL(downloadUrl); // Liberar la URL para evitar fugas de memoria
  };

  const deleteMaterial = async (material) => {
    const { nombre, ext, material: content } = material;

    try {
      const response = await axios.delete(
        `https://metaversoude2.ddns.net:3001/api/users/${selectedUsuario}/material/` +
          nombre
      );
      console.log("Material borrado exitosamente");
    } catch (error) {
      console.error("Error al borrar materiales del usuario:", error);
    }
  };
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/MenuDocente");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md overflow-hidden my-8">
        <h1 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Ver materiales de usuario
        </h1>
        <form className="p-4">
          <label className="block mb-2">
            Usuario:
            <select
              name="usuario"
              value={selectedUsuario}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            >
              <option value="">Seleccionar Usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.usuario} value={usuario.usuario}>
                  {usuario.usuario}
                </option>
              ))}
            </select>
          </label>

          {materiales.length > 0 && (
            <ul>
              {materiales.map((material, index) => (
                <li key={index} className="mb-2">
                  {material.nombre}.{material.ext}
                  <button
                    type="button"
                    onClick={() => downloadMaterial(material)}
                    className="ml-2 bg-indigo-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-indigo-600 transition duration-300"
                  >
                    Descargar
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteMaterial(material)}
                    className="ml-2 bg-red-500 text-white font-semibold py-1 px-2 rounded-md hover:bg-red-600 transition duration-300"
                  >
                    Borrar
                  </button>
                </li>
              ))}
            </ul>
          )}
          <button
            type="button"
            onClick={handleBackToHome}
            className="w-full mt-2.5 bg-indigo-300 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Volver al inicio
          </button>
        </form>
      </div>
    </div>
  );
};

export default ListMaterial;
