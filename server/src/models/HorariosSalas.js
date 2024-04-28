import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Salas from './Sala.js';  // Asegúrate de importar el modelo Sala

const HorariosSalas = sequelize.define('HorariosSalas', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    sala_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Salas,  // Referencia correcta al modelo Sala
            key: 'id',  // Clave foránea que apunta a `id`
        },
    },
    dia_semana: {
        type: DataTypes.INTEGER,
        allowNull: false,  // No permitir valores nulos
    },
    hora_inicio: {
        type: DataTypes.TIME,
        allowNull: false,
    },
    hora_fin: {
        type: DataTypes.TIME,
        allowNull: false,
    },
}, {
    tableName: 'horarios_salas',  // Nombre de la tabla
    timestamps: true,  // Para `createdAt` y `updatedAt`
});

export default HorariosSalas;  
