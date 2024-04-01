import React, { useState } from "react";
import ModifyUser from "../../components/Administrador/ModifyUser";
import UserList from "../../components/Administrador/UserList";

const ModifyUsers = () => {
  const [userEdit, setUserEdit] = useState();
  const handleUserClick = (userId) => {
    setUserEdit(userId);
  };

  return (
    <>
      <UserList onUserClick={handleUserClick} />
      <ModifyUser userEdit />
    </>
  );
};

export default ModifyUsers;
