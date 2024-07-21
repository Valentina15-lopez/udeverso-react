import React from "react";
import { BrowserRouter, useRoutes } from "react-router-dom";
import Header from "../src/components/Header";
import Footer from "../src/components/Footer";
import { AuthProvider } from "./components/AuthContext";
import routes from "./routes";
import { RoomProvider } from "../src/context/RoomContext";
import { UserProvider } from "./context/UserContext";
import "./App.css";
import { ChatProvider } from "./context/ChatContext";
import { AvatarConfigProvider } from "./context/AvatarConfigContext";

function App() {
  const element = useRoutes(routes);
  const pageTitle = element.title; // Obtener el título de la ruta actual
  return (
    <div className="flex flex-col min-h-screen h-screen">
      <Header title={pageTitle} />
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
            <AvatarConfigProvider>
              <ChatProvider>
                <App />
              </ChatProvider>
            </AvatarConfigProvider>
          </RoomProvider>
        </UserProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}
