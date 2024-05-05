import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const CreateMaterial = () => {
  const { userId } = useParams();
  const [formData, setFormData] = useState({
    usuario: "",
    nombre: "",
    ext: "",
    archivo: null, // Modificamos el estado para almacenar el archivo
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/users/${userId}`
        );
        const userData = response.data;
        setFormData({
          ...formData,
          usuario: userData.usuario,
        });
      } catch (error) {
        console.error(
          "Error al cargar los datos del usuario al insertar material",
          error
        );
      }
    };

    loadUserData();
  }, [userId]);

  const handleChange = (e) => {
    if (e.target.name === "archivo") {
      // Si el cambio es en el campo de archivo, almacenamos el archivo en el estado
      setFormData({ ...formData, archivo: e.target.files[0] });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData(); // Creamos un objeto FormData
      formDataToSend.append("usuario", formData.usuario);
      formDataToSend.append("nombre", formData.nombre);
      formDataToSend.append("ext", formData.ext);
      formDataToSend.append("archivo", formData.archivo); // Agregamos el archivo al FormData

      await axios.post(
        "http://localhost:5000/api/users/material",
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
          <input
            type="text"
            name="usuario"
            value={formData.usuario}
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Nombre archivo:
          <input type="text" name="nombre" onChange={handleChange} />
        </label>
        <br />
        <label>
          Extension:
          <input type="text" name="ext" onChange={handleChange} />
        </label>
        <br />
        <label>
          Archivo:
          <input type="file" name="archivo" onChange={handleChange} />
        </label>
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default CreateMaterial;
