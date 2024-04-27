import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import Usuarios from './Usuarios.js';

const UsuariosMateriales = sequelize.define('UsuariosMateriales', {
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,
        references: {
            model: Usuarios,  // Referencia al modelo Usuario
            key: 'usuario',
        },
        primaryKey: true,  // Parte de la clave primaria compuesta
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,  // Parte de la clave primaria compuesta
    },
    ext: {
        type: DataTypes.STRING,
    },
    material: {
        type: DataTypes.BLOB,  // Datos binarios
    },
}, {
    tableName: 'usuario_material',
    timestamps: true,
});

export default UsuariosMateriales;
