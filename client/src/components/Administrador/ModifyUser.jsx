import React, { useState } from "react";

const ModifyUser = ({ user, onUpdate, onDelete }) => {
  const [newUsername, setNewUsername] = useState(user.username);

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
