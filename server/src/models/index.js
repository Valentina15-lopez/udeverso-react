//tenemos un problema de dependencias circulares y con este archivo se busca solucionar eso.

import Usuarios from './Usuarios.js';
import UsuariosMateriales from './UsuariosMateriales.js';
import Salas from "./Sala.js";
import HorariosSalas from "./HorariosSalas.js";
import UsuariosSalas from "./UsuariosSalas.js";

// Definir asociaciones después de importar todos los modelos
Usuarios.hasMany(UsuariosMateriales, {
    foreignKey: 'usuario',  // La clave foránea en `UsuariosMateriales`
    sourceKey: 'usuario',  // La clave primaria en `Usuarios`
    as: 'materiales',  // Alias para la relación
});

UsuariosMateriales.belongsTo(Usuarios, {
    foreignKey: 'usuario',  // La clave foránea en `UsuariosMateriales`
    targetKey: 'usuario',  // Clave primaria en `Usuarios`
    as: 'propietario',
});

// Asociación con horarios
Salas.hasMany(HorariosSalas, {
    foreignKey: 'sala_id',  // Clave foránea en HorariosSalas
    sourceKey: 'id',  // Clave primaria en Salas
    as: 'horarios',  // Alias para la relación
});

// Definir la relación con el modelo Sala
HorariosSalas.belongsTo(Salas, {
    foreignKey: 'sala_id',  // La clave foránea que apunta a Sala
    targetKey: 'id',  // Clave primaria en Sala
    as: 'sala',  // Alias para la relación
});

// Un usuario puede tener muchas salas
Usuarios.hasMany(UsuariosSalas, {
    foreignKey: 'user_id',  // Clave foránea en UsuariosSalas
    sourceKey: 'usuario',  // Clave primaria en Usuario
    as: 'salas',  // Alias para la relación
});

UsuariosSalas.belongsTo(Usuarios, {
    foreignKey: 'user_id',
    targetKey: 'usuario',
    as: 'usuario',  // Alias para la relación
});

// Una sala puede tener muchos usuarios asociados
Salas.hasMany(UsuariosSalas, {
    foreignKey: 'sala_id',  // Clave foránea en UsuariosSalas
    sourceKey: 'id',  // Clave primaria en Sala
    as: 'usuarios',  // Alias para la relación
});

UsuariosSalas.belongsTo(Salas, {
    foreignKey: 'sala_id',
    targetKey: 'id',
    as: 'sala',  // Alias para la relación
});

// Exportar los modelos para uso global
export { Usuarios, UsuariosMateriales, Salas, HorariosSalas, UsuariosSalas };