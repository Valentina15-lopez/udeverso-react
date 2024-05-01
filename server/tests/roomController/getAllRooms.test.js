import request from 'supertest';
import {app} from '../../index.js';
import Salas from '../../src/models/Sala.js';
import HorariosSalas from '../../src/models/HorariosSalas.js';
import http from 'http';
import portfinder from "portfinder";

describe('Endpoint GET /api/salas', () => {
    let server;

    // Configuración antes de cada prueba
    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 });
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/salas.");
        await server.listen(PORT);
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios
        await Salas.destroy({ where: {} });  // Limpiar salas
    });

    // Limpieza después de cada prueba
    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor
        }

        await HorariosSalas.destroy({ where: {} });
        await Salas.destroy({ where: {} });

    });

    it('Debe devolver todas las salas con sus horarios', async () => {
        const sala = await Salas.create({ descripcion: 'Sala Test' });
        await HorariosSalas.create({
            sala_id: sala.id,
            dia_semana: 1,
            hora_inicio: '08:00',
            hora_fin: '10:00',
        });

        const response = await request(app).get('/api/salas');

        expect(response.status).toBe(200);  // Verificar estado de éxito
        expect(response.body.length).toBe(1);  // Debería haber una sala
        expect(response.body[0].horarios.length).toBe(1);  // Con un horario
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        jest.spyOn(Salas, 'findAll').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app).get('/api/salas');  // Intentar obtener todas las salas

        expect(response.status).toBe(500);  // Verificar que se obtiene el error
        expect(response.body.message).toBe("Error al obtener salas");  // Mensaje esperado
    });
});
