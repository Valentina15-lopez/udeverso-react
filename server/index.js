import { Server } from "socket.io";
import express from "express";
import http from "http";
import { v4 as uuidV4 } from "uuid";

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Reemplaza esto con la URL de tu aplicación React
  },
});
app.use((req, res, next) => {
  console.log(`Solicitud recibida para: ${req.url}`);
  next();
});

// Ruta para redirigir a AulaVirtual con un ID generado
app.get("/aulavirtual", (req, res) => {
  const roomId = uuidV4(); // Genera un ID único
  res.redirect(`/aulavirtual/${roomId}`);
});

// Ruta para servir la página de React
app.get("/aulavirtual/:roomId", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const users = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");

  users.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });
  io.emit("users", users);

  socket.on("join-room", (roomId, userId) => {
    socket.join(roomId);
    socket.to(roomId).broadcast.emit("user-connected", userId);

    socket.on("disconnect", () => {
      socket.to(roomId).broadcast.emit("user-disconnected", userId);
    });
  });

  socket.on("move", (position) => {
    const character = users.find((character) => character.id === socket.id);
    character.position = position;
    io.emit("users", users);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    users.splice(
      users.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("users", users);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
