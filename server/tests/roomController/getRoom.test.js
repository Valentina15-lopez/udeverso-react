import request from 'supertest'; // Importar el módulo supertest
import {app} from '../../index.js'; // Importar la aplicación Express
import Salas from '../../src/models/Sala.js'; // Importar el modelo Salas
import HorariosSalas from '../../src/models/HorariosSalas.js'; // Importar el modelo HorariosSalas
import http from 'http'; // Importar el módulo http
import portfinder from "portfinder"; // Importar el módulo portfinder

describe('Endpoint GET /api/salas/:salaId', () => { // Grupo de pruebas para el endpoint GET /api/salas/:salaId
    let server; // Instancia del servidor

    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/salas/:salaId."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios
        await Salas.destroy({ where: {} });  // Limpiar salas
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }

        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios
        await Salas.destroy({ where: {} });  // Limpiar salas

    });

    it('Debe devolver una sala y sus horarios', async () => { // Prueba para obtener una sala y sus horarios
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

        const response = await request(app).get(`/api/salas/${sala.id}`); // Hacer la solicitud GET

        expect(response.status).toBe(200);  // Verificar estado de éxito
        expect(response.body.id).toBe(sala.id);  // Verificar que es la sala correcta
        expect(response.body.horarios.length).toBe(1);  // Debería tener un horario
    });

    it('Debe devolver 404 si la sala no existe', async () => { // Prueba para sala no encontrada
        // Intentar obtener una sala que no existe
        const response = await request(app).get('/api/salas/999'); // Asumimos que la sala 999 no existe

        expect(response.status).toBe(404);  // Verificar que es el estado correcto
        expect(response.body.message).toBe("Sala no encontrada");  // Mensaje esperado
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        // Simular un error interno
        jest.spyOn(Salas, 'findOne').mockImplementation(() => { // Espiar el método findOne
            throw new Error('Simulated error');  // Simular un error interno
        });

        const response = await request(app).get('/api/salas/1');  // Intentar obtener cualquier sala

        expect(response.status).toBe(500);  // Verificar error interno
        expect(response.body.message).toBe("Error al obtener datos de la sala");  // Mensaje esperado
    });
});
