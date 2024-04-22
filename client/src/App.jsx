import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { AuthProvider } from "./components/AuthContext";
import routes from "./routes";
import { RoomProvider } from "../src/components/RoomContext";
import { UserProvider } from "./context/UserContext";

function App() {
  const element = useRoutes(routes);
  return (
    <div>
      <Header />
      {element}
      <Footer />
    </div>
  );
}

export default function Root() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <UserProvider>
          <RoomProvider>
            <App />
          </RoomProvider>
        </UserProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
