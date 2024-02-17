import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div>
      <h1>UDEVERSO</h1>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/aulavirtual">Aula Virtual</Link>
            </li>
            <li>
              <Link to="/abm">ABM</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default NotFound;
