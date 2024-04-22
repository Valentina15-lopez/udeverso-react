import { Server } from "socket.io";
import express from "express";
import http from "http";
import { v4 as uuidV4 } from "uuid";
import mongoose from "mongoose";
import cors from "cors";
import multer from "multer";
import pkg from "pg";
import bcrypt from "bcrypt"; // Importa el módulo bcrypt
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const { Pool } = pkg;

const secretKey = "miClaveSecreta";

const app = express();

const server = http.createServer(app);
const usersList = [];
export const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Reemplaza esto con la URL de tu aplicación React
    credentials: true, // Habilitar el intercambio de cookies y otros datos de autenticación
  },
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"], // Métodos HTTP permitidos
    credentials: true,
  })
);

app.use(cookieParser());

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
  console.log("Se llamo al endpoint GET /api/checkAuth con " + req)
  const token = req.cookies.sessionToken; // Obtener el token de la cookie de sesión
  console.log(token);
  if (!token) {
    console.log("No hay token, no autorizado");
    return res.sendStatus(401); // No hay token, no autorizado
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      console.log("Token inválido, prohibido");
      return res.sendStatus(403); // Token inválido, prohibido
    }
    console.log("Usuario autenticado, devolver código de estado 200");
    res.sendStatus(200); // Usuario autenticado, devolver código de estado 200
  });
});

