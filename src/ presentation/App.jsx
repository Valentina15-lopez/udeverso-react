import React from "react";
import AulaVirtual from "./components/AulaVirtual.jsx";
import { SocketProvider } from "../logic/services/SocketContext.js";

function App() {
  return (
    <SocketProvider>
      {/* Otros componentes pueden ir aquí */}
      <AulaVirtual />
    </SocketProvider>
  );
}
export default App;
