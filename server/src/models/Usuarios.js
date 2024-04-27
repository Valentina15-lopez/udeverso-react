import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Usuarios = sequelize.define('Usuarios', {
    usuario: {
        type: DataTypes.STRING,  // Asegúrate de usar la referencia correcta
        primaryKey: true
    },
    contrasenia: {
        type: DataTypes.STRING
    },
    nombre_para_mostrar: {
        type: DataTypes.STRING
    },
    correo: {
        type: DataTypes.STRING,
        unique: true  // Esto garantiza que el correo no se duplique
    },
    es_estudiante: {
        type: DataTypes.BOOLEAN
    }
},{
    tableName:"users", //nombre de la tabla
    timestamps: true  // Permite que Sequelize maneje `createdAt` y `updatedAt`
});

export default Usuarios;  // Exportación correcta para ES Modules
