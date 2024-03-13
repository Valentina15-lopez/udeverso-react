import { Server } from "socket.io";
import express from "express";
import http from "http";

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Reemplaza esto con la URL de tu aplicación React
  },
});
app.get("/aulavirtual", (req, res) => {
  res.redirect(`/${uuidV4()}`);
});

app.get("/aulavirtual/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
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

  socket.emit("hello");

  io.emit("users", users);

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });
  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });

  socket.on("stream", (dataUrl) => {
    socket.broadcast.emit("stream", dataUrl);
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
