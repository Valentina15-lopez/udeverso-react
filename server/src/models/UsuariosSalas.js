import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuarios from "./Usuarios.js";
import Salas from "./Sala.js";


const UsuariosSalas = sequelize.define('UsuariosSalas', {
    user_id: {
        type: DataTypes.STRING,
        references: {
            model: Usuarios,// Referencia al modelo Usuario
            key: 'usuario'
        },
        primaryKey: true  // Parte de la clave primaria compuesta
    },
    sala_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Salas,  // Referencia al modelo Sala
            key: 'id'
        },
        primaryKey: true  // Parte de la clave primaria compuesta
    }
},{
    tableName:"user_salas", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default UsuariosSalas;