import request from 'supertest';
import {app} from '../../index.js';
import Salas from '../../src/models/Sala.js';
import HorariosSalas from '../../src/models/HorariosSalas.js';
import http from 'http';
import portfinder from "portfinder";

describe('Endpoint PUT /api/salas/:salaId/horarios', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 });
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint PUT /api/salas/:salaId/horarios.");
        await server.listen(PORT);
        await HorariosSalas.destroy({ where: {} });  // Limpiar la tabla de horarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks antes de la limpieza
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor
        }
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios antes de salas
        await Salas.destroy({ where: {} });  // Limpiar salas después de limpiar horarios

    });

    it('Debe devolver 500 si hay un error interno al destruir horarios', async () => {
        jest.spyOn(HorariosSalas, 'destroy').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error
        });

        const sala = await Salas.create({ descripcion: 'Sala para Prueba de Error' });

        const response = await request(app)
            .put(`/api/salas/${sala.id}/horarios`)
            .send({ horarios: [] });

        expect(response.status).toBe(500);  // Verificar error interno
        expect(response.body.message).toBe("Error al modificar horarios.");  // Mensaje esperado
    });

    it('Debe actualizar horarios correctamente y devolver estado 200', async () => {
        const sala = await Salas.create({
            descripcion: 'Sala para Actualización de Horarios',
        });

        const horarios = [
            { dia_semana: 1, hora_inicio: '08:00', hora_fin: '10:00' },
            { dia_semana: 2, hora_inicio: '10:00', hora_fin: '12:00' },
        ];

        const response = await request(app)
            .put(`/api/salas/${sala.id}/horarios`)
            .send({ horarios });

        expect(response.status).toBe(200);  // Verificar éxito
        expect(response.text).toBe("Horarios modificados exitosamente.");  // Mensaje esperado

        const horariosActualizados = await HorariosSalas.findAll({
            where: { sala_id: sala.id },
        });

        expect(horariosActualizados.length).toBe(2);  // Verificar actualizaciones
    });

    it('Debe devolver 400 si horarios no es un array', async () => {
        const sala = await Salas.create({
            descripcion: 'Sala para Actualización de Horarios',
        });

        const horarios = 'no es un array';

        const response = await request(app)
            .put(`/api/salas/${sala.id}/horarios`)
            .send({ horarios });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("El formato de horarios debe ser un array.");
    });

    it('Debe devolver 400 si los tipos de datos son incorrectos', async () => {
        const sala = await Salas.create({
            descripcion: 'Sala para Actualización de Horarios',
        });

        const horarios = [
            { dia_semana: 'no es un número', hora_inicio: '08:00', hora_fin: '10:00' },
            { dia_semana: 2, hora_inicio: 123, hora_fin: '12:00' },
            { dia_semana: 3, hora_inicio: '14:00', hora_fin: true },
        ];

        const response = await request(app)
            .put(`/api/salas/${sala.id}/horarios`)
            .send({ horarios });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Horarios mal formateados.");
    });
});
