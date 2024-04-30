import request from 'supertest';
import app from '../../index.js';  // Tu aplicación Express
import Salas from '../../src/models/Sala.js';  // Modelo de Salas
import Usuarios from '../../src/models/Usuarios.js';  // Modelo de Usuarios
import UsuariosSalas from '../../src/models/UsuariosSalas.js';  // Relación Usuario-Salas
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint GET /api/salas/:salaId/usuarios', () => {
    let server;

    // Configuración inicial antes de cada prueba
    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);
        await server.listen(3001);  // Iniciar el servidor
        await UsuariosSalas.destroy({ where: {} });  // Limpiar las tablas para un estado limpio
        await Salas.destroy({ where: {} });
        await Usuarios.destroy({ where: {} });
    });

    // Cerrar el servidor y limpiar datos después de cada prueba
    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor para liberar el puerto
        }

        // Limpiar la base de datos
        await UsuariosSalas.destroy({ where: {} });
        await Salas.destroy({ where: {} });
        await Usuarios.destroy({ where: {} });

        try {
            await sequelize.close();  // Cerrar la conexión de Sequelize
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });

    it('Debe devolver los usuarios asociados a una sala', async () => {
        const sala = await Salas.create({ descripcion: 'Sala de Prueba' });
        const usuario = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' });

        await UsuariosSalas.create({ sala_id: sala.id, user_id: usuario.usuario });

        const response = await request(app)
            .get(`/api/salas/${sala.id}/users`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(1);  // Debería tener un usuario
        expect(response.body[0].usuario).toBe('usuario1');  // Verificar el nombre del usuario
    });

    it('Debe devolver un array vacío si no hay usuarios asociados a la sala', async () => {
        const sala = await Salas.create({ descripcion: 'Sala Vacía' });

        const response = await request(app)
            .get(`/api/salas/${sala.id}/users`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(0);  // No debería tener usuarios
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosSalas, 'findAll').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular un error
        });

        const response = await request(app)
            .get('/api/salas/1/users')
            .expect(500);

        expect(response.body.message).toBe("Error al obtener usuarios de la sala.");  // Mensaje de error esperado
    });
});
