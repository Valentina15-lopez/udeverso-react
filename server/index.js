import { Server } from "socket.io";
import express from "express";
import https from "https";
import fs from "fs";

const app = express();

// Lee los archivos del certificado y la clave privada
const privateKey = fs.readFileSync('key.pem', 'utf8');
const certificate = fs.readFileSync('cert.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Crea un servidor HTTPS utilizando los certificados
const server = https.createServer(credentials, app);

const io = new Server(server, {
  cors: {
    origin: "https://localhost:3000", // Reemplaza esto con la URL de tu aplicación React
  },
});

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");

  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  socket.emit("hello");

  io.emit("characters", characters);

  socket.on("move", (position) => {
    const character = characters.find(
      (character) => character.id === socket.id
    );
    character.position = position;
    io.emit("characters", characters);
  });

  // Escuchar el evento de flujo de audio del cliente
  socket.on("audioStream", (stream) => {
    console.log("audio");
    // Retransmitir el flujo de audio a todos los otros usuarios conectados
    socket.broadcast.emit("audioStream", stream);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
