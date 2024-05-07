import React from "react";
import Logo from "../assets/LOGOUDE.png";

const Header = () => {
  return (
    <header
      className="bg-blue-900
     text-white"
    >
      <div>
        <img src={Logo} alt="LogoUde" className="w-36" />
      </div>
    </header>
  );
};

export default Header;
