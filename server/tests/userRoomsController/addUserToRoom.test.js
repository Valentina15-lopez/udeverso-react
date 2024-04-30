import request from 'supertest';
import app from '../../index.js';  // Tu aplicación Express
import Salas from '../../src/models/Sala.js';
import Usuarios from '../../src/models/Usuarios.js';
import UsuariosSalas from '../../src/models/UsuariosSalas.js';
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint POST /api/users/:userId/salas', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        await server.listen(3001);  // Iniciar el servidor
        await UsuariosSalas.destroy({ where: {} });  // Limpiar la tabla de usuarios-salas
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restaurar todos los mocks

        // Cerrar el servidor si está corriendo
        if (server && server.listening) {
            try {
                console.log('Cerrando servidor...');
                await server.close();
                console.log('Servidor cerrado.');
            } catch (error) {
                console.error('Error al cerrar el servidor:', error);
            }
        }

        // Limpiar datos
        console.log('Limpiando datos...');
        try {
            await UsuariosSalas.destroy({ where: {} });  // Limpiar usuarios-salas
            await Usuarios.destroy({ where: {} });  // Limpiar usuarios
            await Salas.destroy({ where: {} });  // Limpiar salas
        } catch (error) {
            console.error('Error al limpiar datos:', error);
        }

        // Cerrar la conexión de Sequelize
        try {
            console.log('Cerrando conexión de Sequelize...');
            await sequelize.close();
            console.log('Conexión de Sequelize cerrada.');
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });


    it('Debe asignar un usuario a las salas correctamente', async () => {
        // Crear un usuario y salas de prueba
        const usuario = await Usuarios.create({ usuario: 'user1', contrasenia: 'password1' });
        const sala1 = await Salas.create({ descripcion: 'Sala 1' });
        const sala2 = await Salas.create({ descripcion: 'Sala 2' });

        const response = await request(app)
            .post(`/api/users/${usuario.usuario}/salas`)
            .send({ salaIds: [sala1.id, sala2.id] });  // Enviar solicitud con los IDs de salas

        expect(response.status).toBe(201);  // Verificar éxito
        expect(response.text).toBe("Usuario asignado a las salas exitosamente.");  // Mensaje esperado

        // Verificar que el usuario se agregó a las salas correctas
        const userSala1 = await UsuariosSalas.findOne({
            where: { user_id: usuario.usuario, sala_id: sala1.id },
        });
        const userSala2 = await UsuariosSalas.findOne({
            where: { user_id: usuario.usuario, sala_id: sala2.id },
        });

        expect(userSala1).not.toBeNull();  // El usuario debería estar en sala 1
        expect(userSala2).not.toBeNull();  // El usuario debería estar en sala 2
    });

    it('Debe devolver 400 si salaIds no es un array', async () => {
        const response = await request(app)
            .post('/api/users/user1/salas')  // Solicitud con entrada incorrecta
            .send({ salaIds: 'not-an-array' });  // Valor incorrecto para salaIds

        expect(response.status).toBe(400);  // Debería devolver error de cliente
        expect(response.body.message).toBe("salaIds debe ser un array");  // Mensaje esperado
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosSalas, 'create').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular un error interno
        });

        const response = await request(app)
            .post('/api/users/user1/salas')
            .send({ salaIds: [1, 2, 3] });  // Solicitud normal

        expect(response.status).toBe(500);  // Verificar error interno
        expect(response.body.message).toBe("Error al asignar usuario a salas.");  // Mensaje esperado
    });
});
