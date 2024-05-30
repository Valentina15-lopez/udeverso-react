import React, { useState, useEffect, useContext } from "react";
import Login from "./pages/Login";
import AulaVirtual from "./pages/AulaVirtual";
import Abm from "./pages/ABM";
import NotFound from "./pages/NotFound";
import ListUsers from "./pages/ListUsers";
import ModifyUsers from "./pages/ModifyUsers";
import CreateUsers from "./pages/CreateUsers";
import DeleteUsers from "./pages/DeleteUsers";
import Material from "./pages/Material";
import ListMaterials from "./pages/ListMaterials";
import LoadingSpinner from "../src/components/LoadingSpinner";
import axios from "axios";
import { Navigate, useLocation } from "react-router-dom";
import { Join } from "./components/Streaming/Join";
import MenuDocente from "./pages/MenuDocente";
import { JoinRoom } from "./components/Streaming/JoinRoom";
import { UserContext } from "../src/context/UserContext";
import AccessDenied from "./pages/AccessDenied";

const RoleProtectedRoute = ({ element, roles }) => {
  const { user } = useContext(UserContext);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(
          "https://metaversoude2.ddns.net:3001/api/checkAuth",
          {
            withCredentials: true,
          }
        );
        if (response.status === 200) {
          setIsAuthenticated(true);
          console.log(response.data);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
      setIsCheckingAuth(false);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (!roles.includes(user.rol)) {
    return <Navigate to="/access-denied" />;
  }

  return element;
};

const routes = [
  {
    path: "/aulavirtual/:roomId",
    element: (
      <RoleProtectedRoute element={<AulaVirtual />} roles={["alumno"]} />
    ),
  },
  {
    path: "/inicioDocente",
    element: <RoleProtectedRoute element={<Join />} roles={["profesor"]} />,
  },
  {
    path: "/inicioEstudiante",
    element: <RoleProtectedRoute element={<JoinRoom />} roles={["alumno"]} />,
  },
  {
    path: "/abm",
    element: <RoleProtectedRoute element={<Abm />} roles={["administrador"]} />,
  },
  {
    path: "/abm/listUsers",
    element: (
      <RoleProtectedRoute element={<ListUsers />} roles={["administrador"]} />
    ),
  },
  {
    path: "/abm/modifyUsers",
    element: (
      <RoleProtectedRoute element={<ModifyUsers />} roles={["administrador"]} />
    ),
  },
  {
    path: "/abm/deleteUsers",
    element: (
      <RoleProtectedRoute element={<DeleteUsers />} roles={["administrador"]} />
    ),
  },
  {
    path: "/abm/createUsers",
    element: <CreateUsers />,
  },
  {
    path: "/abm/material",
    element: (
      <RoleProtectedRoute element={<Material />} roles={["administrador"]} />
    ),
  },
  {
    path: "/abm/listMaterials",
    element: (
      <RoleProtectedRoute
        element={<ListMaterials />}
        roles={["administrador"]}
      />
    ),
  },
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
  {
    path: "/MenuDocente*",
    element: (
      <RoleProtectedRoute element={<MenuDocente />} roles={["profesor"]} />
    ),
  },
  {
    path: "/access-denied",
    element: <AccessDenied />,
  },
];

export default routes;
