import request from 'supertest';
import app from '../../index.js';  // Importar la aplicación Express
import Salas from '../../src/models/Sala.js';  // Modelo de salas
import HorariosSalas from '../../src/models/HorariosSalas.js';  // Modelo de horarios
import http from 'http';
import sequelize from "../../src/config/database.js";

describe('Endpoint POST /api/salas', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        await server.listen(3001);  // Iniciar el servidor en el puerto 3001
        await HorariosSalas.destroy({ where: {} });  // Limpiar la tabla de horarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks

        if (server && server.listening) {
            try {
                console.log('Cerrando servidor...');
                await server.close();  // Cerrar el servidor
                console.log('Servidor cerrado.');
            } catch (error) {
                console.error('Error al cerrar el servidor:', error);
            }
        }

        console.log('Limpiando datos...');
        try {
            await HorariosSalas.destroy({ where: {} });  // Limpiar horarios antes de salas
            await Salas.destroy({ where: {} });  // Limpiar salas después de horarios
        } catch (error) {
            console.error('Error al limpiar datos:', error);
        }

        try {
            console.log('Cerrando conexión de Sequelize...');
            await sequelize.close();  // Cerrar la conexión de Sequelize
            console.log('Conexión de Sequelize cerrada.');
        } catch (error) {
            console.error('Error al cerrar Sequelize:', error);
        }
    });


    it('Debe agregar una sala y sus horarios exitosamente', async () => {
        const salaData = {
            descripcion: 'Sala de pruebas',
            horarios: [
                { dia_semana: 1, hora_inicio: '08:00', hora_fin: '10:00' },
                { dia_semana: 2, hora_inicio: '10:00', hora_fin: '12:00' },
            ],
        };

        const response = await request(app)  // Hacer la solicitud POST
            .post('/api/salas')
            .send(salaData);  // Enviar datos de la sala

        expect(response.status).toBe(201);  // Verificar que el estado es 201
        expect(response.text).toBe("Sala y horarios agregados exitosamente");  // Mensaje esperado

        // Verificar que la sala fue creada
        const salaCreada = await Salas.findOne({
            where: { descripcion: 'Sala de pruebas' },
        });
        expect(salaCreada).not.toBeNull();  // La sala debería existir

        // Verificar que los horarios fueron creados
        const horarios = await HorariosSalas.findAll({
            where: { sala_id: salaCreada.id },
        });
        expect(horarios.length).toBe(2);  // Debería haber dos horarios
    });

    it('Debe manejar un error y devolver estado 500', async () => {
        jest.spyOn(Salas, 'create').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular un error en la creación de la sala
        });

        const salaData = {
            descripcion: 'Sala de prueba con error',
            horarios: [
                { dia_semana: 3, hora_inicio: '14:00', hora_fin: '16:00' },
            ],
        };

        const response = await request(app)  // Hacer la solicitud POST
            .post('/api/salas')
            .send(salaData);  // Enviar datos de la sala

        expect(response.status).toBe(500);  // Debería devolver un estado 500
        expect(response.body.message).toBe("Error al agregar sala y horarios");  // Mensaje esperado
    });
});
