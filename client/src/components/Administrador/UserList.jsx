import React, { useState, useEffect } from "react";
import axios from "axios";

const UserList = ({ onUserClick }) => {
    // Estado para almacenar la lista de usuarios
    const [users, setUsers] = useState([]);

    // Cargar la lista de usuarios cuando el componente se monta
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get("http://localhost:3001/api/users");
                setUsers(response.data); // Asignar la lista de usuarios al estado
            } catch (error) {
                console.error("Error al obtener la lista de usuarios:", error);
            }
        };

        fetchUsers(); // Llamar a la función para cargar los usuarios
    }, []); // Efecto sin dependencias para que se ejecute solo una vez al montar el componente

    const handleUserClick = (userId) => {
        // Llama a la función de devolución de llamada onUserClick con el ID del usuario
        onUserClick(userId);
    };

    return (
        <div>
            <h2>Lista de Usuarios</h2>
            <ul>
                {users.map((user) => (
                    <li key={user.usuario} onClick={() => handleUserClick(user.usuario)}>
                        {user.usuario} {/* Mostrar el nombre del usuario */}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default UserList;
