import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Salas from '../../src/models/Sala.js'; // Importa el modelo de Salas
import Usuarios from '../../src/models/Usuarios.js'; // Importa el modelo de Usuarios
import UsuariosSalas from '../../src/models/UsuariosSalas.js'; // Importa el modelo de UsuariosSalas
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint POST /api/users/:userId/salas', () => { // Grupo de pruebas para el endpoint POST /api/users/:userId/salas
    let server; // Variable para el servidor Express

    beforeEach(async () => { // Configurar el servidor antes de las pruebas
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint POST /api/users/:userId/salas.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await UsuariosSalas.destroy({ where: {} });  // Limpiar la tabla de usuarios-salas
        await Usuarios.destroy({ where: {} });  // Limpiar la tabla de usuarios
        await Salas.destroy({ where: {} });  // Limpiar la tabla de salas
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restaurar todos los mocks

        // Cerrar el servidor si está corriendo
        if (server && server.listening) {// Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }

        try {
            await UsuariosSalas.destroy({ where: {} });  // Limpiar usuarios-salas
            await Usuarios.destroy({ where: {} });  // Limpiar usuarios
            await Salas.destroy({ where: {} });  // Limpiar salas
        } catch (error) { // Manejar errores
            console.error('Error al limpiar datos:', error);
        }

    });


    it('Debe asignar un usuario a las salas correctamente', async () => { // Prueba para asignar un usuario a las salas
        // Crear un usuario y salas de prueba
        const usuario = await Usuarios.create({ usuario: 'user1', contrasenia: 'password1' }); // Crear usuario
        const sala1 = await Salas.create({ descripcion: 'Sala 1' }); // Crear sala 1
        const sala2 = await Salas.create({ descripcion: 'Sala 2' }); // Crear sala 2

        const response = await request(app) // Hacer una solicitud POST
            .post(`/api/users/${usuario.usuario}/salas`) // Endpoint para asignar usuario a salas
            .send({ salaIds: [sala1.id, sala2.id] });  // Enviar solicitud con los IDs de salas

        expect(response.status).toBe(201);  // Verificar éxito
        expect(response.body.message).toBe("Usuario asignado a las salas exitosamente.");  // Mensaje esperado

        // Verificar que el usuario se agregó a las salas correctas
        const userSala1 = await UsuariosSalas.findOne({ // Buscar usuario en sala 1
            where: { user_id: usuario.usuario, sala_id: sala1.id },
        });
        const userSala2 = await UsuariosSalas.findOne({ // Buscar usuario en sala 2
            where: { user_id: usuario.usuario, sala_id: sala2.id },
        });

        expect(userSala1).not.toBeNull();  // El usuario debería estar en sala 1
        expect(userSala2).not.toBeNull();  // El usuario debería estar en sala 2
    });

    it('Debe devolver 400 si salaIds no es un array', async () => { // Prueba para salaIds incorrecto
        const response = await request(app) // Hacer una solicitud POST
            .post('/api/users/user1/salas')  // Solicitud con entrada incorrecta
            .send({ salaIds: 'not-an-array' });  // Valor incorrecto para salaIds

        expect(response.status).toBe(400);  // Debería devolver error de cliente
        expect(response.body.message).toBe("salaIds debe ser un array");  // Mensaje esperado
    });

    it('Debe devolver 500 si ocurre un error interno', async () => { // Prueba para error interno
        jest.spyOn(UsuariosSalas, 'create').mockImplementation(() => { // Espiar el método create
            throw new Error('Simulated error');  // Simular un error interno
        });

        const response = await request(app) // Hacer una solicitud POST
            .post('/api/users/user1/salas') // Solicitud con error interno
            .send({ salaIds: [1, 2, 3] }); // Enviar datos de salas

        expect(response.status).toBe(500);  // Verificar error interno
        expect(response.body.message).toBe("Error al asignar usuario a salas.");  // Mensaje esperado
    });
});
