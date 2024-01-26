import Menu from "../../client/presentation/pages/Menu";
import AulaVirtual from "../../client/presentation/pages/AulaVirtual";
import Abm from "../../client/presentation/pages/ABM";
import AsignarAlumnoSala from "../../client/presentation/pages/AsignarAlumnoSala";
import AsignarDocenteSala from "../../client/presentation/pages/AsignarDocenteSala";
import BorrarSala from "../../client/presentation/pages/BorrarSala";
import BorrarUsuario from "../../client/presentation/pages/BorrarUsuario";
import BuscarUsuario from "../../client/presentation/pages/BuscarUsuario";
import CambiarDocenteSala from "../../client/presentation/pages/CambiarDocenteSala";
import VerSalas from "../../client/presentation/pages/VerSalas";
import BorrarMaterialDocente from "../../client/presentation/pages/BorrarMaterialDocente";
import Login from "../../client/presentation/pages/Login";
import SalirSala from "../../client/presentation/pages/SalirSala";
import NotFound from "../../client/presentation/pages/NotFound";

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
    path: "/asignar-alumno-sala",
    element: <AsignarAlumnoSala />,
  },
  {
    path: "/asignar-docente-sala",
    element: <AsignarDocenteSala />,
  },
  {
    path: "/borrar-sala",
    element: <BorrarSala />,
  },
  {
    path: "/borrar-usuario",
    element: <BorrarUsuario />,
  },
  {
    path: "/buscar-usuario",
    element: <BuscarUsuario />,
  },
  {
    path: "/cambiar-docente-sala",
    element: <CambiarDocenteSala />,
  },
  {
    path: "/ver-salas",
    element: <VerSalas />,
  },
  {
    path: "/borrar-material-docente",
    element: <BorrarMaterialDocente />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/salir-sala",
    element: <SalirSala />,
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
