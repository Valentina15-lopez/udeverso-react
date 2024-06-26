import express from "express";

//import http from "http";
import https from "https";
import { v4 as uuidV4 } from "uuid";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/userRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import usersRoomsRoutes from "./src/routes/usersRoomsRoutes.js";
import userMaterialsRoutes from "./src/routes/userMaterialsRoutes.js";
import logger from "./src/middleware/logger.js";
import sequelize from "./src/config/database.js";
import swaggerUi from "swagger-ui-express";
import swaggerDocs from "./src/config/swagger.js";
import { Server } from "socket.io";

import fs from "fs";

// Lee los archivos del certificado y la clave privada
const privateKey = fs.readFileSync("privkey.pem", "utf8");
const certificate = fs.readFileSync("fullchain.pem", "utf8");
const credentials = { key: privateKey, cert: certificate };

const secretKey = "miClaveSecreta";

const app = express();

//const server = http.createServer(app);
const server = https.createServer(credentials, app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT"],
    credentials: true, // Habilitar el intercambio de cookies y otros datos de autenticación
  },
});

app.use(express.json());
app.use(
  cors({
    //origin: "http://localhost:3000",
    origin: "https://metaversoude2.ddns.net:3000",
    methods: ["GET", "POST", "PUT"], // Métodos HTTP permitidos
    credentials: true,
  })
);

app.use(cookieParser());
const usersList = [];

app.use(express.json());

app.use(cookieParser());

app.use(logger); // Middleware global

app.use(userRoutes); // Conecta rutas de usuarios
app.use(roomRoutes); // Conecta rutas de salas
app.use(usersRoomsRoutes); // Conecta rutas de usuarios y salas
app.use(userMaterialsRoutes); // Conecta rutas de usuarios y materiales

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

const rooms = {};
const chats = {};

const roomHandler = (socket) => {
  const createRoom = () => {
    const roomId = uuidV4();
    rooms[roomId] = {};
    socket.emit("room-created", { roomId });
    console.log("user created the room");
  };

  const joinRoom = ({ roomId, peerId, userName }) => {
    if (!rooms[roomId]) rooms[roomId] = {};
    if (!chats[roomId]) chats[roomId] = [];
    usersList.push({
      id: socket.id,
      peerId: peerId,
      position: generateRandomPosition(),
      hairColor: generateRandomHexColor(),
      topColor: generateRandomHexColor(),
      bottomColor: generateRandomHexColor(),
    });

    io.emit("usersList", usersList);

    socket.emit("get-messages", chats[roomId]);
    socket.emit("room-joined", { roomId });

    console.log("user joined the room", roomId, peerId, userName);
    rooms[roomId][peerId] = { peerId, userName };
    socket.join(roomId);
    socket.to(roomId).emit("user-joined", { peerId, userName });
    socket.emit("get-users", {
      roomId,
      participants: rooms[roomId],
    });

    socket.on("disconnect", () => {
      console.log("user left the room", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }) => {
    socket.to(roomId).emit("user-disconnected", peerId);
  };

  const startSharing = ({ peerId, roomId }) => {
    console.log(
      "El peerId " + peerId + " empezó a compartir en el romm " + roomId
    );
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId) => {
    console.log("Se dejo de compartir en el roomId " + roomId);
    socket.to(roomId).emit("user-stopped-sharing");
  };

  const addMessage = (roomId, message) => {
    console.log({ message });
    if (chats[roomId]) {
      chats[roomId].push(message);
    } else {
      chats[roomId] = [message];
    }
    socket.to(roomId).emit("add-message", message);
  };

  const changeName = ({ peerId, userName, roomId }) => {
    if (rooms[roomId] && rooms[roomId][peerId]) {
      rooms[roomId][peerId].userName = userName;
      socket.to(roomId).emit("name-changed", { peerId, userName });
    }
  };

  socket.on("create-room", createRoom);
  socket.on("join-room", joinRoom);
  socket.on("start-sharing", startSharing);
  socket.on("stop-sharing", stopSharing);
  socket.on("send-message", addMessage);
  socket.on("change-name", changeName);
};

io.on("connection", (socket) => {
  socket.on("move", (position) => {
    const user = usersList.find((item) => item.id === socket.id);
    user.position = position;
    io.emit("usersList", usersList);
  });

  console.log("a user connected");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
    usersList.splice(
      usersList.findIndex((item) => item.id === socket.id),
      1
    );
    io.emit("usersList", usersList);
  });
});

// Autenticar la conexión a la base de datos antes de iniciar el servidor
sequelize
  .authenticate()
  .then(() => {
    console.log("Conexión a la base de datos exitosa");
  })
  .catch((error) => {
    console.error("Error al conectarse a la base de datos:", error.message);
  });

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const startServer = () => {
  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export { app, startServer };
