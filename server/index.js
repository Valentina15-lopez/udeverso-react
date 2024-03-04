import { Server } from "socket.io";
import express from "express";
//import http from "http";
import http from "http";
import fs from "fs";

const app = express();
//const server = http.createServer(app);
// Lee los archivos del certificado y la clave privada
const privateKey = fs.readFileSync("key.pem", "utf8");
const certificate = fs.readFileSync("cert.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const server = http.createServer(credentials, app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
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

  socket.on("disconnect", () => {
    console.log("user disconnected");
    socket.broadcast.emit("callEnded");
    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });

  socket.emit("me", socket.id);

  socket.on("callUser", ({ userToCall, signalData, from, name, data }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log("Server is running on port");
});
