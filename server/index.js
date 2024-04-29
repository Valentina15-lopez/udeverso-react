import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./src/routes/userRoutes.js";
import roomRoutes from "./src/routes/roomRoutes.js";
import usersRoomsRoutes from "./src/routes/usersRoomsRoutes.js";
import userMaterialsRoutes from "./src/routes/userMaterialsRoutes.js";
import logger from "./src/middleware/logger.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    },
});

app.use(express.json());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
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

const usersList = [];

io.on("connection", (socket) => {
    usersList.push({
        id: socket.id,
        position: generateRandomPosition(),
        hairColor: generateRandomHexColor(),
        topColor: generateRandomHexColor(),
        bottomColor: generateRandomHexColor(),
    });
    io.emit("usersList", usersList);

    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).broadcast.emit("user-connected", userId);

        socket.on("disconnect", () => {
            socket.to(roomId).broadcast.emit("user-disconnected", userId);
        });
    });

    socket.on("move", (position) => {
        const character = usersList.find((character) => character.id === socket.id);
        character.position = position;
        io.emit("usersList", usersList);
    });

    socket.on("disconnect", () => {
        console.log("user disconnected");

        usersList.splice(
            usersList.findIndex((character) => character.id === socket.id),
            1
        );
        io.emit("usersList", usersList);
    });
});

// Solo inicia el servidor si el script se ejecuta directamente
//esto se agregó por que daba error al momento de correr los tests, como que el servidor estaba iniciado y el puerto quedaba en uso
if (require.main === module) {
    const PORT = process.env.PORT || 3001;
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

export default app;