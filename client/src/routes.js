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

const RoleProtectedRoute = ({ element, roles }) => {
  const [user, setUser] = useState(null);
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
          const userData = await axios.get(
            `https://metaversoude2.ddns.net:3001/api/users/${response.data.usuario}`
          );
          setUser(userData.data);
          console.log(userData.data);
        }
      } catch (error) {
        setUser(null);
      }
      setLoading(false);
    };
    checkAuth();
    console.log(user);
    console.log(roles);

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!user) {
      return <Navigate to="/login" />;
    }

    if (!roles.includes(user.rol)) {
      return <Navigate to="/not-found" />;
    }

    return element;
  });
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
];

export default routes;
