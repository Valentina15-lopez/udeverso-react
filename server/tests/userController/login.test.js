// tests/login.test.js
import request from 'supertest';
import app from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';  // Importa el modelo de Usuarios
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import http from "http";
import sequelize from "../../src/config/database.js";

// Clave secreta para JWT (debe coincidir con la clave usada en tu aplicación)
const secretKey = 'miClaveSecreta';

describe('Endpoint POST /login', () => {
    let server;  // Variable para el servidor Express

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear un nuevo servidor
        await server.listen(3001);  // Iniciar el servidor
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restaurar todos los mocks
        if (server && server.listening) {
            console.log('Cerrando el servidor...');
            await server.close();  // Cerrar el servidor
        }

        console.log('Limpiando datos...');
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios

        try {
            await sequelize.close();  // Cerrar la conexión de Sequelize
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });

    it('Debe devolver 404 si el usuario no existe', async () => {
        const response = await request(app)
            .post('/login')
            .send({ nombreUsuario: 'usuarioInexistente', contrasena: 'password' });

        expect(response.status).toBe(404);
        expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('Debe devolver 401 si la contraseña es incorrecta', async () => {
        // Crear un usuario con una contraseña cifrada
        const hashedPassword = await bcrypt.hash('password123', 10);
        await Usuarios.create({ usuario: 'usuarioTest', contrasenia: hashedPassword });

        const response = await request(app)
            .post('/login')
            .send({ nombreUsuario: 'usuarioTest', contrasena: 'wrongPassword' });

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Contraseña incorrecta');
    });

    it('Debe devolver 200 y un token JWT si la autenticación es exitosa', async () => {
        // Crear un usuario con una contraseña cifrada
        const hashedPassword = await bcrypt.hash('password123', 10);
        await Usuarios.create({ usuario: 'usuarioTest', contrasenia: hashedPassword });

        const response = await request(app)
            .post('/login')
            .send({ nombreUsuario: 'usuarioTest', contrasena: 'password123' });

        expect(response.status).toBe(200);
        expect(response.body.usuario.usuario).toBe('usuarioTest');
        expect(response.body.token).toBeDefined();  // El token JWT debe estar definido

        // Verificar que el token JWT es válido
        const decoded = jwt.verify(response.body.token, secretKey);
        expect(decoded.userId).toBe('usuarioTest');
    });
});
