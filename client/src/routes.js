import Menu from "./pages/Menu";
import AulaVirtual from "./pages/AulaVirtual";
import Abm from "./pages/ABM";
import { Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";

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
    path: "/", // Redirige la ruta raíz al menú
    element: <Navigate to="/menu" replace />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
];

export default routes;
