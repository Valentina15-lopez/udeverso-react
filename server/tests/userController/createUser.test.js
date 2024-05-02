// tests/createUser.test.js
import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';  // Importa el modelo Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint POST /api/users', () => { // Grupo de pruebas para el endpoint POST /api/users
    let server;  // Variable para el servidor Express

    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint POST /api/users.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

    });

    it('Debe crear un usuario exitosamente', async () => { // Prueba para crear un usuario
        const response = await request(app) // Hacer la solicitud POST
            .post('/api/users')  // Endpoint para crear usuarios
            .send({
                usuario: 'nuevoUsuario',// Datos del usuario
                contrasenia: 'password123', // Contraseña
                nombre_para_mostrar: 'Nuevo Usuario', // Nombre para mostrar
                avatar_id: 'avatar1', // ID del avatar
                correo: 'nuevo@ejemplo.com', // Correo
                es_estudiante: true, // Es estudiante
            });

        expect(response.status).toBe(201);  // Verifica que el estado sea 201
        expect(response.body.usuario).toBe('nuevoUsuario');  // Verifica el campo usuario
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        // Simula un error interno en el modelo Usuarios
        jest.spyOn(Usuarios, 'create').mockImplementation(() => { // Espía el método create
            throw new Error('Simulated error'); // Simula un error
        });

        const response = await request(app) // Hacer la solicitud POST
            .post('/api/users')  // Endpoint para crear usuarios
            .send({
                usuario: 'nuevoUsuario', // Datos del usuario
                contrasenia: 'password123', // Contraseña
                nombre_para_mostrar: 'Nuevo Usuario', // Nombre para mostrar
                avatar_id: 'avatar1', // ID del avatar
                correo: 'nuevo@ejemplo.com', // Correo
                es_estudiante: true, // Es estudiante
            });

        expect(response.status).toBe(500);  // Verifica el estado de error
        expect(response.body.message).toBe('Error interno del servidor');  // Mensaje de error
    });
});
