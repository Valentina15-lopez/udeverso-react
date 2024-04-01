import Login from "./pages/Login";
import AulaVirtual from "./pages/AulaVirtual";
import Abm from "./pages/ABM";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import ListUsers from "./pages/ListUsers";
import ModifyUsers from "./pages/ModifyUsers";
import CreateUsers from "./pages/CreateUsers";
import Material from "./pages/Material";

const routes = [
  {
    path: "/aulavirtual/:roomId", // Agrega el parámetro de ruta para el ID
    element: <AulaVirtual />,
  },
  {
    path: "/abm",
    element: <Abm />,
  },
  {
    path: "/abm/listUsers",
    element: <ListUsers />,
  },
  {
    path: "/abm/modifyUsers",
    element: <ModifyUsers />,
  },
  {
    path: "/abm/createUsers",
    element: <CreateUsers />,
  },
  {
    path: "/abm/material",
    element: <Material />,
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
