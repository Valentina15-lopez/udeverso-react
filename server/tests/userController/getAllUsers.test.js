import request from 'supertest';
import app from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js';
import http from 'http';

describe('Endpoint GET /api/users', () => {
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

    it('Debe devolver todos los usuarios con estado 200', async () => {
        // Crear usuarios de ejemplo para la prueba
        await Usuarios.bulkCreate([
            {
                usuario: 'usuario1',
                contrasenia: 'password1',
                nombre_para_mostrar: 'Usuario Uno',
                correo: 'usuario1@example.com',
                es_estudiante: true,
            },
            {
                usuario: 'usuario2',
                contrasenia: 'password2',
                nombre_para_mostrar: 'Usuario Dos',
                correo: 'usuario2@example.com',
                es_estudiante: false,
            },
        ]);

        // Hacer una solicitud GET para obtener todos los usuarios
        const response = await request(app)
            .get('/api/users')
            .expect(200);  // Esperar estado 200

        // Verificar que se devolvieron dos usuarios
        expect(response.body.length).toBe(2);

        // Verificar detalles de los usuarios
        expect(response.body[0].usuario).toBe('usuario1');
        expect(response.body[1].usuario).toBe('usuario2');
    });

    it('Debe devolver 500 si hay un error interno', async () => {
        // Simular un error en el modelo
        jest.spyOn(Usuarios, 'findAll').mockImplementation(() => {
            throw new Error('Simulated error');
        });

        // Solicitar el endpoint GET /api/users y guardar la respuesta
        const response = await request(app).get('/api/users');  // Realiza la solicitud

        // Verificar el estado de la respuesta
        expect(response.status).toBe(500);  // Esperar estado 500 (error interno)

        // Verificar el mensaje de error
        expect(response.body.message).toBe('Error interno del servidor');  // Verificar mensaje

    });
});
