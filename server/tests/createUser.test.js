// tests/createUser.test.js
import request from 'supertest';
import app from '../index.js';  // Importa tu aplicación Express
import Usuarios from '../src/models/Usuarios.js';  // Importa el modelo Usuarios
import http from 'http';

describe('Endpoint POST /api/users', () => {
    let server;  // Variable para el servidor Express

    beforeEach(async () => {
        server = http.createServer(app);  // Crear el servidor Express
        await server.listen(3001);  // Iniciar el servidor en el puerto 3001
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
    });

    afterEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        jest.restoreAllMocks();  // Restablecer todos los mocks
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
