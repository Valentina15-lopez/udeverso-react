import dotenv from 'dotenv';
dotenv.config();  // Cargar variables de entorno desde .env

import { Sequelize } from 'sequelize';

const databaseConfig = {
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: 'postgres',  // O el dialecto de tu base de datos
        logging: false,  // No registrar SQL en el entorno de pruebas
    },
    production: {
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOST,
        dialect: 'postgres',  // Cambia según tu base de datos de producción
        logging: false,  // Generalmente, no se registran operaciones en producción
        // Otras configuraciones para producción, como SSL
    },
};

const currentEnvironment = process.env.NODE_ENV || 'test';  // Si no está definido, por defecto es pruebas
const sequelizeConfig = databaseConfig[currentEnvironment];  // Elegir configuración según entorno

const sequelize = new Sequelize(
    sequelizeConfig.database,
    sequelizeConfig.username,
    sequelizeConfig.password,
    {
        host: sequelizeConfig.host,
        dialect: sequelizeConfig.dialect,
        logging: sequelizeConfig.logging,
    }
);

export default sequelize;  // Exportar la instancia de Sequelize
