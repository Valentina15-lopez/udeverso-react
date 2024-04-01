import React, { useState } from "react";
import axios from "axios";

const ModifyUser = ({ user }) => {
  const [newUsername, setNewUsername] = useState(user.username);
  const onUpdate = async () => {
    try {
      await axios.put(`http://localhost:3001/api/users/${user.id}`, {
        username: newUsername,
      });
      onUpdate(user.id, newUsername);
      console.log("Usuario actualizado exitosamente");
    } catch (error) {
      console.error("Error al actualizar usuario:", error);
    }
  };

  const onDelete = async () => {
    try {
      await axios.delete(`http://localhost:3001/api/users/${user.id}`);
      onDelete(user.id);
      console.log("Usuario eliminado exitosamente");
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  };
  const handleUpdate = () => {
    // Aquí puedes realizar la solicitud HTTP para actualizar el nombre de usuario en la base de datos
    onUpdate(user.id, newUsername);
  };

  const handleDelete = () => {
    // Aquí puedes realizar la solicitud HTTP para eliminar el usuario de la base de datos
    onDelete(user.id);
  };

  return (
    <div>
      <input
        type="text"
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <button onClick={handleUpdate}>Actualizar</button>
      <button onClick={handleDelete}>Eliminar</button>
    </div>
  );
};

export default ModifyUser;
