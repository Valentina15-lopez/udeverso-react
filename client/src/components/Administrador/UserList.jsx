import React, { useState } from "react";
import { userAtom } from "../../components/ContexProvider";
import { useAtom } from "jotai";

const UserList = ({ onUserClick }) => {
  const [users] = useAtom(userAtom);
  console.log(users);
  console.log("usernames", users);
  const handleUserClick = (userId) => {
    // Llama a la función de devolución de llamada onUserClick con el ID del usuario
    onUserClick(userId);
  };
  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>
        {users &&
          users.map((user) => (
            <li key={user.id} onClick={() => handleUserClick(user.id)}>
              {user.id}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserList;
