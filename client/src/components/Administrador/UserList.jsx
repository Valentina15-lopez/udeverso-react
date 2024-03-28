import React from "react";
import { userAtom } from "../../components/ContexProvider";
import { useAtom } from "jotai";

const UserList = () => {
  const [users] = useAtom(userAtom);
  console.log(users);
  console.log("usernames", users);
  return (
    <div>
      <h2>Lista de Usuarios</h2>
      <ul>{users && users.map((user) => <li>{user.id}</li>)}</ul>
    </div>
  );
};

export default UserList;
