import request from 'supertest';// Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js'; // Importa el modelo Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint GET /api/users/:id', () => { // Grupo de pruebas para el endpoint GET /api/users/:id
    let server; // Variable para el servidor Express

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/users/:id."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

    });

    it('Debe devolver el usuario correcto con estado 200', async () => { // Prueba para obtener un usuario por ID
        // Crear un usuario de prueba
        await Usuarios.create({
            usuario: 'usuario1',
            contrasenia: 'password1',
            nombre_para_mostrar: 'Usuario Uno',
            correo: 'usuario1@example.com',
            rol: 'alumno',
        });

        // Hacer una solicitud GET para obtener el usuario por ID
        const response = await request(app).get('/api/users/usuario1');  // Solicitud HTTP

        // Verificar que el estado es 200
        expect(response.status).toBe(200);

        // Verificar que el usuario devuelto es el correcto
        expect(response.body.usuario).toBe('usuario1');
        expect(response.body.nombre_para_mostrar).toBe('Usuario Uno');
        expect(response.body.rol).toBe('alumno');
    });

    it('Debe devolver 404 si el usuario no se encuentra', async () => { // Prueba para obtener un usuario que no existe
        // Hacer una solicitud GET para obtener un usuario que no existe
        const response = await request(app).get('/api/users/usuarioDesconocido');  // Solicitud HTTP

        // Verificar que el estado es 404
        expect(response.status).toBe(404);

        // Verificar el mensaje de error
        expect(response.body.message).toBe('Usuario no encontrado');
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        // Simular un error interno en el modelo Usuarios
        jest.spyOn(Usuarios, 'findOne').mockImplementation(() => { // Espiar el método findOne
            throw new Error('Simulated error'); // Simular un error interno
        });

        // Hacer una solicitud GET para obtener el usuario por ID
        const response = await request(app).get('/api/users/usuario1');  // Solicitud HTTP

        // Verificar que el estado es 500
        expect(response.status).toBe(500);

        // Verificar el mensaje de error
        expect(response.body.message).toBe('Error interno del servidor');
    });
});
