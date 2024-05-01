import request from 'supertest';
import {app} from '../../index.js';  // Tu aplicación Express
import UsuariosMateriales from '../../src/models/UsuariosMateriales.js';  // Modelo de materiales
import http from 'http';
import Usuarios from "../../src/models/Usuarios.js";
import portfinder from "portfinder";

describe('Endpoint GET /api/users/:usuario/material', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 });
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/users/:usuario/material.");
        await server.listen(PORT);

        await UsuariosMateriales.destroy({ where: {} });  // Limpiar la tabla de materiales
        await Usuarios.destroy({ where: {} });
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor
        }

        try {
            await UsuariosMateriales.destroy({ where: {} });  // Limpiar la tabla de materiales
            await Usuarios.destroy({ where: {} })
        } catch (error) {
            console.error('Error al limpiar datos:', error);
        }

    });

    it('Debe devolver todos los materiales de un usuario', async () => {
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' });
        // Crear materiales de prueba para un usuario
        await UsuariosMateriales.create({
            usuario: user.usuario,
            nombre: 'material1',
            ext: '.txt',
            material: Buffer.from('contenido 1'),
        });

        await UsuariosMateriales.create({
            usuario: user.usuario,
            nombre: 'material2',
            ext: '.pdf',
            material: Buffer.from('contenido 2'),
        });

        const response = await request(app)
            .get('/api/users/usuario1/material')  // Solicitud para obtener materiales
            .expect(200);  // Debería responder con estado 200

        expect(response.body.length).toBe(2);  // Debería devolver dos materiales
        expect(response.body[0].nombre).toBe('material1');  // Verificar nombre del material
        expect(response.body[1].nombre).toBe('material2');  // Verificar nombre del segundo material
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosMateriales, 'findAll').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app)
            .get('/api/users/usuario1/material')  // Solicitud para obtener materiales
            .expect(500);  // Debería responder con estado 500

        expect(response.body.message).toBe("Error al obtener materiales del usuario");  // Mensaje esperado
    });
});
