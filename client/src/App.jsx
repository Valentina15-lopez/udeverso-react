import routes from "./routes";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";

function App() {
  const element = useRoutes(routes);
  return element;
}

export default () => (
  <BrowserRouter>
    <div>
      <Header />
      <App />
      <Footer />
    </div>
  </BrowserRouter>
);
