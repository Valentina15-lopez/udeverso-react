import Menu from "../../client/ presentation/pages/Menu";
import AulaVirtual from "../../client/ presentation/pages/AulaVirtual";
import Abm from "../../client/ presentation/pages/ABM";
import NotFound from "../../client/ presentation/pages/NotFound";

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
