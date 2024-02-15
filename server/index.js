import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Reemplaza esto con la URL de tu aplicación React
  },
});

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const handleConnect = (socket) => {
  console.log("User connected:", socket.id);

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    color: "#" + ((characters.length + 1) * 16777215).toString(16),
  });

  io.emit("characters", characters);
};

const handleDisconnect = (socket) => {
  console.log("User disconnected:", socket.id);

  const index = characters.findIndex((character) => character.id === socket.id);

  if (index !== -1) {
    characters.splice(index, 1);
    io.emit("characters", characters);
  }
};

io.on("connection", (socket) => {
  handleConnect(socket);

  socket.on("sceneLoaded", () => {
    socket.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    handleDisconnect(socket);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
