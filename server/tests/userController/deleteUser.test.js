import request from 'supertest';
import app from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';
import http from 'http';

describe('Endpoint DELETE /api/users/:usuario', () => {
    let server;

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => {
        server = http.createServer(app);
        await server.listen(3001);  // Iniciar el servidor en el puerto 3001
    });

    afterEach(async () => {
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) {
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba
    });

    it('Debe eliminar el usuario y devolver estado 200', async () => {
        // Crear un usuario de prueba para eliminar
        const usuario = await Usuarios.create({
            usuario: 'usuario1',
            contrasenia: 'password1',
            nombre_para_mostrar: 'Usuario Uno',
            correo: 'usuario1@example.com',
            es_estudiante: true,
        });

        // Hacer una solicitud DELETE para eliminar el usuario
        const response = await request(app).delete(`/api/users/${usuario.usuario}`);  // Solicitud HTTP

        expect(response.status).toBe(200);  // Verificar que el estado es 200
        expect(response.text).toBe("Usuario borrado con éxito");  // Verificar el mensaje de respuesta

        // Verificar que el usuario realmente fue eliminado
        const checkUser = await Usuarios.findOne({
            where: { usuario: 'usuario1' },
        });

        expect(checkUser).toBeNull();  // El usuario no debería existir más
    });

    it('Debe devolver 404 si el usuario no se encuentra', async () => {
        // Hacer una solicitud DELETE para eliminar un usuario que no existe
        const response = await request(app).delete('/api/users/usuarioInexistente');  // Solicitud HTTP

        expect(response.status).toBe(404);  // Verificar que el estado es 404
        expect(response.body.message).toBe("Usuario no encontrado");  // Mensaje de error
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        // Simular un error interno para verificar el manejo de errores
        jest.spyOn(Usuarios, 'destroy').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        // Hacer una solicitud DELETE para eliminar un usuario
        const response = await request(app).delete('/api/users/usuario1');  // Solicitud HTTP

        expect(response.status).toBe(500);  // Verificar que el estado es 500
        expect(response.body.message).toBe("Error interno del servidor");  // Mensaje de error
    });
});
