import routes from "./routes";
import { BrowserRouter, useRoutes } from "react-router-dom";
function App() {
  const element = useRoutes(routes);
  return element;
}

export default () => (
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
