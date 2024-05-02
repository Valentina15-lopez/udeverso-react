import { DataTypes } from 'sequelize'; // Importar el tipo de dato
import sequelize from '../config/database.js'; // Importar la instancia de la clase Sequelize

const Usuarios = sequelize.define('Usuarios', {
    usuario: { // ID
        type: DataTypes.STRING, // Tipo de dato: STRING
        primaryKey: true // Clave primaria
    },
    contrasenia: { // Contraseña
        type: DataTypes.STRING // Tipo de dato: STRING
    },
    nombre_para_mostrar: { // Nombre para mostrar
        type: DataTypes.STRING // Tipo de dato: STRING
    },
    correo: { // Correo
        type: DataTypes.STRING, // Tipo de dato: STRING
        unique: true  // Valores únicos
    },
    es_estudiante: { // Es estudiante
        type: DataTypes.BOOLEAN // Tipo de dato: BOOLEAN
    }
},{
    tableName:"users", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default Usuarios;
