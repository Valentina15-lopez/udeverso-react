import request from 'supertest';
import app from '../../index.js';
import Salas from '../../src/models/Sala.js';
import HorariosSalas from '../../src/models/HorariosSalas.js';
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint GET /api/salas/:salaId', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        await server.listen(3001);  // Iniciar el servidor
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios
        await Salas.destroy({ where: {} });  // Limpiar salas
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            console.log('Cerrando servidor...');
            await server.close();  // Cerrar el servidor
        }

        console.log('Limpiando datos...');
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios
        await Salas.destroy({ where: {} });  // Limpiar salas

        try {
            await sequelize.close();  // Cerrar la conexión de Sequelize
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });

    it('Debe devolver una sala y sus horarios', async () => {
        // Crear una sala de prueba y horarios asociados
        const sala = await Salas.create({
            descripcion: 'Sala de Prueba',
        });

        await HorariosSalas.create({
            sala_id: sala.id,
            dia_semana: 1,
            hora_inicio: '08:00',
            hora_fin: '10:00',
        });

        const response = await request(app).get(`/api/salas/${sala.id}`);

        expect(response.status).toBe(200);  // Verificar estado de éxito
        expect(response.body.id).toBe(sala.id);  // Verificar que es la sala correcta
        expect(response.body.horarios.length).toBe(1);  // Debería tener un horario
    });

    it('Debe devolver 404 si la sala no existe', async () => {
        // Intentar obtener una sala que no existe
        const response = await request(app).get('/api/salas/999');

        expect(response.status).toBe(404);  // Verificar que es el estado correcto
        expect(response.body.message).toBe("Sala no encontrada");  // Mensaje esperado
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        // Simular un error interno
        jest.spyOn(Salas, 'findOne').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular un error interno
        });

        const response = await request(app).get('/api/salas/1');  // Intentar obtener cualquier sala

        expect(response.status).toBe(500);  // Verificar error interno
        expect(response.body.message).toBe("Error al obtener datos de la sala");  // Mensaje esperado
    });
});
