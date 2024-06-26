import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DeleteUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    usuario: "",
    contrasenia: "",
    nombre_para_mostrar: "",
    avatar_id: "",
    correo: "",
    rol: "",
  });

  // Cargar lista de usuarios al inicio
  useEffect(() => {
    const loadUsers = async () => {
      try {
        //const response = await axios.get("http://localhost:3001/api/users");
        const response = await axios.get(
          "https://metaversoude2.ddns.net:3001/api/users"
        );

        setUsuarios(response.data);
      } catch (error) {
        console.error("Error al cargar los usuarios:", error);
      }
    };

    loadUsers();
  }, []); // Solo se ejecuta una vez cuando el componente se monta

  // Cargar datos del usuario seleccionado
  useEffect(() => {
    const loadUserData = async () => {
      if (formData.usuario) {
        // Solo cargar si hay un usuario seleccionado
        console.log("Usuarios.js seleccionado:", formData.usuario); // Añadir este console.log
        try {
          // const response = await axios.get(
          //   `http://localhost:3001/api/users/${formData.usuario}`
          // );
          const response = await axios.get(
            `https://metaversoude2.ddns.net:3001/api/users/${formData.usuario}`
          );
          const userData = response.data;
          // Actualizar formData con los datos del usuario
          setFormData({
            ...formData,
            contrasenia: "", // No cargar contraseñas
            nombre_para_mostrar: userData.nombre_para_mostrar || "",
            avatar_id: userData.avatar_id || "",
            correo: userData.correo || "",
            rol: userData.rol || "",
          });
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        }
      } else {
        console.log("No hay usuario seleccionado."); // Añadir este console.log
      }
    };

    loadUserData(); // Cargar datos cada vez que cambie el usuario
  }, [formData.usuario]); // Dependencia en el cambio del usuario seleccionado

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      //await axios.delete(`http://localhost:3001/api/users/${formData.usuario}`);
      await axios.delete(
        `https://metaversoude2.ddns.net:3001/api/users/${formData.usuario}`
      );

      console.log("Usuarios.js borrado exitosamente");
    } catch (error) {
      console.error("Error al borrar el usuario:", error);
    }
  };
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate("/abm");
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="max-w-md w-full bg-white rounded-md shadow-md overflow-hidden my-8">
        <h1 className="text-2xl font-semibold text-center py-4 bg-gray-800 text-white">
          Borrar usuario
        </h1>
        <form onSubmit={handleSubmit} className="p-4">
          <label className="block mb-2">
            Usuario:
            <select
              name="usuario"
              value={formData.usuario}
              onChange={handleChange}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            >
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                <option key={usuario.usuario} value={usuario.usuario}>
                  {usuario.usuario}
                </option>
              ))}
            </select>
          </label>
          <label className="block mb-2">
            Nombre para mostrar:
            <input
              type="text"
              name="nombre_para_mostrar"
              value={formData.nombre_para_mostrar}
              onChange={handleChange}
              readOnly={true}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Avatar ID:
            <input
              type="text"
              name="avatar_id"
              value={formData.avatar_id}
              onChange={handleChange}
              readOnly={true}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Correo:
            <input
              type="email"
              name="correo"
              value={formData.correo}
              onChange={handleChange}
              readOnly={true}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <label className="block mb-2">
            Rol:
            <input
              type="text"
              name="rol"
              value={formData.rol}
              onChange={handleChange}
              readOnly={true}
              className="block w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
            />
          </label>
          <button
            type="submit"
            className="w-full bg-indigo-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-600 transition duration-300"
          >
            Borrar
          </button>
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

export default DeleteUser;
