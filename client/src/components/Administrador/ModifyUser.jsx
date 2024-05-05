import React, { useState, useEffect } from "react";
import axios from "axios";

const ModifyUser = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [formData, setFormData] = useState({
    usuario: "",
    contrasenia: "",
    nombre_para_mostrar: "",
    avatar_id: "",
    correo: "",
    es_estudiante: "",
  });

  // Cargar lista de usuarios al inicio
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const response = await axios.get("https://metaversoude2.ddns.net:3001/api/users");
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
      if (formData.usuario) { // Solo cargar si hay un usuario seleccionado
        console.log("Usuarios.js seleccionado:", formData.usuario); // Añadir este console.log
        try {
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
            es_estudiante: userData.es_estudiante || "",
          });
        } catch (error) {
          console.error("Error al cargar datos del usuario:", error);
        }
      }else{
        console.log("No hay usuario seleccionado."); // Añadir este console.log
      }
    };

    loadUserData(); // Cargar datos cada vez que cambie el usuario
  }, [formData.usuario]); // Dependencia en el cambio del usuario seleccionado

  const handleChange = (e) => {
    //console.log("Cambio en el formulario:", e.target.name, e.target.value); // Agregar console.log para depuración
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Enviando datos:", formData); // Agregar console.log para verificar qué se envía
      await axios.put(
          `https://metaversoude2.ddns.net:3001/api/users/${formData.usuario}`,
          formData
      );
      console.log("Usuarios.js modificado exitosamente");

    } catch (error) {
      console.error("Error al modificar el usuario:", error);
    }
  };

  return (
      <div>
        <h1>Modificar usuario</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Usuario:
            <select name="usuario"
                    value={formData.usuario}
                    onChange={handleChange}>
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                  <option key={usuario.usuario} value={usuario.usuario}>
                    {usuario.usuario}
                  </option>
              ))}
            </select>
          </label>
          <br/>
          <label>
            Nombre para mostrar:
            <input type="text"
                   name="nombre_para_mostrar"
                   value={formData.nombre_para_mostrar}
                   onChange={handleChange}
            />
          </label>
          <br/>
          <label>
            Avatar_id:
            <input type="text" name="sala" value={formData.avatar_id} onChange={handleChange}/>
          </label>
          <br/>
          <label>
            Correo:
            <input type="email" name="correo" value={formData.correo} onChange={handleChange}/>
          </label>
          <br/>
          <label>
            Es Estudiante:
            <input type="text" name="es_estudiante" value={formData.es_estudiante} onChange={handleChange}/>
          </label>
          <br/>
          <button type="submit">Modificar</button>
        </form>
      </div>
  );
};

export default ModifyUser;