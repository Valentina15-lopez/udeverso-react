import React from "react";
import Logo from "../assets/LOGOUDE.png";

const Header = ({ title }) => {
  return (
    <header className="bg-blue-900 text-white">
      <div>
        <img src={Logo} alt="LogoUde" className="w-36" />
      </div>
      <span className="text-2xl font-bold">{title}</span>
    </header>
  );
};

export default Header;
