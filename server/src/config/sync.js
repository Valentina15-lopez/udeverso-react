// sync.js
const sequelize = require('./database'); // Importar la instancia de la clase Sequelize
const Usuario = require('../models/Usuarios.js'); // Importar el modelo Usuario
const Sala = require('../models/Sala.js'); // Importar el modelo Sala
const UsuariosSalas = require('../models/UsuariosSalas.js'); // Importar el modelo UsuariosSalas
const UsuarioMateriales = require('../models/UsuariosMateriales.js'); // Importar el modelo UsuarioMateriales

sequelize.sync({ force: false })  // `force: true` elimina y recrea las tablas
    .then(() => { // Promesa que se ejecuta si la sincronización fue exitosa
        console.log('Sincronización con la base de datos exitosa');
    })
    .catch((error) => { // Promesa que se ejecuta si hubo un error en la sincronización
        console.error('Error al sincronizar con la base de datos:', error);
    });
