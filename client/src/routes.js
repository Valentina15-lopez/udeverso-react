import Menu from "./pages/Menu";
import AulaVirtual from "./pages/AulaVirtual";
import Abm from "./pages/ABM";
import NotFound from "./pages/NotFound";

const routes = [
  {
    path: "/aulavirtual",
    element: <AulaVirtual />,
  },
  {
    path: "/abm",
    element: <Abm />,
  },
  {
    path: "/Menu",
    element: <Menu />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
];

export default routes;
