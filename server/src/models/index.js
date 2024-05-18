//tenemos un problema de dependencias circulares y con este archivo se busca solucionar eso.

import Usuarios from './Usuarios.js'; // Importar el modelo Usuarios
import UsuariosMateriales from './UsuariosMateriales.js'; // Importar el modelo UsuariosMateriales
import Salas from "./Sala.js"; // Importar el modelo Sala
import HorariosSalas from "./HorariosSalas.js"; // Importar el modelo HorariosSalas
import UsuariosSalas from "./UsuariosSalas.js"; // Importar el modelo UsuariosSalas

// Un usuario puede tener muchos materiales
Usuarios.hasMany(UsuariosMateriales, {
    foreignKey: 'usuario',  // La clave foránea en `UsuariosMateriales`
    sourceKey: 'usuario',  // La clave primaria en `Usuarios`
    as: 'materiales',  // Alias para la relación
});

// UsuarioMateriales pertenece a Usuarios
UsuariosMateriales.belongsTo(Usuarios, {
    foreignKey: 'usuario',  // La clave foránea en `UsuariosMateriales`
    targetKey: 'usuario',  // Clave primaria en `Usuarios`
    as: 'propietario',
});

// Una sala puede tener muchos horarios
Salas.hasMany(HorariosSalas, {
    foreignKey: 'sala_id',  // Clave foránea en HorariosSalas
    sourceKey: 'id',  // Clave primaria en Salas
    as: 'horarios',  // Alias para la relación
});

// HorariosSalas pertenece a Salas
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

// UsuariosSalas pertenece a Usuarios
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

// UsuariosSalas pertenece a Salas
UsuariosSalas.belongsTo(Salas, {
    foreignKey: 'sala_id',
    targetKey: 'id',
    as: 'sala',  // Alias para la relación
});

// Exportar los modelos para uso global
export { Usuarios, UsuariosMateriales, Salas, HorariosSalas, UsuariosSalas };