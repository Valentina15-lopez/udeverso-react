// tests/login.test.js
import request from 'supertest';// Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';  // Importa el modelo de Usuarios
import bcrypt from 'bcrypt'; // Importa el módulo bcrypt
import jwt from 'jsonwebtoken'; // Importa el módulo jsonwebtoken
import http from "http"; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

// Clave secreta para JWT (debe coincidir con la clave usada en tu aplicación)
const secretKey = 'miClaveSecreta';

describe('Endpoint POST /login', () => { // Grupo de pruebas para el endpoint POST /login
    let server;  // Variable para el servidor Express

    beforeEach(async () => { // Configurar el servidor antes de las pruebas
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear un nuevo servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint POST /login."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restaurar todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            //console.log('Cerrando el servidor...');
            await server.close();  // Cerrar el servidor
        }

        //console.log('Limpiando datos...');
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios

    });

    it('Debe devolver 404 si el usuario no existe', async () => { // Prueba para un usuario inexistente
        const response = await request(app) // Hacer una solicitud POST
            .post('/login') // Hacer una solicitud POST a /login
            .send({ nombreUsuario: 'usuarioInexistente', contrasena: 'password' }); // Enviar datos de usuario

        expect(response.status).toBe(404); // Esperar estado 404
        expect(response.body.message).toBe('Usuario no encontrado'); // Verificar mensaje de error
    });

    it('Debe devolver 401 si la contraseña es incorrecta', async () => { // Prueba para contraseña incorrecta
        // Crear un usuario con una contraseña cifrada
        const hashedPassword = await bcrypt.hash('password123', 10); // Cifrar la contraseña
        await Usuarios.create({ usuario: 'usuarioTest', contrasenia: hashedPassword }); // Crear el usuario

        const response = await request(app) // Hacer una solicitud POST
            .post('/login') // Hacer una solicitud POST a /login
            .send({ nombreUsuario: 'usuarioTest', contrasena: 'wrongPassword' }); // Enviar datos de usuario

        expect(response.status).toBe(401); // Esperar estado 401
        expect(response.body.message).toBe('Contraseña incorrecta'); // Verificar mensaje de error
    });

    it('Debe devolver 200 y un token JWT si la autenticación es exitosa', async () => { // Prueba para autenticación exitosa
        // Crear un usuario con una contraseña cifrada
        const hashedPassword = await bcrypt.hash('password123', 10); // Cifrar la contraseña
        await Usuarios.create({ usuario: 'usuarioTest', contrasenia: hashedPassword }); // Crear el usuario

        const response = await request(app) // Hacer una solicitud POST
            .post('/login') // Hacer una solicitud POST a /login
            .send({ nombreUsuario: 'usuarioTest', contrasena: 'password123' }); // Enviar datos de usuario

        expect(response.status).toBe(200); // Esperar estado 200
        expect(response.body.usuario.usuario).toBe('usuarioTest'); // Verificar el nombre de usuario
        expect(response.body.token).toBeDefined();  // El token JWT debe estar definido

        // Verificar que el token JWT es válido
        const decoded = jwt.verify(response.body.token, secretKey); // Decodificar el token
        expect(decoded.userId).toBe('usuarioTest'); // Verificar el ID del usuario
    });

    it('Debe devolver 500 si ocurre un error interno', async () => { // Prueba para error interno
        // Simular un error interno al buscar un usuario
        jest.spyOn(Usuarios, 'findOne').mockImplementation(() => { // Espiar el método findOne
            throw new Error('Simulated database error');  // Simular un error de base de datos
        });

        const response = await request(app)  // Hacer una solicitud POST
            .post('/login')  // Hacer una solicitud POST a /login
            .send({ nombreUsuario: 'usuarioTest', contrasena: 'password123' });  // Enviar datos de usuario

        expect(response.status).toBe(500);  // Esperar estado 500
        expect(response.body.message).toBe("Error interno del servidor");  // Mensaje esperado
    });
});
