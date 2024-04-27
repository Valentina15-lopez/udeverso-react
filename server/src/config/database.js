import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('udeverso', 'udeverso_user','puerta2024',{
    host : 'localhost',dialect: "postgres",logging: false});

sequelize.authenticate().
then(()=>{console.log("Conexión a la base de datos exitosa");})
    .catch((error)=>{console.log("Error al conectar a la base de datos:", error)});

//module.exports = sequelize
export default sequelize;