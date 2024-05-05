import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

export const NameInput = () => {
  const { userName: contextUserName, setUserName: setContextUserName } =
    useContext(UserContext);
  const [userName, setUserName] = useState(contextUserName || "");

  const handleInputChange = (e) => {
    setUserName(e.target.value);
    setContextUserName(e.target.value);
  };

  return (
    <input
      className="border rounded-md p-2 h-10 my-2 w-full"
      placeholder="Enter your name"
      onChange={handleInputChange}
      value={userName}
    />
  );
};
