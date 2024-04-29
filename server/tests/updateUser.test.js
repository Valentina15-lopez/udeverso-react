import request from 'supertest';
import app from '../index.js';  // Importa tu aplicación Express
import Usuarios from '../src/models/Usuarios.js';
import http from 'http';

describe('Endpoint PUT /api/users/:usuario', () => {
    let server;

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => {
        server = http.createServer(app);
        await server.listen(3001);  // Iniciar el servidor en el puerto 3001
    });

    // Cerrar el servidor después de cada prueba
    afterEach(async () => {
        if (server) {
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba
    });

    it('Debe actualizar el usuario y devolverlo con estado 200', async () => {
        // Crear un usuario de prueba
        const usuario = await Usuarios.create({
            usuario: 'usuario1',
            contrasenia: 'password1',
            nombre_para_mostrar: 'Usuario Uno',
            correo: 'usuario1@example.com',
            es_estudiante: true,
        });

        // Hacer una solicitud PUT para actualizar el usuario
        const response = await request(app)
            .put(`/api/users/${usuario.usuario}`)  // Endpoint para actualizar
            .send({
                nombre_para_mostrar: 'Usuario Actualizado',
                es_estudiante: false,
            });

        expect(response.status).toBe(200);  // Verificar que el estado es 200
        expect(response.body.nombre_para_mostrar).toBe('Usuario Actualizado');  // Verificar actualización
        expect(response.body.es_estudiante).toBe(false);  // Verificar campo booleano
    });

    it('Debe devolver 404 si el usuario no se encuentra', async () => {
        // Hacer una solicitud PUT para actualizar un usuario que no existe
        const response = await request(app)
            .put('/api/users/usuarioInexistente')  // Endpoint para actualización
            .send({
                nombre_para_mostrar: 'Usuario Inexistente',
            });

        expect(response.status).toBe(404);  // Verificar que el estado es 404
        expect(response.body.message).toBe('Usuario no encontrado');  // Mensaje de error
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        // Simular un error para comprobar el manejo de errores
        jest.spyOn(Usuarios, 'update').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        const response = await request(app)
            .put('/api/users/usuario1')  // Endpoint para actualización
            .send({
                nombre_para_mostrar: 'Usuario Error',
            });

        expect(response.status).toBe(500);  // Verificar estado 500
        expect(response.body.message).toBe('Error interno del servidor');  // Mensaje de error
    });

    it('Debe devolver 400 si no hay campos para actualizar', async () => {
        const response = await request(app)
            .put('/api/users/usuario1')  // Endpoint para actualización
            .send({});  // No enviar campos para actualización

        expect(response.status).toBe(400);  // Verificar estado 400
        expect(response.body.message).toBe('Nada para actualizar');  // Mensaje de error
    });
});
