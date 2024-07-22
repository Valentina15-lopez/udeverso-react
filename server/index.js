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
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Habilitar el intercambio de cookies y otros datos de autenticación
  },
});

app.use(express.json());
app.use(
  cors({
    //origin: "http://localhost:3000",
    origin: "https://metaversoude2.ddns.net:3000",
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(cookieParser());

app.use(logger); // Middleware global

app.use(userRoutes); // Conecta rutas de usuarios
app.use(roomRoutes); // Conecta rutas de salas
app.use(usersRoomsRoutes); // Conecta rutas de usuarios y salas
app.use(userMaterialsRoutes); // Conecta rutas de usuarios y materiales

const rooms = {};
const chats = {};
const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};
const usersList = [];

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
    socket.on("user-disconnected", () => {
      console.log("user-disconnected", peerId);
      leaveRoom({ roomId, peerId });
    });
  };

  const leaveRoom = ({ peerId, roomId }) => {
    socket.to(roomId).emit("user-disconnected", peerId);
    const userIndex = usersList.findIndex((item) => item.id === socket.id);
    if (userIndex !== -1) {
      usersList.splice(userIndex, 1);
    }
    io.emit("usersList", usersList);
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
app.post("/api/updateAvatar/:userName", (req, res) => {
  const { userName } = req.params;
  const { hairColor, topColor, bottomColor } = req.body;
  const newAvatarConfig = { hairColor, topColor, bottomColor };
  io.emit("update-avatar-config", userName, newAvatarConfig);
  console.log(usersList);
  res.status(200).json({ usersList });
});

io.on("connection", (socket) => {
  console.log("usersList", usersList);
  socket.on("update-avatar-config", ({ userName, newAvatarConfig }) => {
    const user = {
      id: socket.id,
      position: generateRandomPosition(),
      userName: userName,
      hairColor: newAvatarConfig.hairColor,
      topColor: newAvatarConfig.topColor,
      bottomColor: newAvatarConfig.bottomColor,
    };
    usersList.push(user);
    io.emit("usersList", usersList);
  });
  socket.on("move", (position) => {
    const user = usersList.find((item) => item.id === socket.id);
    if (user) {
      user.position = position;
      io.emit("usersList", usersList);
    }
  });

  console.log("a user connected");
  roomHandler(socket);
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
