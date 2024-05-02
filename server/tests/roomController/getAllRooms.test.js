import request from 'supertest'; // Importar el módulo supertest
import {app} from '../../index.js'; // Importar la aplicación Express
import Salas from '../../src/models/Sala.js'; // Modelo de salas
import HorariosSalas from '../../src/models/HorariosSalas.js'; // Modelo de horarios
import http from 'http'; // Importar el módulo http
import portfinder from "portfinder"; // Importar el módulo portfinder

describe('Endpoint GET /api/salas', () => { // Grupo de pruebas para el endpoint GET /api/salas
    let server; // Instancia del servidor

    // Configuración antes de cada prueba
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/salas."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios
        await Salas.destroy({ where: {} });  // Limpiar salas
    });

    // Limpieza después de cada prueba
    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }

        await HorariosSalas.destroy({ where: {} }); // Limpiar horarios
        await Salas.destroy({ where: {} }); // Limpiar salas

    });

    it('Debe devolver todas las salas con sus horarios', async () => { // Prueba para obtener todas las salas con horarios
        const sala = await Salas.create({ descripcion: 'Sala Test' }); // Crear una sala de prueba
        await HorariosSalas.create({ // Crear un horario asociado
            sala_id: sala.id,
            dia_semana: 1,
            hora_inicio: '08:00',
            hora_fin: '10:00',
        });

        const response = await request(app).get('/api/salas'); // Hacer la solicitud GET

        expect(response.status).toBe(200);  // Verificar estado de éxito
        expect(response.body.length).toBe(1);  // Debería haber una sala
        expect(response.body[0].horarios.length).toBe(1);  // Con un horario
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        jest.spyOn(Salas, 'findAll').mockImplementation(() => { // Espiar el método findAll
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app).get('/api/salas');  // Intentar obtener todas las salas

        expect(response.status).toBe(500);  // Verificar que se obtiene el error
        expect(response.body.message).toBe("Error al obtener salas");  // Mensaje esperado
    });
});
