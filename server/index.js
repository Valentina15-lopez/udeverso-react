import { Server } from "socket.io";
import express from "express";
import http from "http";
import { v4 as uuidV4 } from "uuid";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
const { Pool } = pkg;

const app = express();

const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Reemplaza esto con la URL de tu aplicación React
  },
});
//configure mongoose
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost/prototipo-udeverso",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

const userSchema = new mongoose.Schema({
  usuario: String,
  contrasenia: String,
  nombre_para_mostrar: String,
  sala: String,
  correo: String,
  es_estudiante: String,
});

const User = mongoose.model("User", userSchema);

app.use(express.json());
app.use(cors()); // Usa el middleware 'cors' para habilitar CORS

// Rutas
app.post("/api/users", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    //console.log('Usuario guardado' + user);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: "Error al guardar el usuario" });
  }
});

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
    //console.dir("Los usuarios devueltos son " + users)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.get("/api/users/:id", async (req, res) => {
  try {
    const { id } = req.params;
    //console.dir("El id recibido es " + id)
    const users = await User.findById(id);
    res.status(200).json(users);
    //console.dir("Los usuarios devueltos son " + users)
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
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

const pool = new Pool({
  user: "udeverso_user",
  host: "localhost",
  database: "udeverso",
  password: "udeverso_pass",
  port: 5432, // Puerto predeterminado de PostgreSQL
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