// Ruta para el login
app.post("/login", async (req, res) => {
  console.log("Se llamo al endpoint POST /login con " + req)
  const { nombreUsuario, contrasena } = req.body;

  try {
    const result = await pool.query("SELECT * FROM users WHERE usuario = $1", [
      nombreUsuario,
    ]);
    const usuario = result.rows[0];

    if (!usuario) {
      console.log("Usuario no encontrado");
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    console.log("En la base es:" + usuario.contrasenia);
    console.log("La enviada es:" + contrasena);

    const contrasenaValida1 = await bcrypt.compare(contrasena, usuario.contrasenia);
    console.log("La nueva comparación da:" + contrasenaValida1);

    if (!contrasenaValida1) {
      console.log("Contraseña incorrecta");
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }
    console.log("Generar token JWT");
    // Generar token JWT
    const token = jwt.sign({ userId: usuario.id }, secretKey, {
      expiresIn: "24h",
    });
    console.log("Envía el token al cliente en una cookie");
    // Envía el token al cliente en una cookie
    res.cookie("sessionToken", token, { httpOnly: true });
    res.status(200).json(usuario);
    console.log("Respuesta enviada");
  } catch (error) {
    console.error("Error al autenticar usuario:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

app.post("/api/users", async (req, res) => {
  console.log("Se llamo al endpoint POST /api/users con " + req)
  try {
    const {
      usuario,
      contrasenia,
      nombre_para_mostrar,
      sala,
      correo,
      es_estudiante,
    } = req.body;

    const saltRounds = 10;

    //Generar hash de la contraseña almacenada
    const hashContrasenia = await bcrypt.hash(
      contrasenia,
      saltRounds
    );

    const nuevoUsuario = await pool.query(
      "INSERT INTO users (usuario, contrasenia,nombre_para_mostrar,sala,correo,es_estudiante) VALUES ($1, $2,$3,$4,$5,$6) RETURNING *",
      [usuario, hashContrasenia, nombre_para_mostrar, sala, correo, es_estudiante]
    );

    res.json(nuevoUsuario.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

app.get("/api/users", async (req, res) => {
  console.log("Se llamo al endpoint GET /api/users con " + req)
  try {
    const users = await pool.query("SELECT * FROM users");
    res.status(200).json(users.rows);
    //console.dir("Los usuarios devueltos son " + users);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

  app.get("/api/users/:id", async (req, res) => {
    console.log("Se llamo al endpoint GET /api/users/:id con " + req)
    try {
    const id = req.params.id;
    const users = await pool.query("SELECT * FROM users WHERE usuario = $1", [id]);

    //console.dir("Los usuarios devueltos son " + users.rows.json);

    // Verificamos si se encontró el usuario
    if (users.rows.length > 0) {
      res.status(200).json(users.rows[0]); // Si el usuario existe, devolvemos sus datos
    } else {
      res.status(404).send("Usuario no encontrado"); // Si no existe, devolvemos un error 404
    }
  } catch (error) {
    console.error("Error al obtener usuarios:", error.message); // Imprimir el mensaje de error en la consola
    res.status(500).json({ error: "Error al obtener el usuario." }); // Devolver un mensaje de error al cliente
  }
});

app.put("/api/users/:usuario", async (req, res) => {
  console.log("Se llamo al endpoint PUT /api/users/:usuario con " + req)
  try {
    const { usuario } = req.params; // El usuario a actualizar
    const {
      nombre_para_mostrar,
      sala,
      correo,
      es_estudiante,
    } = req.body;

    const updateFields = [];
    const updateValues = [usuario]; // Comienza con el usuario para la cláusula WHERE
    let updateIndex = 2; // El primer índice libre para parámetros dinámicos

    // Agregar cada campo solo si está definido en el cuerpo de la solicitud
    if (nombre_para_mostrar !== undefined) {
      updateFields.push(`nombre_para_mostrar = $${updateIndex}`);
      updateValues.push(nombre_para_mostrar);
      updateIndex++;
    }

    if (sala !== undefined) {
      updateFields.push(`sala = $${updateIndex}`);
      updateValues.push(sala);
      updateIndex++;
    }

    if (correo !== undefined) {
      updateFields.push(`correo = $${updateIndex}`);
      updateValues.push(correo);
      updateIndex++;
    }

    if (es_estudiante !== undefined) {
      // Asegúrate de manejar correctamente el tipo de datos para `es_estudiante`
      const esEstudianteBoolean = es_estudiante === "1" || es_estudiante === "true";
      updateFields.push(`es_estudiante = $${updateIndex}`);
      updateValues.push(esEstudianteBoolean);
      updateIndex++;
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ message: "Nada para actualizar" });
    }

    const updateUserQuery = `
      UPDATE users
      SET ${updateFields.join(", ")}
      WHERE usuario = $1
        RETURNING *;
    `;

    const updatedUser = await pool.query(updateUserQuery, updateValues);

    if (updatedUser.rowCount === 0) {
      return res.status(404).send("Usuario no encontrado");
    }

    res.json(updatedUser.rows[0]); // Devuelve el usuario actualizado
  } catch (err) {
    console.error("Error actualizando usuario:", err.message);
    res.status(500).send("Error del servidor");
  }
});

// Ruta para eliminar un usuario por su ID
app.delete("/api/users/:usuario", async (req, res) => {
  console.log("Se llamo al endpoint DELETE /api/users/:usuario con " + req)
  try {
    const { usuario } = req.params; // ID del usuario a eliminar

    console.log("El usuario a borrar es " + usuario);

    // Ejecutar la operación DELETE
    const result = await pool.query("DELETE FROM users WHERE usuario = $1", [usuario]);

    // Verificar cuántas filas fueron afectadas
    if (result.rowCount > 0) {
      res.status(200).send("Usuario borrado con éxito");
    } else {
      res.status(404).send("Usuario no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar usuario:", error);
    res.status(500).send("Error del servidor");
  }
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/api/users/material", upload.single("archivo"), async (req, res) => {
  console.log("Se llamo al endpoint POST /api/users/material con " + req)
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

app.get("/api/users/:usuario/material", async (req, res) => {
  console.log("Se llamo al endpoint GET /api/users/:usuario/material con " + req)
  try {
    const { usuario } = req.params;
    const query = "SELECT * FROM usuario_material WHERE usuario = $1";
    const values = [usuario];
    const { rows } =  await pool.query(query, values);
    const materiales = await rows;
    res.status(200).json(materiales);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener usuarios" });
  }
});

app.delete("/api/users/:usuario/material/:nombre", async (req, res) => {
  console.log("Se llamo al endpoint DELETE /api/users/:usuario/material/:nombre con " + req)
  try {
    const { usuario , nombre} = req.params; // ID del usuario a eliminar

    console.log("El material " + nombre + " se va a borrar del usuario " + usuario);

    // Ejecutar la operación DELETE
    const result = await pool.query("DELETE FROM usuario_material WHERE usuario = $1 and nombre = $2", [usuario, nombre]);

    // Verificar cuántas filas fueron afectadas
    if (result.rowCount > 0) {
      console.log("Material borrado con exito");
      res.status(200).send("Material borrado con exito");
    } else {
      console.log("Material no encontrado");
      res.status(404).send("Material no encontrado");
    }
  } catch (error) {
    console.error("Error al eliminar material:", error);
    res.status(500).send("Error del servidor");
  }
});

app.use((req, res, next) => {
  console.log(`Solicitud recibida para: ${req.url}`);
  next();
});

// Ruta para redirigir a AulaVirtual con un ID generado
app.get("/aulavirtual", (req, res) => {
  console.log("Se llamo al endpoint GET /aulavirtual con " + req)
  const roomId = uuidV4(); // Genera un ID único
  res.redirect(`/aulavirtual/${roomId}`);
});

// Ruta para servir la página de React
app.get("/aulavirtual/:roomId", (req, res) => {
  console.log("Se llamo al endpoint GET /aulavirtual/:roomId con " + req)
  res.sendFile(path.join(__dirname, "../client/build", "index.html"));
});

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

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

const PORT = process.env.PORT || 3001;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
