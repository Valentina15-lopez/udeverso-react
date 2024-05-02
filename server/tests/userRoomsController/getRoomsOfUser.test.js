import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Salas from '../../src/models/Sala.js';  // Modelo de Salas
import UsuariosSalas from '../../src/models/UsuariosSalas.js';  // Relación Usuario-Salas
import Usuarios from '../../src/models/Usuarios.js';  // Modelo de Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint GET /api/users/:userId/salas', () => { // Grupo de pruebas para el endpoint GET /api/users/:userId/salas
    let server; // Variable para el servidor Express

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/users/:userId/salas.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await UsuariosSalas.destroy({ where: {} }); // Limpiar la tabla de usuarios-salas
        await Salas.destroy({ where: {} }); // Limpiar la tabla de salas
        await Usuarios.destroy({ where: {} }); // Limpiar la tabla de usuarios
    });

    // Cerrar el servidor y limpiar después de cada prueba
    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor para liberar el puerto
        }
        await UsuariosSalas.destroy({ where: {} });
        await Salas.destroy({ where: {} });
        await Usuarios.destroy({ where: {} });

    });

    it('Debe devolver las salas asociadas al usuario', async () => {
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' });
        const sala = await Salas.create({ descripcion: 'Sala de Prueba' });

        await UsuariosSalas.create({ user_id: user.usuario, sala_id: sala.id });

        const response = await request(app)
            .get(`/api/users/${user.usuario}/salas`)
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(1);  // Debería tener una sala
        expect(response.body[0].descripcion).toBe('Sala de Prueba');  // Verificar la descripción de la sala
    });

    it('Debe devolver un array vacío si el usuario no tiene salas', async () => {
        const response = await request(app)
            .get('/api/users/usuarioSinSalas/salas')
            .expect(200);

        expect(Array.isArray(response.body)).toBe(true);  // Debería ser un array
        expect(response.body.length).toBe(0);  // No debería tener salas
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosSalas, 'findAll').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error
        });

        const response = await request(app)
            .get('/api/users/usuario1/salas')
            .expect(500);

        expect(response.body.message).toBe("Error al obtener salas del usuario.");  // Verificar mensaje de error
    });
});
