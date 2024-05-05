import { Server } from "socket.io";
import express from "express";

//import http from "http";
import https from "https";
import { v4 as uuidV4 } from "uuid";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
import bcrypt from "bcrypt"; // Importa el módulo bcrypt
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
//import fs from "fs";
/*
// Lee los archivos del certificado y la clave privada
const privateKey = fs.readFileSync('privkey.pem', 'utf8');
const certificate = fs.readFileSync('fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };

*/


import fs from "fs";

// Lee los archivos del certificado y la clave privada
const privateKey = fs.readFileSync('privkey.pem', 'utf8');
const certificate = fs.readFileSync('fullchain.pem', 'utf8');
const credentials = { key: privateKey, cert: certificate };


const { Pool } = pkg;

const secretKey = "miClaveSecreta";

const app = express();

//const server = http.createServer(app);
const server = https.createServer(credentials, app);

export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true, // Habilitar el intercambio de cookies y otros datos de autenticación
  },
});

app.use(express.json());
app.use(
  cors({
    origin: "https://metaversoude2.ddns.net:3000",
    methods: ["GET", "POST"], // Métodos HTTP permitidos
    credentials: true,
  })
);

app.use(cookieParser());
const usersList = [];

// Configurar la conexión a la base de datos PostgreSQL
const pool = new Pool({
  user: "udeverso_user",
  host: "localhost",
  database: "udeverso",
  password: "puerta2024",
  port: 5432,
});

// Ruta para verificar la autenticación
app.get("/api/checkAuth", (req, res) => {
  const token = req.cookies.sessionToken; // Obtener el token de la cookie de sesión
  console.log(token);
  if (!token) {
    return res.sendStatus(401); // No hay token, no autorizado
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.sendStatus(403); // Token inválido, prohibido
    }
    res.sendStatus(200); // Usuario autenticado, devolver código de estado 200
  });
});

// Ruta para el login
app.post("/login", async (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE usuario = $1", [
      nombreUsuario,
    ]);
    const usuario = result.rows[0];

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log(usuario.contrasenia);
    console.log("##contrasenia", contrasena);

    const saltRounds = 10;

    // Generar hash de la contraseña almacenada
    const hashContraseñaAlmacenada = await bcrypt.hash(
      usuario.contrasenia,
      saltRounds
    );

    // Comparar contraseña proporcionada con hash almacenado
    const contrasenaValida = await bcrypt.compare(
      contrasena,
      hashContraseñaAlmacenada
    );
    if (!contrasenaValida) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    // Generar token JWT
    const token = jwt.sign({ userId: usuario.id }, secretKey, {
      expiresIn: "24h",
    });

    // Envía el token al cliente en una cookie
    res.cookie("sessionToken", token, { httpOnly: true });
    res.status(200).json(usuario);
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/users", async (req, res) => {
  try {
    const {
      usuario,
      contrasenia,
      nombre_para_mostrar,
      sala,
      correo,
      es_estudiante,
    } = req.body;
    const nuevoUsuario = await pool.query(
      "INSERT INTO users (usuario, contrasenia,nombre_para_mostrar,sala,correo,es_estudiante) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *",
      [usuario, contrasenia, nombre_para_mostrar, sala, correo, es_estudiante]
    );

    res.json(nuevoUsuario.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await pool.query("SELECT * FROM users");
    res.status(200).json(users);
    //console.dir("Los usuarios devueltos son " + users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    console.dir("El id recibido es " + id);
    const users = await pool.query("SELECT * FROM users WHERE id = $1", [id]);

    console.dir("Los usuarios devueltos son " + users);

    // Verificamos si se encontró el usuario
    if (users.rows.length > 0) {
      res.status(200).json(users.rows[0]); // Si el usuario existe, devolvemos sus datos
    } else {
      res.status(404).send("Usuario no encontrado"); // Si no existe, devolvemos un error 404
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message); // Imprimir el mensaje de error en la consola
    res.status(500).json({ error: "Error al obtener usuarios" }); // Devolver un mensaje de error al cliente
  }
});

app.put("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updatedUser = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el usuario" });
  }
});
// Ruta para eliminar un usuario por su ID
app.delete("/api/users/:id", (req, res) => {
  const { id } = req.params;

  users = users.filter((user) => user.id !== parseInt(id));
  res.send("Usuario eliminado exitosamente");
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/users/material", upload.single("archivo"), async (req, res) => {
  try {
    const { usuario, nombre, ext } = req.body;
    const fileBuffer = req.file.buffer;

    // Guardar el archivo en la base de datos PostgreSQL
    const result = await pool.query(
      "INSERT INTO usuario_material (usuario, nombre, ext, material) VALUES ($1, $2, $3, $4)",
      [usuario, nombre, ext, fileBuffer]
    );

    console.log("Material agregado exitosamente");
    res.status(200).send("Material agregado exitosamente");
  } catch (error) {
    console.error("Error al agregar material:", error.message);
    res.status(500).send("Error al agregar material");
  }
});

app.get("/api/users/material/:usuario", async (req, res) => {
  try {
    const { usuario } = req.params;
    const materiales = await getMaterialById(usuario);
    res.status(200).json(materiales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

const getMaterialById = async (usuario) => {
  const query = "SELECT * FROM usuario_material WHERE usuario = $1";
  const values = [usuario];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

app.use((req, res, next) => {
  console.log(`Solicitud recibida para: ${req.url}`);
  next();
});

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
    socket.emit("get-messages", chats[roomId]);
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
    console.log({ roomId, peerId });
    socket.to(roomId).emit("user-started-sharing", peerId);
  };

  const stopSharing = (roomId) => {
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
  usersList.push({
    id: socket.id,
    roomId: null,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });
  io.emit("usersList", usersList);
  console.log("a user connected");
  roomHandler(socket);
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
