import routes from "./routes";
import { BrowserRouter, useRoutes } from "react-router-dom";
import { ContextProvider } from "./components/SocketManager";

function App() {
  const element = useRoutes(routes);
  return element;
}

export default () => (
  <BrowserRouter>
    <ContextProvider>
      <App />
    </ContextProvider>
  </BrowserRouter>
);
