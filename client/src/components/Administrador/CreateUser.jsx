import React, { useState } from "react";
import axios from "axios";

const CreateUser = () => {
  const [formData, setFormData] = useState({
    usuario: "",
    contrasenia: "",
    nombre_para_mostrar: "",
    sala: "",
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
      await axios.post("https://metaversoude2.ddns.net:3001/api/users", formData);
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
    <div>
      <h1>Insertar Usuario</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Usuario:
          <input type="text" name="usuario" onChange={handleChange} />
        </label>
        <br />
        <label>
          Contrasenia:
          <input type="text" name="contrasenia" onChange={handleChange} />
        </label>
        <br />
        <label>
          Nombre para mostrar:
          <input
            type="text"
            name="nombre_para_mostrar"
            onChange={handleChange}
          />
        </label>
        <br />
        <label>
          Sala:
          <input type="text" name="sala" onChange={handleChange} />
        </label>
        <br />
        <label>
          Correo:
          <input type="email" name="correo" onChange={handleChange} />
        </label>
        <br />
        <label>
          Es_Estudiante:
          <input type="text" name="es_estudiante" onChange={handleChange} />
        </label>
        <br />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
};

export default CreateUser;
