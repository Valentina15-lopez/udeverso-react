import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js';  // Importar la aplicación Express
import UsuariosMateriales from '../../src/models/UsuariosMateriales.js';  // Modelo de materiales
import http from 'http'; // Importa el módulo http
import Usuarios from "../../src/models/Usuarios.js"; // Modelo de Usuarios
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint DELETE /api/users/:usuario/material/:nombre', () => { // Grupo de pruebas para el endpoint DELETE /api/users/:usuario/material/:nombre
    let server; // Variable para el servidor Express

    beforeEach(async () => { // Configurar el servidor antes de las pruebas
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint DELETE /api/users/:usuario/material/:nombre.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await UsuariosMateriales.destroy({ where: {} });  // Limpiar materiales
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks

        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }

        try {
            await UsuariosMateriales.destroy({ where: {} });  // Limpiar la tabla
        } catch (error) {
            console.error('Error al limpiar datos:', error); // Manejar errores
        }

    });

    it('Debe eliminar el material de un usuario y devolver estado 200', async () => { // Prueba para eliminar un material
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' }); // Crear un usuario
        // Crear un material de prueba para un usuario
        await UsuariosMateriales.create({
            usuario: user.usuario,
            nombre: 'material1',
            ext: '.txt',
            material: Buffer.from('contenido del material'),
        });

        const response = await request(app) // Hacer una solicitud DELETE
            .delete('/api/users/usuario1/material/material1')  // Solicitud para eliminar un material
            .expect(200);  // Debería responder con estado 200

        expect(response.text).toBe("Material borrado con éxito");  // Mensaje esperado

        // Verificar que el material realmente fue eliminado
        const material = await UsuariosMateriales.findOne({
            where: { usuario: 'usuario1', nombre: 'material1' },
        });

        expect(material).toBeNull();  // El material no debería existir más
    });

    it('Debe devolver 404 si el material no se encuentra', async () => { // Prueba para material inexistente
        const response = await request(app) // Hacer una solicitud DELETE
            .delete('/api/users/usuario1/material/materialInexistente')  // Solicitud para eliminar un material inexistente
            .expect(404);  // Debería responder con estado 404

        expect(response.text).toBe("Material no encontrado");  // Mensaje esperado
    });

    it('Debe devolver 500 si ocurre un error interno', async () => { // Prueba para error interno
        jest.spyOn(UsuariosMateriales, 'destroy').mockImplementation(() => { // Espiar el método destroy
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app) // Hacer una solicitud DELETE
            .delete('/api/users/usuario1/material/material1')  // Solicitud para eliminar
            .expect(500);  // Debería responder con estado 500

        expect(response.body.message).toBe("Error del servidor");  // Mensaje esperado
    });
});
