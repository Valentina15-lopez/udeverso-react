import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuarios from "./Usuarios.js";
import Salas from "./Sala.js";


const UsuariosSalas = sequelize.define('UsuariosSalas', {
    user_id: {
        type: DataTypes.STRING,
        references: {
            model: 'Usuario',// Referencia al modelo Usuario
            key: 'usuario'
        },
        primaryKey: true  // Parte de la clave primaria compuesta
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Sala',  // Referencia al modelo Sala
            key: 'id'
        },
        primaryKey: true  // Parte de la clave primaria compuesta
    }
},{
    tableName:"user_salas", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

// Un usuario puede tener muchas salas
Usuarios.hasMany(UsuariosSalas, {
    foreignKey: 'user_id',  // Clave foránea en UsuariosSalas
    sourceKey: 'usuario',  // Clave primaria en Usuario
    as: 'salas',  // Alias para la relación
});

// Una sala puede tener muchos usuarios asociados
Salas.hasMany(UsuariosSalas, {
    foreignKey: 'room_id',  // Clave foránea en UsuariosSalas
    sourceKey: 'id',  // Clave primaria en Sala
    as: 'usuarios',  // Alias para la relación
});

export default UsuariosSalas;