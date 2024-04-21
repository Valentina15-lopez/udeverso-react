import React, { useState, useEffect } from "react";
import Login from "./pages/Login";
import AulaVirtual from "./pages/AulaVirtual";
import Abm from "./pages/ABM";
import NotFound from "./pages/NotFound";
import ListUsers from "./pages/ListUsers";
import ModifyUsers from "./pages/ModifyUsers";
import CreateUsers from "./pages/CreateUsers";
import Material from "./pages/Material";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { Join } from "./components/Streaming/Join";

const ProtectedRoute = ({ element }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3001/api/checkAuth",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return element;
};

const routes = [
  {
    path: "/aulavirtual/:roomId", // Agrega el parámetro de ruta para el ID
    element: <ProtectedRoute element={<AulaVirtual />} />,
  },
  {
    path: "/aulavirtual", // Agrega el parámetro de ruta para el ID
    element: <ProtectedRoute element={<Join />} />,
  },
  {
    path: "/abm",
    element: <ProtectedRoute element={<Abm />} />,
  },
  {
    path: "/abm/listUsers",
    element: <ProtectedRoute element={<ListUsers />} />,
  },
  {
    path: "/abm/modifyUsers",
    element: <ProtectedRoute element={<ModifyUsers />} />,
  },
  {
    path: "/abm/createUsers",
    element: <ProtectedRoute element={<CreateUsers />} />,
  },
  {
    path: "/abm/material",
    element: <ProtectedRoute element={<Material />} />,
  },
  {
    path: "/", // Redirige la ruta raíz al menú
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login", // Redirige la ruta raíz al menú
    element: <Login />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
];

export default routes;
