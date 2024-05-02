import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js'; // Importa la aplicación Express
import jwt from 'jsonwebtoken'; // Importa el módulo jsonwebtoken
import http from "http"; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

// Clave secreta para pruebas (debe coincidir con la utilizada en tu controlador)
const secretKey = 'miClaveSecreta';

describe('Endpoint GET /api/checkAuth', () => { // Grupo de pruebas para el endpoint GET /api/checkAuth

    let server; // Variable para el servidor Express

    beforeEach(async () => { // Configurar el servidor antes de las pruebas
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }
        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint GET /api/users/:usuario/material."); // Mensaje de depuración
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }
    });

    // Test para comprobar sin token
    it('Debe devolver 401 si no hay token', async () => { // Prueba para comprobar sin token
        const response = await request(app).get('/api/checkAuth'); // Hacer una solicitud GET
        expect(response.status).toBe(401);  // Sin token, debería devolver 401
    });

    // Test para comprobar con un token inválido
    it('Debe devolver 403 si el token es inválido', async () => {
        const response = await request(app) // Hacer una solicitud GET
            .get('/api/checkAuth') // Endpoint para comprobar autenticación
            .set('Cookie', `sessionToken=invalid_token`);  // Cookie con token inválido

        expect(response.status).toBe(403);  // Con token inválido, debería devolver 403
    });

    // Test para comprobar con un token válido
    it('Debe devolver 200 si el token es válido', async () => {
        // Crear un token válido
        const validToken = jwt.sign({ userId: 1 }, secretKey, { expiresIn: '1h' });

        const response = await request(app) // Hacer una solicitud GET
            .get('/api/checkAuth') // Endpoint para comprobar autenticación
            .set('Cookie', `sessionToken=${validToken}`);  // Cookie con token válido

        expect(response.status).toBe(200);  // Con token válido, debería devolver 200
    });
});
