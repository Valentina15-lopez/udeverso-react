import dotenv from 'dotenv';
dotenv.config({ path: `.env.${process.env.NODE_ENV || 'test'}` });  // Cargar el archivo correspondiente

import { Sequelize } from 'sequelize';

const databaseConfig = {
    test: {
        username: process.env.TEST_DB_USER,
        password: process.env.TEST_DB_PASS,
        database: process.env.TEST_DB_NAME,
        host: process.env.TEST_DB_HOST,
        dialect: 'postgres',
        logging: false,
    },
    production: {
        username: process.env.PROD_DB_USER,
        password: process.env.PROD_DB_PASS,
        database: process.env.PROD_DB_NAME,
        host: process.env.PROD_DB_HOST,
        dialect: 'postgres',
        logging: false,
    },
};

const currentEnvironment = process.env.NODE_ENV || 'test';  // Entorno por defecto
const sequelizeConfig = databaseConfig[currentEnvironment];  // Configuración según el entorno

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

export default sequelize;
