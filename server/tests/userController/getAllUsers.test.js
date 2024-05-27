import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js'; // Importa el modelo Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint GET /api/users', () => { // Grupo de pruebas para el endpoint GET /api/users
    let server; // Variable para el servidor Express

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint Endpoint GET /api/users."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

    });

    it('Debe devolver todos los usuarios con estado 200', async () => { // Prueba para obtener todos los usuarios
        // Crear usuarios de ejemplo para la prueba
        await Usuarios.bulkCreate([
            {
                usuario: 'usuario1',
                contrasenia: 'password1',
                nombre_para_mostrar: 'Usuario Uno',
                correo: 'usuario1@example.com',
                rol: 'alumno',
            },
            {
                usuario: 'usuario2',
                contrasenia: 'password2',
                nombre_para_mostrar: 'Usuario Dos',
                correo: 'usuario2@example.com',
                rol: 'profesor',
            },
        ]);

        // Hacer una solicitud GET para obtener todos los usuarios
        const response = await request(app) // Realizar la solicitud
            .get('/api/users') // Hacer una solicitud GET a /api/users
            .expect(200);  // Esperar estado 200

        // Verificar que se devolvieron dos usuarios
        expect(response.body.length).toBe(2);

        // Verificar detalles de los usuarios
        expect(response.body[0].usuario).toBe('usuario1');
        expect(response.body[0].rol).toBe('alumno');
        expect(response.body[1].usuario).toBe('usuario2');
        expect(response.body[0].rol).toBe('profesor');
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        // Simular un error en el modelo
        jest.spyOn(Usuarios, 'findAll').mockImplementation(() => { // Espiar el método findAll
            throw new Error('Simulated error'); // Simular un error interno
        });

        // Solicitar el endpoint GET /api/users y guardar la respuesta
        const response = await request(app).get('/api/users');  // Realiza la solicitud

        // Verificar el estado de la respuesta
        expect(response.status).toBe(500);  // Esperar estado 500 (error interno)

        // Verificar el mensaje de error
        expect(response.body.message).toBe('Error interno del servidor');  // Verificar mensaje

    });
});
