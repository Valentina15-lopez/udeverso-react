import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import {Usuarios} from './index.js';

const UsuariosMateriales = sequelize.define('UsuariosMateriales', {
    usuario: {
        type: DataTypes.STRING,
        allowNull: false,  // No se permite nulo
        references: {
            model: Usuarios,  // Referencia al modelo Usuario
            key: 'usuario',  // Clave foránea apunta a `usuario` en `Usuario`
        },
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false,  // No se permite nulo
    },
    ext: {
        type: DataTypes.STRING,
    },
    material: {
        type: DataTypes.BLOB,  // Almacena datos binarios (por ejemplo, archivos)
    },
    // Clave primaria compuesta por `usuario` y `nombre`
}, {
    tableName: 'usuario_material',  // Nombre de la tabla en la base de datos
    timestamps: true,  // Permite que Sequelize maneje `createdAt` y `updatedAt`
    indexes: [
        {
            unique: true,
            fields: ['usuario', 'nombre'],  // Clave primaria compuesta
        }
    ],
});

export default UsuariosMateriales;
