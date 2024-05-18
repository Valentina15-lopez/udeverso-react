import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Salas from '../../src/models/Sala.js';  // Modelo de Salas
import Usuarios from '../../src/models/Usuarios.js';  // Modelo de Usuarios
import UsuariosSalas from '../../src/models/UsuariosSalas.js';  // Relación Usuario-Salas
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint GET /api/salas/:salaId/usuarios', () => { // Grupo de pruebas para el endpoint GET /api/salas/:salaId/usuarios
    let server; // Variable para el servidor Express

    // Configuración inicial antes de cada prueba
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/salas/:salaId/usuarios."); //
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await UsuariosSalas.destroy({ where: {} });  // Limpiar las tablas para un estado limpio
        await Salas.destroy({ where: {} }); // Limpiar las tablas para un estado limpio
        await Usuarios.destroy({ where: {} }); // Limpiar las tablas para un estado limpio
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor para liberar el puerto
        }

        // Limpiar la base de datos
        await UsuariosSalas.destroy({ where: {} }); // Limpiar la tabla de usuarios-salas
        await Salas.destroy({ where: {} }); // Limpiar la tabla de salas
        await Usuarios.destroy({ where: {} }); // Limpiar la tabla de usuarios

    });

    it('Debe devolver los usuarios asociados a una sala', async () => { // Prueba para obtener los usuarios asociados a una sala
        const sala = await Salas.create({ descripcion: 'Sala de Prueba' }); // Crear una sala
        const usuario = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' }); // Crear un usuario

        await UsuariosSalas.create({ sala_id: sala.id, user_id: usuario.usuario }); // Crear la relación

        const response = await request(app) // Hacer una solicitud GET
            .get(`/api/salas/${sala.id}/users`) // Endpoint para obtener usuarios de la sala
            .expect(200); // Esperar estado 200

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(1);  // Debería tener un usuario
        expect(response.body[0].usuario).toBe('usuario1');  // Verificar el nombre del usuario
    });

    it('Debe devolver un array vacío si no hay usuarios asociados a la sala', async () => { // Prueba para sala vacía
        const sala = await Salas.create({ descripcion: 'Sala Vacía' }); // Crear una sala

        const response = await request(app) // Hacer una solicitud GET
            .get(`/api/salas/${sala.id}/users`) // Endpoint para obtener usuarios de la sala
            .expect(200); // Esperar estado 200

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(0);  // No debería tener usuarios
    });

    it('Debe devolver 500 si ocurre un error interno', async () => { // Prueba para error interno
        jest.spyOn(UsuariosSalas, 'findAll').mockImplementation(() => { // Espiar el método findAll
            throw new Error('Simulated error');  // Simular un error
        });

        const response = await request(app) // Hacer una solicitud GET
            .get('/api/salas/1/users') // Endpoint para obtener usuarios de la sala
            .expect(500); // Esperar estado 500

        expect(response.body.message).toBe("Error al obtener usuarios de la sala.");  // Mensaje de error esperado
    });
});
