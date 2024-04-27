// sync.js
const sequelize = require('./database');
const Usuario = require('../models/Usuarios.js');
const Sala = require('../models/Sala.js');
const UsuariosSalas = require('../models/UsuariosSalas.js');
const UsuarioMateriales = require('../models/UsuariosMateriales.js');

sequelize.sync({ force: false })  // `force: true` elimina y recrea las tablas
    .then(() => {
        console.log('Sincronización con la base de datos exitosa');
    })
    .catch((error) => {
        console.error('Error al sincronizar con la base de datos:', error);
    });
