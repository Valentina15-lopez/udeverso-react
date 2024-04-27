import React, { useState, useEffect } from "react";
import axios from "axios";

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
      formDataToSend.append("usuario", formData.usuario); // Usuario.js seleccionado
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
      <div>
        <h1>Insertar Material</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <label>
            Usuario:
            <select name="usuario" value={formData.usuario} onChange={handleChange}>
              <option value="">Seleccionar usuario</option>
              {usuarios.map((usuario) => (
                  <option key={usuario.usuario} value={usuario.usuario}>
                    {usuario.usuario}
                  </option>
              ))}
            </select>
          </label>
          <br />
          <label>
            Nombre del archivo:
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} />
          </label>
          <br />
          <label>
            Extensión:
            <input type="text" name="ext" value={formData.ext} onChange={handleChange} />
          </label>
          <br />
          <label>
            Archivo:
            <input type="file" name="archivo" onChange={handleChange} />
          </label>
          <br />
          <button type="submit">Enviar</button>
        </form>
      </div>
  );
};

export default CreateMaterial;
