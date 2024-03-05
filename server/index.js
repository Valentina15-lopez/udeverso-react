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

const PORT = process.env.PORT || 3001;

app.get("/", (req, res) => {
  res.send("Running");
});

io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
