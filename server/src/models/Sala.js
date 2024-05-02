import { DataTypes } from 'sequelize'; // Importar el tipo de dato
import sequelize from '../config/database.js'; // Importar la instancia de la clase Sequelize

const Salas = sequelize.define('Salas', {
    id: { // ID
        type: DataTypes.INTEGER, // Tipo de dato: INTEGER
        primaryKey: true, // Clave primaria
        autoIncrement: true // Autoincremental
    },
    descripcion: { // Descripción
        type: DataTypes.TEXT, // Tipo de dato: TEXT
        allowNull: false // No permitir valores nulos
    }
},{
    tableName:"salas", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});



export default Salas;