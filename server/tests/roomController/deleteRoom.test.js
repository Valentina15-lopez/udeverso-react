import request from 'supertest';
import app from '../../index.js';
import Salas from '../../src/models/Sala.js';
import HorariosSalas from '../../src/models/HorariosSalas.js';
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint DELETE /api/salas/:salaId', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }
        server = http.createServer(app);  // Crear el servidor
        const PORT = 3001 + Math.floor(Math.random() * 100);  // Cambia el puerto para cada prueba
        await server.listen(PORT);
        await HorariosSalas.destroy({ where: {} });  // Limpiar la tabla de horarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor
        }

        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios primero
        await Salas.destroy({ where: {} });  // Luego limpiar salas

    });

    it('Debe devolver 404 si la sala no se encuentra', async () => {
        const response = await request(app)
            .delete('/api/salas/999')  // Asumimos que la sala 999 no existe
            .expect(404);

        expect(response.text).toBe("Sala no encontrada");  // Verifica el mensaje de error
    });

    it('Debe eliminar la sala y sus horarios exitosamente', async () => {
        // Crear una sala de prueba con horarios asociados
        const sala = await Salas.create({ descripcion: 'Sala para Eliminar' });
        await HorariosSalas.create({ sala_id: sala.id, dia_semana: 1, hora_inicio: '08:00', hora_fin: '10:00' });

        const response = await request(app)
            .delete(`/api/salas/${sala.id}`)  // Eliminar la sala
            .expect(200);

        expect(response.text).toBe("Sala y horarios eliminados exitosamente");  // Verifica la respuesta

        // Verificar que la sala y sus horarios fueron eliminados
        const salaCheck = await Salas.findOne({ where: { id: sala.id } });
        expect(salaCheck).toBeNull();  // Debería ser nulo porque fue eliminada

        const horariosCheck = await HorariosSalas.findAll({ where: { sala_id: sala.id } });
        expect(horariosCheck.length).toBe(0);  // No debería haber horarios asociados
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(HorariosSalas, 'destroy').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error
        });

        const sala = await Salas.create({ descripcion: 'Sala para Error Interno' });

        const response = await request(app)
            .delete(`/api/salas/${sala.id}`)  // Intentar eliminar la sala
            .expect(500);

        expect(response.body.message).toBe("Error al borrar la sala");  // Mensaje de error
    });
});
