import request from 'supertest';
import app from '../../index.js';  // Tu aplicación Express
import UsuariosMateriales from '../../src/models/UsuariosMateriales.js';  // Modelo de materiales
import http from 'http';
import sequelize from '../../src/config/database.js';
import Usuarios from "../../src/models/Usuarios.js";

describe('Endpoint DELETE /api/users/:usuario/material/:nombre', () => {
    let server;

    beforeEach(async () => {
        if (server && server.listening) {
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        await server.listen(3001);  // Iniciar el servidor
        await UsuariosMateriales.destroy({ where: {} });  // Limpiar materiales
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        try {
            if (server && server.listening) {
                console.log('Cerrando servidor...');
                await server.close();  // Cerrar el servidor
                console.log('Servidor cerrado.');
            }
        } catch (error) {
            console.error('Error al cerrar el servidor:', error);
        }

        try {
            console.log('Limpiando datos...');
            await UsuariosMateriales.destroy({ where: {} });  // Limpiar la tabla
        } catch (error) {
            console.error('Error al limpiar datos:', error);
        }

    });

    it('Debe eliminar el material de un usuario y devolver estado 200', async () => {
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' });
        // Crear un material de prueba para un usuario
        await UsuariosMateriales.create({
            usuario: user.usuario,
            nombre: 'material1',
            ext: '.txt',
            material: Buffer.from('contenido del material'),
        });

        const response = await request(app)
            .delete('/api/users/usuario1/material/material1')  // Solicitud para eliminar un material
            .expect(200);  // Debería responder con estado 200

        expect(response.text).toBe("Material borrado con éxito");  // Mensaje esperado

        // Verificar que el material realmente fue eliminado
        const material = await UsuariosMateriales.findOne({
            where: { usuario: 'usuario1', nombre: 'material1' },
        });

        expect(material).toBeNull();  // El material no debería existir más
    });

    it('Debe devolver 404 si el material no se encuentra', async () => {
        const response = await request(app)
            .delete('/api/users/usuario1/material/materialInexistente')  // Solicitud para eliminar un material inexistente
            .expect(404);  // Debería responder con estado 404

        expect(response.text).toBe("Material no encontrado");  // Mensaje esperado
    });

    it('Debe devolver 500 si ocurre un error interno', async () => {
        jest.spyOn(UsuariosMateriales, 'destroy').mockImplementation(() => {
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app)
            .delete('/api/users/usuario1/material/material1')  // Solicitud para eliminar
            .expect(500);  // Debería responder con estado 500

        expect(response.body.message).toBe("Error del servidor");  // Mensaje esperado
    });
});
