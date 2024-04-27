import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const Salas = sequelize.define('Salas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: false
    }
},{
    tableName:"sala", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default Salas;
