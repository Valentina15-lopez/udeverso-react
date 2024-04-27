import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';


const UsuariosSalas = sequelize.define('UsuariosSalas', {
    user_id: {
        type: DataTypes.STRING,
        references: {
            model: 'Usuario',// Referencia al modelo Usuario
            key: 'usuario'
        }
    },
    room_id: {
        type: DataTypes.INTEGER,
        references: {
            model: 'Sala',  // Referencia al modelo Sala
            key: 'id'
        }
    },
    PRIMARY_KEY: {
        fields: ['user_id', 'room_id']
    }
},{
    tableName:"user_salas", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default UsuariosSalas;

