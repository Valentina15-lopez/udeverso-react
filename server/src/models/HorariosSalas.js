import { DataTypes } from 'sequelize'; // Importar el tipo de dato
import sequelize from '../config/database.js'; // Importar la instancia de la clase Sequelize
import Salas from './Sala.js';  // Importar el modelo Sala

const HorariosSalas = sequelize.define('HorariosSalas', {
    id: { // ID
        type: DataTypes.INTEGER, // Tipo de dato: INTEGER
        primaryKey: true, // Clave primaria
        autoIncrement: true, // Autoincremental
    },
    sala_id: { // ID de la sala
        type: DataTypes.INTEGER, // Tipo de dato: INTEGER
        allowNull: false, // No permitir valores nulos
        references: { // Referencia a otra tabla
            model: Salas,  // Referencia correcta al modelo Salas
            key: 'id',  // Clave foránea que apunta a `id`
        },
    },
    dia_semana: { // Día de la semana
        type: DataTypes.INTEGER, // Tipo de dato: INTEGER
        allowNull: false,  // No permitir valores nulos
    },
    hora_inicio: { // Hora de inicio
        type: DataTypes.TIME, // Tipo de dato: TIME
        allowNull: false, // No permitir valores nulos
    },
    hora_fin: { // Hora de fin
        type: DataTypes.TIME, // Tipo de dato: TIME
        allowNull: false, // No permitir valores nulos
    },
}, { // Configuración
    tableName: 'horarios_salas',  // Nombre de la tabla
    timestamps: true,  // Para `createdAt` y `updatedAt`
});

export default HorariosSalas;  
