import request from 'supertest'; // Importar el módulo supertest
import {app} from '../../index.js'; // Importar la aplicación Express
import Salas from '../../src/models/Sala.js'; // Modelo de salas
import HorariosSalas from '../../src/models/HorariosSalas.js'; // Modelo de horarios
import http from 'http'; // Importar el módulo http
import portfinder from "portfinder"; // Importar el módulo portfinder

describe('Endpoint DELETE /api/salas/:salaId', () => { // Grupo de pruebas para el endpoint DELETE /api/salas/:salaId
    let server; // Instancia del servidor

    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }
        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint DELETE /api/salas/:salaId.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await HorariosSalas.destroy({ where: {} });  // Limpiar la tabla de horarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }

        await HorariosSalas.destroy({ where: {} });  // Limpiar horarios primero
        await Salas.destroy({ where: {} });  // Luego limpiar salas

    });

    it('Debe devolver 404 si la sala no se encuentra', async () => { // Prueba para sala no encontrada
        const response = await request(app) // Hacer la solicitud DELETE
            .delete('/api/salas/999')  // Asumimos que la sala 999 no existe
            .expect(404); // Esperamos un estado 404

        expect(response.body.message).toBe("Sala no encontrada");  // Verifica el mensaje de error
    });

    it('Debe eliminar la sala y sus horarios exitosamente', async () => { // Prueba para eliminar sala y horarios
        // Crear una sala de prueba con horarios asociados
        const sala = await Salas.create({ descripcion: 'Sala para Eliminar' }); // Crear la sala
        await HorariosSalas.create({ sala_id: sala.id, dia_semana: 1, hora_inicio: '08:00', hora_fin: '10:00' }); // Crear horario 1

        const response = await request(app) // Hacer la solicitud DELETE
            .delete(`/api/salas/${sala.id}`)  // Eliminar la sala
            .expect(200); // Esperamos un estado 200

        expect(response.body.message).toBe("Sala y horarios eliminados exitosamente");  // Verifica la respuesta

        // Verificar que la sala y sus horarios fueron eliminados
        const salaCheck = await Salas.findOne({ where: { id: sala.id } }); // Buscar la sala
        expect(salaCheck).toBeNull();  // Debería ser nulo porque fue eliminada la sala

        const horariosCheck = await HorariosSalas.findAll({ where: { sala_id: sala.id } }); // Buscar horarios asociados
        expect(horariosCheck.length).toBe(0);  // No debería haber horarios asociados
    });

    it('Debe devolver 500 si ocurre un error interno', async () => { // Prueba para error interno
        jest.spyOn(HorariosSalas, 'destroy').mockImplementation(() => { // Espiar el método destroy
            throw new Error('Simulated error');  // Simular error
        });

        const sala = await Salas.create({ descripcion: 'Sala para Error Interno' }); // Crear la sala

        const response = await request(app) // Hacer la solicitud DELETE
            .delete(`/api/salas/${sala.id}`)  // Intentar eliminar la sala
            .expect(500); // Esperamos un estado 500

        expect(response.body.message).toBe("Error al borrar la sala");  // Mensaje de error
    });
});
