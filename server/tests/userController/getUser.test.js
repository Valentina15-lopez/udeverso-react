import request from 'supertest';
import app from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint GET /api/users/:id', () => {
    let server;

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);
        await server.listen(3001);  // Iniciar el servidor en el puerto 3001
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

        try {
            await sequelize.close();  // Cerrar la conexión de Sequelize
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });

    it('Debe devolver el usuario correcto con estado 200', async () => {
        // Crear un usuario de prueba
        await Usuarios.create({
            usuario: 'usuario1',
            contrasenia: 'password1',
            nombre_para_mostrar: 'Usuario Uno',
            correo: 'usuario1@example.com',
            es_estudiante: true,
        });

        // Hacer una solicitud GET para obtener el usuario por ID
        const response = await request(app).get('/api/users/usuario1');  // Solicitud HTTP

        // Verificar que el estado es 200
        expect(response.status).toBe(200);

        // Verificar que el usuario devuelto es el correcto
        expect(response.body.usuario).toBe('usuario1');
        expect(response.body.nombre_para_mostrar).toBe('Usuario Uno');
    });

    it('Debe devolver 404 si el usuario no se encuentra', async () => {
        // Hacer una solicitud GET para obtener un usuario que no existe
        const response = await request(app).get('/api/users/usuarioDesconocido');  // Solicitud HTTP

        // Verificar que el estado es 404
        expect(response.status).toBe(404);

        // Verificar el mensaje de error
        expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        // Simular un error interno en el modelo Usuarios
        jest.spyOn(Usuarios, 'findOne').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        // Hacer una solicitud GET para obtener el usuario por ID
        const response = await request(app).get('/api/users/usuario1');  // Solicitud HTTP

        // Verificar que el estado es 500
        expect(response.status).toBe(500);

        // Verificar el mensaje de error
        expect(response.body.message).toBe('Error interno del servidor');
    });
});
