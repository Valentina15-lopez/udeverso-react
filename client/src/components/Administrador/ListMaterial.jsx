import React, { useState, useEffect } from "react";
import axios from "axios";

const ListMaterial = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [formData, setFormData] = useState({
        usuario: "",
        contrasenia: "",
        nombre_para_mostrar: "",
        sala: "",
        correo: "",
        es_estudiante: "",
    });

    // Cargar lista de usuarios al inicio
    useEffect(() => {
        const loadUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/users");
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
                console.log("Usuario seleccionado:", formData.usuario); // Añadir este console.log
                try {
                    const response = await axios.get(
                        `http://localhost:3001/api/users/${formData.usuario}`
                    );
                    const userData = response.data;
                    // Actualizar formData con los datos del usuario
                    setFormData({
                        ...formData,
                        contrasenia: "", // No cargar contraseñas
                        nombre_para_mostrar: userData.nombre_para_mostrar || "",
                        sala: userData.sala || "",
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

    return (
        <div>
            <h1>Ver datos de usuario</h1>
            <form>
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
                           readOnly={true}
                    />
                </label>
                <br/>
                <label>
                    Sala:
                    <input type="text" name="sala" value={formData.sala} readOnly={true}/>
                </label>
                <br/>
                <label>
                    Correo:
                    <input type="email" name="correo" value={formData.correo} readOnly={true} />
                </label>
                <br/>
                <label>
                    Es Estudiante:
                    <input type="text" name="es_estudiante" value={formData.es_estudiante} readOnly={true}/>
                </label>
            </form>
        </div>
    );
};

export default ListMaterial;
