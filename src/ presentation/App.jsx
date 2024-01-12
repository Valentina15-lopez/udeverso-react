import React from "react";
import { createRoot } from "react-dom";
import AulaVirtual from "./components/AulaVirtual.jsx";
import { SocketProvider } from "../logic/services/SocketContext.js";

const App = () => {
  return (
    <SocketProvider>
      {/* Otros componentes pueden ir aquí */}
      <AulaVirtual />
    </SocketProvider>
  );
};

const root = createRoot(document.getElementById("root"));
root.render(<App />);
export default App;
