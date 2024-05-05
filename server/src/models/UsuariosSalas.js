import { DataTypes } from 'sequelize'; // Importar el tipo de dato
import sequelize from '../config/database.js'; // Importar la instancia de la clase Sequelize
import Usuarios from "./Usuarios.js"; // Importar el modelo Usuarios
import Salas from "./Sala.js"; // Importar el modelo Salas


const UsuariosSalas = sequelize.define('UsuariosSalas', {
    user_id: { // Usuario
        type: DataTypes.STRING, // Tipo de dato: STRING
        references: { // Referencia a otra tabla
            model: Usuarios,// Referencia al modelo Usuario
            key: 'usuario' // Clave foránea que apunta a `usuario`
        },
        primaryKey: true  // Parte de la clave primaria compuesta
    },
    sala_id: { // Sala
        type: DataTypes.INTEGER, // Tipo de dato: INTEGER
        references: { //
            model: Salas,  // Referencia al modelo Sala
            key: 'id' // Clave foránea que apunta a `id`
        },
        primaryKey: true  // Parte de la clave primaria compuesta
    }
},{
    tableName:"user_salas", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default UsuariosSalas;