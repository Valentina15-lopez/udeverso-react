import request from 'supertest'; // Importar el módulo supertest
import {app} from '../../index.js';  // Importar la aplicación Express
import Salas from '../../src/models/Sala.js';  // Modelo de salas
import HorariosSalas from '../../src/models/HorariosSalas.js';  // Modelo de horarios
import http from 'http'; // Importar el módulo http
import portfinder from 'portfinder';  // Importar el módulo portfinder

describe('Endpoint POST /api/salas', () => { // Grupo de pruebas para el endpoint POST /api/salas
    let server; // Instancia del servidor

    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) {   // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        // Buscar un puerto disponible
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Encontrar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint POST /api/salas."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await HorariosSalas.destroy({ where: {} });  // Limpiar la tabla de horarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks antes de la limpieza

        try {
            if (server && server.listening) { // Si el servidor está corriendo
                await server.close();  // Cerrar el servidor
            }
        } catch (error) {
            console.error('Error al cerrar el servidor:', error); // Mostrar un mensaje de error si falla
        }

        try {
            await HorariosSalas.destroy({ where: {} });  // Limpiar horarios antes de salas
            await Salas.destroy({ where: {} });  // Limpiar salas después de horarios
        } catch (error) {
            console.error('Error al limpiar datos:', error); // Mostrar un mensaje de error si falla
        }

        //console.log('afterEach completed'); // Comprobar si todo está listo al final
    });


    it('Debe agregar una sala y sus horarios exitosamente', async () => { // Prueba para agregar una sala y horarios
        const salaData = { // Datos de la sala
            descripcion: 'Sala de pruebas', // Descripción de la sala
            horarios: [ // Horarios de la sala
                { dia_semana: 1, hora_inicio: '08:00', hora_fin: '10:00' }, // Horario 1
                { dia_semana: 2, hora_inicio: '10:00', hora_fin: '12:00' }, // Horario 2
            ],
        };

        const response = await request(app)  // Hacer la solicitud POST
            .post('/api/salas') // a la ruta /api/salas
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

    it('Debe devolver 400 si horarios no es un array', async () => { // Prueba para horarios no es un array
        const salaData = { // Datos de la sala
            descripcion: 'Sala de pruebas', // Descripción de la sala
            horarios: 'no es un array', // Horarios no es un array
        };

        const response = await request(app) // Hacer la solicitud POST
            .post('/api/salas') // a la ruta /api/salas
            .send(salaData); // Enviar datos de la sala

        expect(response.status).toBe(400); // Debería devolver un estado 400
        expect(response.body.message).toBe("El formato de horarios debe ser un array."); // Mensaje esperado
    });

    it('Debe devolver 400 si los tipos de datos son incorrectos', async () => { // Prueba para tipos de datos incorrectos
        const salaData = { // Datos de la sala
            descripcion: 'Sala de pruebas', // Descripción de la sala
            horarios: [ // Horarios de la sala
                { dia_semana: 'no es un número', hora_inicio: '08:00', hora_fin: '10:00' }, // Día no es un número
                { dia_semana: 2, hora_inicio: 123, hora_fin: '12:00' }, // Hora de inicio no es una cadena
                { dia_semana: 3, hora_inicio: '14:00', hora_fin: true }, // Hora de fin no es una cadena
            ],
        };

        const response = await request(app) // Hacer la solicitud POST
            .post('/api/salas') // a la ruta /api/salas
            .send(salaData); // Enviar datos de la sala

        expect(response.status).toBe(400); // Debería devolver un estado 400
        expect(response.body.message).toBe("Horarios mal formateados."); // Mensaje esperado
    });

    it('Debe manejar un error y devolver estado 500', async () => { // Prueba para manejar un error
        jest.spyOn(Salas, 'create').mockImplementation(() => { // Espiar la función create de Salas
            throw new Error('Simulated error');  // Simular un error en la creación de la sala
        });

        const salaData = { // Datos de la sala
            descripcion: 'Sala de prueba con error', // Descripción de la sala
            horarios: [ // Horarios de la sala
                { dia_semana: 3, hora_inicio: '14:00', hora_fin: '16:00' }, // Horario 1
            ],
        };

        const response = await request(app)  // Hacer la solicitud POST
            .post('/api/salas') // a la ruta /api/salas
            .send(salaData);  // Enviar datos de la sala

        expect(response.status).toBe(500);  // Debería devolver un estado 500
        expect(response.body.message).toBe("Error al agregar sala y horarios");  // Mensaje esperado
    });
});
