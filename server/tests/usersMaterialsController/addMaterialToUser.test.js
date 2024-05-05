import request from 'supertest'; // Importar el módulo supertest
import {app} from '../../index.js';  // Importar la aplicación Express
import UsuariosMateriales from '../../src/models/UsuariosMateriales.js';  // Modelo del material
import http from 'http'; // Importar el módulo http
import path from 'path'; // Importar el módulo path
import Usuarios from "../../src/models/Usuarios.js"; // Modelo de Usuarios
import portfinder from "portfinder";  // Para manejar rutas de archivos

describe('Endpoint POST /api/users/material', () => { // Grupo de pruebas para el endpoint POST /api/users/material
    let server; // Variable para el servidor Express

    beforeEach(async () => { // Configurar el servidor antes de las pruebas
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor si está corriendo
        }

        server = http.createServer(app);  // Crear el servidor
        const PORT = await portfinder.getPortPromise({ startPort: 8000, stopPort: 9000 }); // Buscar un puerto disponible
        //console.log("Usando el puerto " + PORT + " para las pruebas de Endpoint POST /api/users/material.");
        await server.listen(PORT); // Iniciar el servidor en el puerto encontrado
        await UsuariosMateriales.destroy({ where: {} });  // Limpiar la tabla de materiales
        await Usuarios.destroy({ where: {} }); // Limpiar la tabla de usuarios
    });

    afterEach(async () => { // Después de cada prueba
        jest.restoreAllMocks();  // Restaurar todos los mocks
        if (server && server.listening) { // Si el servidor está corriendo
            await server.close();  // Cerrar el servidor
        }
        await UsuariosMateriales.destroy({ where: {} });  // Limpiar datos de prueba
        await Usuarios.destroy({ where: {} }); // Limpiar la tabla de usuarios
    });

    it('Debe agregar material para un usuario', async () => { // Prueba para agregar material a un usuario
        const user = await Usuarios.create({ usuario: 'usuario1', contrasenia: '1234' }); // Crear un usuario
        // Simular un archivo para cargar
        const fakeFilePath = path.join(__dirname, 'testfile.txt');  // Ruta de un archivo de prueba
        const fakeFileContent = 'contenido de prueba';  // Contenido para el archivo
        const fs = require('fs');  // Importar sistema de archivos
        fs.writeFileSync(fakeFilePath, fakeFileContent);  // Crear el archivo temporalmente

        const response = await request(app) // Hacer una solicitud POST
            .post('/api/users/material')  // Endpoint para agregar material
            .field('usuario', user.usuario)  // Datos del usuario
            .field('nombre', 'material de prueba')  // Nombre del material
            .field('ext', '.txt')  // Extensión del archivo
            .attach('archivo', fakeFilePath);  // Adjuntar el archivo

        expect(response.status).toBe(200);  // Esperar respuesta exitosa
        expect(response.body.nombre).toBe('material de prueba');  // Verificar el nombre del material

        // Verificar que el material se haya agregado a la base de datos
        const materialAgregado = await UsuariosMateriales.findOne({
            where: { usuario: 'usuario1', nombre: 'material de prueba' },
        });

        expect(materialAgregado).not.toBeNull();  // Debería haberse agregado
        expect(materialAgregado.ext).toBe('.txt');  // Verificar la extensión

        // Limpieza del archivo de prueba
        fs.unlinkSync(fakeFilePath);  // Eliminar el archivo temporal
    });

    it('Debe devolver 500 si hay un error interno', async () => { // Prueba para error interno
        jest.spyOn(UsuariosMateriales, 'create').mockImplementation(() => { // Espiar el método create
            throw new Error('Simulated error');  // Simular error interno
        });

        const response = await request(app) // Hacer una solicitud POST
            .post('/api/users/material')  // Endpoint para agregar material
            .field('usuario', 'usuario1')  // Datos del usuario
            .field('nombre', 'material con error')  // Nombre del material
            .field('ext', '.txt')  // Extensión del archivo
            .attach('material', Buffer.from('contenido con error'));  // Cargar material con error

        expect(response.status).toBe(500);  // Debería devolver estado 500
        expect(response.body.message).toBe('Error al agregar material');  // Mensaje esperado
    });
});
