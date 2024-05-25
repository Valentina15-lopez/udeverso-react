import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importa tu aplicación Express
import Usuarios from '../../src/models/Usuarios.js'; // Importa el modelo Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint DELETE /api/users/:usuario', () => { // Grupo de pruebas para el endpoint DELETE /api/users/:usuario
    let server; // Variable para el servidor Express

    // Configurar el servidor antes de las pruebas
    beforeEach(async () => { // Antes de cada prueba
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint DELETE /api/users/:usuario."); // Mostrar el puerto usado
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cierra el servidor para liberar el puerto
        }
        await Usuarios.destroy({ where: {} });  // Limpiar datos de prueba

    });

    it('Debe eliminar el usuario y devolver estado 200', async () => { // Prueba para eliminar un usuario
        // Crear un usuario de prueba para eliminar
        const usuario = await Usuarios.create({
            usuario: 'usuario1', // Datos del usuario
            contrasenia: 'password1', // Contraseña
            nombre_para_mostrar: 'Usuario Uno', // Nombre para mostrar
            correo: 'usuario1@example.com', // Correo
            rol: 'alumno', // Es estudiante
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

    it('Debe devolver 404 si el usuario no se encuentra', async () => { // Prueba para usuario no encontrado
        // Hacer una solicitud DELETE para eliminar un usuario que no existe
        const response = await request(app).delete('/api/users/usuarioInexistente');  // Solicitud HTTP

        expect(response.status).toBe(404);  // Verificar que el estado es 404
        expect(response.body.message).toBe("Usuario no encontrado");  // Mensaje de error
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        // Simular un error interno para verificar el manejo de errores
        jest.spyOn(Usuarios, 'destroy').mockImplementation(() => { // Espiar el método destroy
            throw new Error('Simulated error'); // Simular un error interno
        });

        // Hacer una solicitud DELETE para eliminar un usuario
        const response = await request(app).delete('/api/users/usuario1');  // Solicitud HTTP

        expect(response.status).toBe(500);  // Verificar que el estado es 500
        expect(response.body.message).toBe("Error interno del servidor");  // Mensaje de error
    });
});
