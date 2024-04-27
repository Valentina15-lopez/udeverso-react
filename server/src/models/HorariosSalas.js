import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const HorariosSalas = sequelize.define('HorariosSalas', {
    id:{
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    sala_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: 'Sala',  // Referencia al modelo Sala
            key: 'id'
        }
    },
    dia_semana:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    hora_inicio:{
        type: DataTypes.TIME,
        allowNull: false
    },
    hora_fin:{
        type: DataTypes.TIME,
        allowNull: false
    }
},{
    tableName:"horarios_salas", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default HorariosSalas;