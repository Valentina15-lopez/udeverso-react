// tests/createUser.test.js
import request from 'supertest';
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';  // Importa el modelo Usuarios
import http from 'http';
import portfinder from "portfinder";

describe('Endpoint POST /api/users', () => {
    let server;  // Variable para el servidor Express

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 });
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint POST /api/users.");
        await server.listen(PORT);
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

    });

    it('Debe crear un usuario exitosamente', async () => {
        const response = await request(app)
            .post('/api/users')  // Endpoint para crear usuarios
            .send({
                usuario: 'nuevoUsuario',
                contrasenia: 'password123',
                nombre_para_mostrar: 'Nuevo Usuario',
                avatar_id: 'avatar1',
                correo: 'nuevo@ejemplo.com',
                es_estudiante: true,
            });

        expect(response.status).toBe(201);  // Verifica que el estado sea 201
        expect(response.body.usuario).toBe('nuevoUsuario');  // Verifica el campo usuario
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        // Simula un error interno en el modelo Usuarios
        jest.spyOn(Usuarios, 'create').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        const response = await request(app)
            .post('/api/users')  // Endpoint para crear usuarios
            .send({
                usuario: 'nuevoUsuario',
                contrasenia: 'password123',
                nombre_para_mostrar: 'Nuevo Usuario',
                avatar_id: 'avatar1',
                correo: 'nuevo@ejemplo.com',
                es_estudiante: true,
            });

        expect(response.status).toBe(500);  // Verifica el estado de error
        expect(response.body.message).toBe('Error interno del servidor');  // Mensaje de error
    });
});
