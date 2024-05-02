import request from 'supertest'; // Importa el módulo supertest
import {app} from '../../index.js'; // Importa tu aplicación Express
import UsuariosSalas from '../../src/models/UsuariosSalas.js'; // Importa el modelo UsuariosSalas
import Salas from '../../src/models/Sala.js'; // Importa el modelo Salas
import Usuarios from '../../src/models/Usuarios.js'; // Importa el modelo Usuarios
import http from 'http'; // Importa el módulo http
import portfinder from "portfinder"; // Importa el módulo portfinder

describe('Endpoint DELETE /api/users/:userId/salas/:salaId', () => { // Grupo de pruebas para el endpoint DELETE /api/users/:userId/salas/:salaId
    let server; // Variable para el servidor Express

    beforeEach(async () => { // Configurar el servidor antes de las pruebas
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app); // Crear el servidor Express
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint DELETE /api/users/:userId/salas/:salaId.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await UsuariosSalas.destroy({ where: {} }); // Limpiar la tabla de usuarios-salas
        await Salas.destroy({ where: {} }); // Limpiar la tabla de salas
        await Usuarios.destroy({ where: {} }); // Limpiar la tabla de usuarios
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restablecer todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor para liberar el puerto
        }

    });

    it('Debe eliminar correctamente al usuario de la sala y devolver estado 200', async () => { // Prueba para eliminar un usuario de una sala
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' }); // Crear usuario
        const sala = await Salas.create({ descripcion: 'Sala de Prueba' }); // Crear sala
        await UsuariosSalas.create({ user_id: user.usuario, sala_id: sala.id }); // Crear relación

        const response = await request(app) // Hacer una solicitud DELETE
            .delete(`/api/users/${user.usuario}/salas/${sala.id}`) // Endpoint para eliminar usuario de sala
            .expect(200); // Esperar estado 200

        expect(response.text).toBe("Usuario eliminado de la sala.");  // Verificar mensaje
        const result = await UsuariosSalas.findOne({ // Buscar relación
            where: { user_id: user.usuario, sala_id: sala.id },
        });
        expect(result).toBeNull();  // Verificar que la relación fue eliminada
    });

    it('Debe devolver 404 si la relación entre usuario y sala no se encuentra', async () => { // Prueba para relación inexistente
        const response = await request(app) // Hacer una solicitud DELETE
            .delete(`/api/users/usuarioInexistente/salas/999`) // Endpoint para eliminar usuario de sala
            .expect(404); // Esperar estado 404

        expect(response.text).toBe("No se encontró la relación entre usuario y sala.");  // Mensaje esperado
    });

    it('Debe devolver 500 si ocurre un error interno', async () => { // Prueba para error interno
        jest.spyOn(UsuariosSalas, 'destroy').mockImplementation(() => { // Espiar método destroy
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app) // Hacer una solicitud DELETE
            .delete(`/api/users/usuario1/salas/1`) // Endpoint para eliminar usuario de sala
            .expect(500); // Esperar estado 500

        expect(response.body.message).toBe("Error al eliminar usuario de la sala.");  // Verificar mensaje de error
    });
});
