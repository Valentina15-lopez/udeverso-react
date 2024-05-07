import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { AuthProvider } from "./components/AuthContext";
import routes from "./routes";
import { RoomProvider } from "../src/components/RoomContext";
import { UserProvider } from "./context/UserContext";
import "./App.css";

function App() {
  const element = useRoutes(routes);
  return (
    <div className="flex flex-col min-h-screen h-screen">
      <Header />
      <div className="flex-1 overflow-y-auto bg-blue-100">{element}</div>
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
