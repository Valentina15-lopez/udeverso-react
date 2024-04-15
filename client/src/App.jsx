import routes from "./routes";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { AuthProvider } from "./components/AuthContext";

function App() {
  const element = useRoutes(routes);
  return element;
}

export default () => (
  <AuthProvider>
    <BrowserRouter>
      <div>
        <Header />
        <App />
        <Footer />
      </div>
    </BrowserRouter>
  </AuthProvider>
);
