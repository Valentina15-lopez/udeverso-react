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
      className="w-full py-2 px-4 mb-4 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
      placeholder="Enter your name"
      onChange={handleInputChange}
      value={userName}
    />
  );
};
