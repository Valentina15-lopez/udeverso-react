import { DataTypes } from 'sequelize'; // Importar el tipo de dato
import sequelize from '../config/database.js'; // Importar la instancia de la clase Sequelize
import Usuarios from './Usuarios.js'; // Importar el modelo Usuarios

const UsuariosMateriales = sequelize.define('UsuariosMateriales', {
    usuario: { // Usuario
        type: DataTypes.STRING, // Tipo de dato: STRING
        allowNull: false, // No permitir valores nulos
        references: { // Referencia a otra tabla
            model: Usuarios,  // Referencia al modelo Usuario
            key: 'usuario', // Clave foránea que apunta a `usuario`
        },
        primaryKey: true,  // Parte de la clave primaria compuesta
    },
    nombre: { // Nombre del material
        type: DataTypes.STRING, // Tipo de dato: STRING
        allowNull: false, // No permitir valores nulos
        primaryKey: true,  // Parte de la clave primaria compuesta
    },
    ext: { // Extensión del material
        type: DataTypes.STRING, // Tipo de dato: STRING
    },
    material: { // Material
        type: DataTypes.BLOB,  // Datos binarios
    },
}, {
    tableName: 'usuario_material', // Nombre de la tabla
    timestamps: true, // Para `createdAt` y `updatedAt`
});

export default UsuariosMateriales;
