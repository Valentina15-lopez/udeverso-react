import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js'; // Importa el modelo Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint PUT /api/users/:usuario', () => { // Grupo de pruebas para el endpoint PUT /api/users/:usuario
    let server; // Variable para el servidor Express

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint PUT /api/users/:usuario.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

    });

    it('Debe actualizar el usuario y devolverlo con estado 200', async () => { // Prueba para actualizar un usuario
        // Crear un usuario de prueba
        const usuario = await Usuarios.create({
            usuario: 'usuario1',
            contrasenia: 'password1',
            nombre_para_mostrar: 'Usuario Uno',
            correo: 'usuario1@example.com',
            avatar_id: 'avatar1',
            rol: 'estudiante',
        });

        // Hacer una solicitud PUT para actualizar el usuario
        const response = await request(app) // Realizar la solicitud
            .put(`/api/users/${usuario.usuario}`)  // Endpoint para actualizar
            .send({
                nombre_para_mostrar: 'Usuario Actualizado',
                rol: 'profesor',
                avatar_id: 'avatar2',
            });

        expect(response.status).toBe(200);  // Verificar que el estado es 200
        expect(response.body.nombre_para_mostrar).toBe('Usuario Actualizado');  // Verificar actualización
        expect(response.body.rol).toBe('profesor');  // Verificar campo String
        expect(response.body.avatar_id).toBe('avatar2');  // Verificar campo de avatar
    });

    it('Debe devolver 404 si el usuario no se encuentra', async () => { // Prueba para usuario inexistente
        // Hacer una solicitud PUT para actualizar un usuario que no existe
        const response = await request(app) // Realizar la solicitud
            .put('/api/users/usuarioInexistente')  // Endpoint para actualización
            .send({
                nombre_para_mostrar: 'Usuario Inexistente',
            });

        expect(response.status).toBe(404);  // Verificar que el estado es 404
        expect(response.body.message).toBe('Usuario no encontrado');  // Mensaje de error
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        // Simular un error para comprobar el manejo de errores
        jest.spyOn(Usuarios, 'update').mockImplementation(() => { // Espiar el método update
            throw new Error('Simulated error'); // Simular un error interno
        });

        const response = await request(app) // Realizar la solicitud
            .put('/api/users/usuario1')  // Endpoint para actualización
            .send({
                nombre_para_mostrar: 'Usuario Error',
            });

        expect(response.status).toBe(500);  // Verificar estado 500
        expect(response.body.message).toBe('Error interno del servidor');  // Mensaje de error
    });

    it('Debe devolver 400 si no hay campos para actualizar', async () => { // Prueba para campos vacíos
        const response = await request(app) // Realizar la solicitud
            .put('/api/users/usuario1')  // Endpoint para actualización
            .send({});  // No enviar campos para actualización

        expect(response.status).toBe(400);  // Verificar estado 400
        expect(response.body.message).toBe('Nada para actualizar');  // Mensaje de error
    });
});
