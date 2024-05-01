import request from 'supertest';
import {app} from '../../index.js';  // Tu aplicación Express
import Salas from '../../src/models/Sala.js';  // Modelo de Salas
import UsuariosSalas from '../../src/models/UsuariosSalas.js';  // Relación Usuario-Salas
import Usuarios from '../../src/models/Usuarios.js';  // Modelo de Usuarios
import http from 'http';
import portfinder from "portfinder";

describe('Endpoint GET /api/users/:userId/salas', () => {
    let server;

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 });
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/users/:userId/salas.");
        await server.listen(PORT);
        await UsuariosSalas.destroy({ where: {} });
        await Salas.destroy({ where: {} });
        await Usuarios.destroy({ where: {} });
    });

    // Cerrar el servidor y limpiar después de cada prueba
    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor para liberar el puerto
        }
        await UsuariosSalas.destroy({ where: {} });
        await Salas.destroy({ where: {} });
        await Usuarios.destroy({ where: {} });

    });

    it('Debe devolver las salas asociadas al usuario', async () => {
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' });
        const sala = await Salas.create({ descripcion: 'Sala de Prueba' });

        await UsuariosSalas.create({ user_id: user.usuario, sala_id: sala.id });

        const response = await request(app)
            .get(`/api/users/${user.usuario}/salas`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(1);  // Debería tener una sala
        expect(response.body[0].descripcion).toBe('Sala de Prueba');  // Verificar la descripción de la sala
    });

    it('Debe devolver un array vacío si el usuario no tiene salas', async () => {
        const response = await request(app)
            .get('/api/users/usuarioSinSalas/salas')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(0);  // No debería tener salas
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosSalas, 'findAll').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error
        });

        const response = await request(app)
            .get('/api/users/usuario1/salas')
            .expect(500);

        expect(response.body.message).toBe("Error al obtener salas del usuario.");  // Verificar mensaje de error
    });
});
