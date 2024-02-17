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

const avatars = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");

  avatars.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  socket.emit("hello");

  io.emit("avatars", avatars);

  socket.on("move", (position) => {
    const avatar = avatars.find((avatar) => avatar.id === socket.id);
    avatar.position = position;
    io.emit("avatars", avatars);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    avatars.splice(
      avatars.findIndex((avatar) => avatar.id === socket.id),
      1
    );
    io.emit("avatars", avatars);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
