import request from 'supertest';
import app from '../../index.js';
import UsuariosSalas from '../../src/models/UsuariosSalas.js';
import Salas from '../../src/models/Sala.js';
import Usuarios from '../../src/models/Usuarios.js';
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint DELETE /api/users/:userId/salas/:salaId', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);
        await server.listen(3001);
        await UsuariosSalas.destroy({ where: {} });
        await Salas.destroy({ where: {} });
        await Usuarios.destroy({ where: {} });
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor para liberar el puerto
        }
        try {
            await sequelize.close();  // Cerrar la conexión de Sequelize
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });

    it('Debe eliminar correctamente al usuario de la sala y devolver estado 200', async () => {
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' });
        const sala = await Salas.create({ descripcion: 'Sala de Prueba' });
        await UsuariosSalas.create({ user_id: user.usuario, sala_id: sala.id });

        const response = await request(app)
            .delete(`/api/users/${user.usuario}/salas/${sala.id}`)
            .expect(200);

        expect(response.text).toBe("Usuario eliminado de la sala.");  // Verificar mensaje
        const result = await UsuariosSalas.findOne({
            where: { user_id: user.usuario, sala_id: sala.id },
        });
        expect(result).toBeNull();  // Verificar que la relación fue eliminada
    });

    it('Debe devolver 404 si la relación entre usuario y sala no se encuentra', async () => {
        const response = await request(app)
            .delete(`/api/users/usuarioInexistente/salas/999`)
            .expect(404);

        expect(response.text).toBe("No se encontró la relación entre usuario y sala.");  // Mensaje esperado
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosSalas, 'destroy').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error
        });

        const response = await request(app)
            .delete(`/api/users/usuario1/salas/1`)
            .expect(500);

        expect(response.body.message).toBe("Error al eliminar usuario de la sala.");  // Verificar mensaje de error
    });
});
