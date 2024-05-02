import request from 'supertest'; // Importar el módulo supertest
import {app} from '../../index.js'; // Importar la aplicación Express
import Salas from '../../src/models/Sala.js'; // Modelo de salas
import HorariosSalas from '../../src/models/HorariosSalas.js'; // Modelo de horarios
import http from 'http'; // Importar el módulo http
import portfinder from "portfinder"; // Importar el módulo portfinder

describe('Endpoint PUT /api/salas/:salaId/horarios', () => { // Grupo de pruebas para el endpoint PUT /api/salas/:salaId/horarios
    let server; // Instancia del servidor

    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint PUT /api/salas/:salaId/horarios.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await HorariosSalas.destroy({ where: {} });  // Limpiar la tabla de horarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks antes de la limpieza
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios antes de salas
        await Salas.destroy({ where: {} });  // Limpiar salas después de limpiar horarios

    });

    it('Debe devolver 500 si hay un error interno al destruir horarios', async () => { // Prueba para error interno
        jest.spyOn(HorariosSalas, 'destroy').mockImplementation(() => { // Espiar el método destroy
            throw new Error('Simulated error');  // Simular error
        });

        const sala = await Salas.create({ descripcion: 'Sala para Prueba de Error' }); // Crear una sala de prueba

        const response = await request(app) // Hacer la solicitud PUT
            .put(`/api/salas/${sala.id}/horarios`) // a la ruta /api/salas/:salaId/horarios
            .send({ horarios: [] }); // Enviar datos vacíos

        expect(response.status).toBe(500);  // Verificar error interno
        expect(response.body.message).toBe("Error al modificar horarios.");  // Mensaje esperado
    });

    it('Debe actualizar horarios correctamente y devolver estado 200', async () => { // Prueba para actualizar horarios
        const sala = await Salas.create({ // Crear una sala de prueba
            descripcion: 'Sala para Actualización de Horarios', // Descripción de la sala
        });

        const horarios = [ // Horarios a actualizar
            { dia_semana: 1, hora_inicio: '08:00', hora_fin: '10:00' }, // Horario 1
            { dia_semana: 2, hora_inicio: '10:00', hora_fin: '12:00' }, // Horario 2
        ];

        const response = await request(app) // Hacer la solicitud PUT
            .put(`/api/salas/${sala.id}/horarios`) // a la ruta /api/salas/:salaId/horarios
            .send({ horarios }); // Enviar los horarios

        expect(response.status).toBe(200);  // Verificar éxito
        expect(response.text).toBe("Horarios modificados exitosamente.");  // Mensaje esperado

        const horariosActualizados = await HorariosSalas.findAll({ // Buscar horarios actualizados
            where: { sala_id: sala.id },
        });

        expect(horariosActualizados.length).toBe(2);  // Verificar actualizaciones
    });

    it('Debe devolver 400 si horarios no es un array', async () => { // Prueba para formato incorrecto
        const sala = await Salas.create({ // Crear una sala de prueba
            descripcion: 'Sala para Actualización de Horarios',
        });

        const horarios = 'no es un array'; // Horarios no es un array

        const response = await request(app) // Hacer la solicitud PUT
            .put(`/api/salas/${sala.id}/horarios`) // a la ruta /api/salas/:salaId/horarios
            .send({ horarios }); // Enviar datos incorrectos

        expect(response.status).toBe(400); // Verificar error
        expect(response.body.message).toBe("El formato de horarios debe ser un array."); // Mensaje esperado
    });

    it('Debe devolver 400 si los tipos de datos son incorrectos', async () => { // Prueba para tipos de datos incorrectos
        const sala = await Salas.create({ // Crear una sala de prueba
            descripcion: 'Sala para Actualización de Horarios',
        });

        const horarios = [ // Horarios con tipos incorrectos
            { dia_semana: 'no es un número', hora_inicio: '08:00', hora_fin: '10:00' },
            { dia_semana: 2, hora_inicio: 123, hora_fin: '12:00' },
            { dia_semana: 3, hora_inicio: '14:00', hora_fin: true },
        ];

        const response = await request(app) // Hacer la solicitud PUT
            .put(`/api/salas/${sala.id}/horarios`) // a la ruta /api/salas/:salaId/horarios
            .send({ horarios }); // Enviar datos incorrectos

        expect(response.status).toBe(400); // Verificar error
        expect(response.body.message).toBe("Horarios mal formateados."); // Mensaje esperado
    });
});
